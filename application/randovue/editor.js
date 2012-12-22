/**
 * affiche le bloc permettant d'ajouter de nouvelles actions
 */
function displayFooter(elem){
	if(typeof elem === "string"){
		elem=document.getElementById(elem);
	}
	if(typeof elem === "undefined" || elem === null){
		elem = document.createElement("footer");
		document.body.appendChild(elem);
	}
	elem.innerHTML="";
	
	var label = document.createElement("label");
	label.textContent = "À partir de la position :";
	
	var position = document.createElement("input");
	position.type="number";
	position.title="Position de l'étape";
	position.min = 0;
	poistion.value = 0;
	label.appendChild(position);
	
	elem.appendChild(label);
	
	var zone = document.createElement("fieldset");
	label = document.createElement("legend");
	label.textContent = "Ajouter une image";
	zone.appendChild(label);
	
	var inputImg = document.createElement("input");
	inputImg.type = "url";
	inputImg.title=inputImg.placeholder = "url d'une image";
	zone.appendChild(inputImg);
	
	elem.appendChild(zone);
	
	label = document.createTextNode("ou");
	elem.appendChild(label);
	
	zone = document.createElement("fieldset");
	label = document.createElement("legend");
	label.textContent = "Chargement de données";
	zone.appendChild(label);
	
	var heavyLoad = document.createElement("textarea");
	heavyLoad.title=heavyLoad.placeholder = "Type de données chargeable dans cette zone:\n\t→ JSON provenant d'une sauvegarde randovue\n\t→ données KML permettant de décrire un parcours\n\t→ données NMEA (informations GPS) permettant de décrire un parcours\n\t→ liste d'url d'images (séparées par des sauts de lignes)";
	zone.appendChild(heavyLoad);
	elem.appendChild(zone);
	
	var addAction = document.createElement("button");
	addAction.textContent = "Ajouter";
	addAction.onclick =function(){
		if(heavyLoad.value){
			//détection du tye de données
			var result = "unknown";
			//JSON
			if(/^\s*[[{]/.exec(path)){
				if(randoListe.fromJSON(path)===true){
					result = "JSON";
				}
			}
			//KML
			
			if(/^@[a-zA-Z]+\/ver\d+\.\d+\/wgs-84\//.exec(path)){ //@Sonygps/ver3.0/wgs-84/
				//NMEA
				//TODO ajouter vérification
				randoListe.add(new Parcours(0,{chemin:path}));
				result = "NMEA";
			}
			//liste images
			
			
			console.log("chargement data : "+result);
		}
		if(inputImg.value){
			console.warn("TODO créer un nouveau lieu");
		}
		if(!heavyLoad.value && !inputImg.value){
			console.warn("TODO demander quelle type d'action ajouter");
		}
	};
	elem.appendChild(addAction);
}

function editorInit(){
	var liste = document.createElement("div");
	liste.style.height = "400px";
	liste.style.overflow = "auto";
	liste.style.backgroundColor = "#CCCCFF";
	
	document.body.appendChild(liste);
	randoListe.defineZone(liste);
	
	displayFooter();
}

/**
 * Tests
 */
function test(){
	
	randoListe.add(new Lieu(0,{date:"2012-06-21",titre:"essais image",image:"./_DSC0037.JPG"}));
	randoListe.add(new Lieu(0,{date:"2011-08-21",titre:"maison",image:"./DSC00141.JPG"}));
	randoListe.add(new Lieu(0,{date:"2011-08-21",titre:"maison",image:"./DSC00076.JPG"}));
	randoListe.add(new Lieu(0,{date:"2011-08-21",titre:"chat renversant",image:"./_DSC0045.JPG"}));
	randoListe.add(new Parcours(0,{titre:"le titre",color:"#00FF00",comment:"un commentaire pour voir qui ne sert pour l'instant qu'à tester les commentaires... à voir donc!"}));
	randoListe.add(new Parcours(1,{titre:"un deuxième titre",color:"#00FFFF"}));
	randoListe.add(new Parcours(2,{titre:"un troisième titre",color:"#FFFF00"}));
	randoListe.add(new Parcours(1,{date:"25/02/1981",titre:"un intrus",color:"#FF0000"}),2);
	randoListe.add(new Parcours(0,{date:"toto est en vacances",titre:"Hé ho ! Hé ho !, On rentre du boulot",color:"#FFF"}));
	randoListe.add(new Parcours(0,{date:"3012-06-21",titre:"La fête de la musique dans l'avenir",color:"#0C0"}));
	randoListe.add(new Parcours(0,{date:"3012-06-21",color:"#0CF"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	
	var test=new Parcours(0,{});
	randoListe.add(test);
	randoListe.view(0);
	

}

window.addEventListener("load",editorInit,false);
//window.addEventListener("load",test,false)
