

//initialisation pour le fallback de navigateurs ne supportant pas les balises details/summary
window.addEventListener("load",function(){
	var liste,i,li;
	
	var detail = document.querySelector("details");
	if(detail === null) return;
	
	if(typeof detail.open === "undefined"){
		//la balise HTML5 details n'est pas connue
		liste = document.querySelectorAll("summary");
		i=0;
		li=liste.length;
		while(i<li){
			liste[i].onclick=openSwitch;
			liste[i++].className="detailsClosed";
		}
	}
	
	//fonction permettant d'afficher ou de cacher le details
	function openSwitch(){
		if(this.className==="detailsClosed"){
			this.className="detailsOpen";
		}else{
			this.className="detailsClosed";
		}
	}
},false);


//récupération de la liste des pages
(function(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4){
		
			if(xhr.status!==200 && xhr.status!==0){
				console.error("menu.json is not readable (code "+xhr.status+")");
				return;
			}
			
			var json = xhr.responseText, //texte
				menu = json && JSON.parse(json), //objet
				html = document.querySelector("nav"), //element html où le menu doit être écrit
				elem, //sert à créer les éléments HTML
				category = "menu"; //Type de menu //TODO en fonction de l'url
		
			if(!menu){
				console.error("menu is not readable");
				return;
			}
			
			//supprime le contenu précédent du menu
			html.innerHTML = "<header>Table des matières</header>";
			
			//crée le menu en fonction de l'objet
			if(!menu[category]){
				category = "menu";
			}
			
			html.appendChild(menuJSON(menu[category]));
			navigation();
		
    	}
	};
	xhr.open("GET","menu.json",true);
	xhr.send(null);
	
	//créer la structure HTML à partir d'un objet
	function menuJSON(liste){
		var li = liste.length,
			elemOl = document.createElement("ol"),
			i,obj,elemLi,elemtmp;
		
		for(i=0; i<li; i++){
			obj = liste[i];
			
			elemLi = document.createElement("li");
			
			//ajout du titre
			if(obj.lien){
				//élément cliquable
				elemTmp = document.createElement("a");
				elemTmp.href = obj.lien;
			}else{
				//élement non cliquable
				elemTmp = document.createElement("span");
			}
			elemTmp.textContent = obj.titre;
				
			elemLi.appendChild(elemTmp);
			
			
			//ajout du sous menu éventuel
			if(obj.sousMenu){
				elemLi.appendChild(menuJSON(obj.sousMenu));
			}
			
			elemOl.appendChild(elemLi);
		}
		
		return elemOl;
	}
	
	//initialisation pour identifier le tutoriel et proposer les chapitres suivant/précédent
	function navigation(){
		var page = window.location.pathname.replace(/^.*\/([^/?#]+\.html).*/,"$1"),
			lien = document.querySelector('a[href="'+page+'"]'),
			liens = Array.prototype.slice.call(document.querySelectorAll("nav>ol>li>a,nav>ol>li>ol>li>a")),
			suivant = liens[liens.indexOf(lien)+1],
			precedent = liens[liens.indexOf(lien)-1],
			footer = document.querySelector("body>footer"),
			elem;
		lien.className="current";
	
		//précédent
		elem = document.createElement("a");
		if(precedent){
			elem.textContent = "Chapitre précédent : "+precedent.textContent;
			elem.href = precedent.href;
		}else{
			elem.textContent = "Chapitre précédent : aucun";
			elem.disabled = true;
		}
		elem.className = "lienPrecedent";
		footer.appendChild(elem);
	
		//suivant
		elem = document.createElement("a");
		if(suivant){
			elem.textContent = "Chapitre suivant : "+suivant.textContent;
			elem.href = suivant.href;
		}else{
			elem.textContent = "Chapitre suivant : aucun";
			elem.disabled = true;
		}
		elem.className = "lienSuivant";
		footer.appendChild(elem);

	}
})()

