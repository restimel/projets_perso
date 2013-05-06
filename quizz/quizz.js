/**
	Global variable
**/

var currentTest = null; // test en cours

/**
	Navigation
	
**/
var changeSession = function(){
	var activeSection = document.querySelector(".sectionActive");
	
	var listeButton = document.querySelectorAll("nav button"),i,li=listeButton.length;
	for(i=0;i<li;i++){
		listeButton[i].onclick=changeSession;
	}
	
	return changeSession;
	
	function changeSession(id){
		if(typeof id !== "string" && typeof this.id === "string") id = this.id.substr(4);
		var section = document.getElementById(id);
		activeSection.className="";
		section.className = "sectionActive";
		activeSection = section;
	}
}();

/**
	chargement des données
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
	Lancer le quizz
**/
function runQuizz(){
	currentTest = new quizzTest();
	
}

/**
	verification de la réponse envoyé
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
	alert(this.value); //TODO
}

/**
	Initialisation des événements sur éléments
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
	
},false);


