/**
 * Global variable
**/

var currentTest = null; // test en cours

/**
 * Navigation
**/
//permet de changer la section active et d'en afficher une autre
var changeSession = function(){
	var activeSection = document.querySelector(".sectionActive");
	var copySection = document.getElementById("sectionCopy");

	//ajout de l'événement de fin de transition sur la section de copie
	copySection.addEventListener("transitionend", finTransition,true);
	copySection.addEventListener("webkitTransitionEnd", finTransition,true);

	function finTransition(){
		//remise à plat de la section de transition
		copySection.className = "";
		copySection.style.right = "";
		copySection.innerHTML = "";
	};
	
	//ajout des événements à tous les boutons de navigations
	var listeButton = document.querySelectorAll("nav button"),i,li=listeButton.length;
	for(i=0;i<li;i++){
		listeButton[i].onclick=changeSession;
	}
	
	return changeSession;
	
	function changeSession(id){
		//changement de section
		if(typeof id !== "string" && typeof this.id === "string") id = this.id.substr(4);
		var section = document.getElementById(id);
		activeSection.className="";
		
		//copie de la section active dans la section de transition
		copySection.appendChild(activeSection.cloneNode(true));
		copySection.className = "moveToLeft";
		setTimeout(finTransition,1000); //au cas où l'événement de fin ne se déclenche pas
		setTimeout(function(){copySection.style.right = "100%";},10); // pour que l'animation CSS fonctionne, il faut que la valeur soir 'enregistrée'
		
		//affichage de la nouvelle section
		section.className = "sectionActive";
		activeSection = section;
	}
}();

/**
 * chargement des données
**/
(function(){
	var ajx = new XMLHttpRequest();
	ajx.onreadystatechange=function(){
		if(ajx.readyState===4 && (ajx.status===200 || ajx.status===0)){
			var qz = JSON.parse(ajx.responseText);
			qz.quizz.pop();
			quizzItems.liste = qz.quizz;
			quizzItems.init();
			
			//maj des listes de themes
			removeOptionTheme();
			createOptionTheme("Tous");
			quizzItems.themes.forEach(createOptionTheme);
			
			//maj du nombre max de questions
			document.getElementById("prepNbQ").max = quizzItems.length;
			
		}else{
			//console.debug("ajax : "+ajx.readyState+" "+ajx.status);
		}
		
		//supprime toutes les option des select de themes
		function removeOptionTheme(){
			var select = document.getElementById("prepThemes");
			while(select.length){
				select.remove(0);
			}
			select = document.getElementById("srchTheme");
			while(select.length){
				select.remove(0);
			}
		}
		
		//ajoute une nouvelle option aux select de themes
		function createOptionTheme(theme){
			var option = document.createElement("option");
			option.value = option.text = theme;
			document.getElementById("prepThemes").add(option);
			document.getElementById("srchTheme").add(option.cloneNode(true));
		}
	};
	ajx.open("get","./quizz.json",true);
	try{
		ajx.send(null);
	}catch(e){
		console.warn("Votre navigateur ne supporte pas l'AJAX\n"+e.message);
	}
})();

/**
 * Lancer le quizz
**/
function runQuizz(){
	currentTest = new quizzTest();
}

/**
 * verification de la réponse envoyé
**/
//vérification lorsque l'utilisateur a choisi sa réponse
function answerDirectQuizz(e){
	if(!document.getElementById("optAutoNext").checked){
		document.getElementById("btnRepondre").className = "ready";
		return;
	}
	currentTest.reponse(this.value);
}

//vérification lorsque l'utilisateur clique sur le bouton
function answerButtonQuizz(e){
	var reponse = document.querySelector("form#form_quizz input:checked");
	if(!reponse){ //l'utilisateur n'a pas sélectioné de réponse
		reponse = "";
	}else{
		reponse = reponse.value;
	}
	
	currentTest.reponse(reponse);
}

/**
 * Selection des questions
**/
//permet de (dé)sélectionner tous les input du tableau
function selectAll(){
	var listeInput = this.parentNode.parentNode.parentNode.querySelectorAll("input");
	if(this.textContent === "☑"){
		Array.prototype.forEach.call(listeInput,function(input){input.checked=true;});
	}else{
		Array.prototype.forEach.call(listeInput,function(input){input.checked=false;});
	}
	majSelectionneur.call(this);
}

//permet de mettre à jour la valeur de la première colonne du tableau afin de (dé)sélectionner les input 
function majSelectionneur(){
	var btn = this.parentNode.parentNode.parentNode.parentNode.querySelector("th"),
	liste = this.parentNode.parentNode.parentNode.parentNode.querySelectorAll("input:not(:checked)");
	if(liste.length){
		btn.textContent = "☑";
		btn.title = "Tout sélectionner";
	}else{
		btn.textContent = "☐";
		btn.title = "Tout désélectionner";
	}
}

//permet de préparer la liste qui sera envoyé à l'analyse
function prepareListForAnalyze(e){
	if(e.target.tagName === "INPUT") return;
	
	var section = searchParent.call(this,"section"),
		liste = section.querySelectorAll("table input:checked"),
		analyze = [],
		num = this.indexRow-1 || 0; //TODO lorsqu'on clique sur ligne et que toutes les lignes ne sont psa selectionner
	Array.prototype.forEach.call(liste,function(input){
		analyze.push(JSON.parse(input.value));
	});
	
	if(liste.length){
		displayAnalyze(analyze,section.id,num);
	}
}

/**
 * Section Analyze
**/
//permet d'afficher la section analyze
	//liste : liste des quizz à montrer {id,reponse}
		// id : id du quizz à afficher
		// reponse : reponse eventuelle donnée par l'utilisateur
	//elemBack : section de retour
	//num : numéro de la question de la liste à afficher en premier
function displayAnalyze(liste,elemBack,num){
	changeSession("quizzAnalyze");
	alert("TODO ");//TODO
	console.debug(liste);
}


/**
 * Initialisation des événements sur les éléments
**/
window.addEventListener("load",function(){
	//griser le temps dans la préparation du quizz
	document.getElementById("prepIsTime").onchange=function(){
		document.getElementById("prepTime").disabled=!this.checked;
	};
	document.getElementById("prepTime").disabled=!document.getElementById("prepIsTime").checked;
	
	//Utilisation du bouton "Lancer le Quizz"
	document.getElementById("prepRunQuizz").onclick = runQuizz;
	
	//utilisation du bouton "répondre"
	document.getElementById("btnRepondre").onclick = answerButtonQuizz;
	
	//bouton (dé)sélectionner
	document.getElementById("rsltSelect").onclick = selectAll;
	
	//bouton d'analyse
	document.querySelector("#quizzResult>button").onclick = prepareListForAnalyze;
},false);



/**
 * Fonctions diverses pouvant être utilisées partour
**/

//retourne le premier parent du type TAG
function searchParent(tag){
	var elem = this;
	while(elem.parentNode){
		elem = elem.parentNode;
		if(elem.tagName === tag.toUpperCase()) return elem;
	}
	return null;
}

//retourne une chaine correpondant au nom de la difficultée
function niveauToString(niveau){
	var niveauStr = ["Débutant","Facile","Moyen","Assez difficile","Difficile","Très difficile"][niveau];
	if(typeof niveauStr === "undefined"){
		niveauStr = "Tous";
	}
	return niveauStr;
}

//retourne une chaine correpondant au format de temps adapté (00:12:25)
function timeFormat(tmps){
	tmps = Math.floor(tmps);
	var heure = Math.floor(tmps/3600),
		min = Math.floor((tmps%3600)/60),
		s = tmps%60,
		txt = "";
	
	if(heure<10) txt+= "0";
	txt+= heure + ":";
	
	if(min<10) txt+= "0";
	txt+= min + ":";
	
	if(s<10) txt+= "0";
	txt+= s;
	
	return txt;
}