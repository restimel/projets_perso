

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
	var category = localStorage.category || "menu", //Type de menu
		menu = null,
		cat;
	
	//category en fonction de l'url
	cat = location.search;
	if(cat){
		cat = cat.split(/[?&=]/);
		cat.forEach(function(v,i){
			if(v === "category"){
				category = cat[i+1];
			}
		});
	}
	
	function getMenu(){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4){
			
				if(xhr.status!==200 && xhr.status!==0){
					console.error("menu.json is not readable (code "+xhr.status+")");
					return;
				}
				
				var json = xhr.responseText; //texte
				menu = json && JSON.parse(json); //objet
				
				if(!menu){
					console.error("menu is not readable");
					return;
				}
				
				loadMenu();
			}
		};
		xhr.open("GET","menu.json",true);
		xhr.send(null);
	}
	
	//permet de remplir le menu
	function loadMenu(){
		var html = document.querySelector("nav"), //element html où le menu doit être écrit
			elem; //sert à créer les éléments HTML
	
		if(!menu){
			getMenu();
			return false;
		}
		
		//supprime le contenu précédent du menu
		if(!html){
			setTimeout(loadMenu,100);
			return false;
		}
		html.innerHTML = "<header>Table des matières</header>";
		
		//ajoute le thème
		html.appendChild(menuTheme(menu));
		
		//crée le menu en fonction de l'objet
		if(!menu[category]){
			category = "menu";
		}
		
		html.appendChild(menuJSON(menu[category].liste));
		navigation();

	}
	
	function menuTheme(menu){
		var html = document.createDocumentFragment(),
			label = document.createElement("label"),
			elemSelect = document.createElement("select"),
			elemOption, theme;
		
		elemSelect.id="navMenu";
		
		label.textContent = "Thème :";
		label.htmlFor = elemSelect.id;
		for(theme in menu){
			elemOption = document.createElement("option");
			elemOption.textContent = menu[theme].titre;
			elemOption.value = theme;
			
			if(category === theme){
				elemOption.selected = true;
			}
			
			elemSelect.add(elemOption);
		}
		
		elemSelect.onchange = function(){
			category = this.value;
			loadMenu();
			localStorage.category = category;
		}
		
		html.appendChild(label);
		html.appendChild(elemSelect);
		
		return html;
	}
	
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
			liens = Array.prototype.slice.call(document.querySelectorAll("nav li>a")),
			suivant = liens[liens.indexOf(lien)+1],
			precedent = liens[liens.indexOf(lien)-1],
			footer = document.querySelector("body>footer"),
			elem;
		
		//efface le footer
		footer.innerHTML=""; //à voir s'il ne faut supprimer que les liens précédent/suivant
		
		if(lien){
			lien.className="current";
		}
	
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
		
		//ajout des liens internes à la page
		addInternalLink(document.querySelectorAll("section>h3"),(lien||document.querySelector("nav>ol")).parentNode);
	}
	
	//ajoute les liens internes à la page dans le menu
	function addInternalLink(liste,elemParent){
		var i,
			li=liste.length,
			elemOL = document.createElement("ol"),
			elemLI,elemA;
		
		for(i=0; i<li; i++){
			elemLI = document.createElement("li");
			
			elemA = document.createElement("a");
			elemA.href = "#"+liste[i].parentNode.id;
			elemA.textContent = liste[i].textContent;
			
			elemLI.appendChild(elemA);
			elemOL.appendChild(elemLI);
		}
		
		elemParent.appendChild(elemOL);
	}
	
	loadMenu();
})()
