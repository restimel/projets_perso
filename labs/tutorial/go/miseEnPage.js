

//initialisation pour le fallback de navigateurs ne supportant pas les balises details/summary
window.addEventListener("load",function(){
	var liste,i,li;
	
	if(typeof document.querySelector("details").open === "undefined"){
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
	var xhr = new XMLHttprequest();
	xhr.onreadystatechange = function() {
    if (xmlhttp.readyState === 4){
        alert(xmlhttp.readyState);//TODO
    }
};
	xhr.open("GET","./menu.json",true);
	xhr.send(null);
})()

//initialisation pour identifier le tutoriel et proposer les chapitres suivant/précédent
window.addEventListener("load",function(){
	var page = window.location.pathname.replace(/^.*\/([^/?#]+\.html).*/,"$1"),
		lien = document.querySelector('a[href="./'+page+'"]'),
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

},"false");
