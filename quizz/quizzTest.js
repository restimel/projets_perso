/*
	gestion de la liste de toutes les questions qui sont posées lors d'un test
	
	objet: quizzTest
	Propriétés: 
		liste (Array) : liste des questions
		length (number) : nombre de questions
		nbBonneReponse (number) : nombre de bonne réponses
		tempTotal (number) : temps total disponbile
		tempsPasse (number) : temps total passé sur le test
		timerInit (number timestamp) : timestamp correspondant au début du test
		timerLast (number timestamp) : timestamp correspondant au dernier résultat
		score (Array) : liste de tous les résultats de l'utilisateur. Liste d'objet:
			{
				id (number): id de la question,
				reponse (string): valeur choisie par l'utilisateur,
				bonneReponse (string): valeur de la bonne réponse,
				temps (number): temps passé sur la question
			}
		filtre (objet): filtre appliqué sur le questionnaire
	
	Méthodes:
		reponse(str) : l'utilisateur répond à la question courante
		displayQuestion() : permet d'afficher la question courante
		stop() : l'utilisateur arrête le test
*/

function quizzTest(){
	var elemThemes = document.getElementById("prepThemes"),
		elemNiveau = document.getElementById("prepNiveau"),
		filtre = {themes:[],niveau:[]},
		items, //liste des questions à poser
		i, li = elemThemes.options.length;
	
	//initialisation des propriétés
	this.nbBonneReponse = 0;
	this.tempTotal = document.getElementById("prepIsTime").checked ? document.getElementById("prepTime").value.replace(/^(?:(\d+):(\d+):)?(\d+)$/,function(mtf,h,mn,s){
			return parseInt(h,10)*3600+parseInt(mn,10)*60+parseInt(s,10);
			}) : 0;
	this.tempsPasse = 0;
	this.score = [];
	
	//création du filtre
	for(i=0;i<li;i++){
		if(elemThemes.options[i].selected){
			filtre.themes.push(elemThemes.options[i].value);
		}
	}
	if(filtre.themes.length === 0){
		filtre.themes.push("Tous");
	}
	
	li = elemNiveau.options.length;
	for(i=0;i<li;i++){
		if(elemNiveau.options[i].selected){
			filtre.niveau.push(elemNiveau.options[i].value);
		}
	}
	if(filtre.niveau.length === 0){
		filtre.niveau.push("-1");
	}
	
	this.length = parseInt(document.getElementById("prepNbQ").value,10)
	this.filtre = filtre;
	this.liste = quizzItems.get(this.filtre); //TODO limiter par le nombre de question
	this.length = this.liste.length;
	
	this.timerInit = this.timerLast = Date.now();
	
	//lancer la session de questions
	this.current = 0;
	this.displayQuestion();

}

//permet de rentrer une réponse de l'utilisateur
quizzTest.prototype.reponse = function(rps){
	var item = this.liste[this.current],
		score = {
			id : item.id,
			reponse : rps,
			bonneReponse : item.bonneReponse,
			temps : (Date.now() - this.timerLast)/1000
		};
	this.tempsPasse = (Date.now() - this.timerInit)/1000;
	this.score.push(score);
	if(item.bonneReponse === rps){
		this.nbBonneReponse++;
	}
	this.current++;
	this.displayQuestion();
	this.timerLast = Date.now();
};

//permet d'afficher une question
quizzTest.prototype.displayQuestion = function(){
	var item = this.liste[this.current];
	if(!item){
		alert("TODO fin des questions\n"+this.nbBonneReponse+"/"+this.length);
		//TODO fin
		return;
	}

	//affichage des questions
	var elemQst = document.getElementById("form_quizz"),
		elem = document.createDocumentFragment(),
		label,input,
		i, li=item.reponses.length;
		
	elemQst.innerHTML = "";
	
	for(i=0;i<li;i++){
		input = document.createElement("input");
		input.type = "radio";
		input.name = "reponsesQuizz";
		input.value = item.reponses[i];
		input.id = "reponse"+i;
		input.onchange = answerDirectQuizz;

		label = document.createElement("label");
		label.htmlFor = "reponse"+i;
		label.textContent = item.reponses[i];

		elem.appendChild(input);
		elem.appendChild(label);
		elem.appendChild(document.createElement("br"));		
	}
	
	elemQst.appendChild(elem);
	
	//affichage du code
	document.getElementById("questionCode").innerHTML = color(item.code,false);
	
	//(ré)affichage de la bonne section
	changeSession("quizzQuestion");
};

//permet d'arrêter le test en cours
quizzTest.prototype.stop = function(){
	alert("TODO: arreter le test"); //TODO
};

