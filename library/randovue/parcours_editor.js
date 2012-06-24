/**
 * objet permettant de gérer les objets désignant des parcours
 */

/**
 * Constructeur
 * 	pst (number): Position de l'objet dans la liste
 * 	chemin ([[]]): liste des points définissant le chemin
 *	date (string): date du parcours
 *	titre (string): titre du parcours
 *	color (string): couleur du tracé
 */ 
function Parcours(pst,chemin,date,titre,color,comment){
	//vérification et préparation des paramètres
	if(typeof pst !== "number"){
		pst = 0;
	}
	if(chemin instanceof Array){
		if(chemin[0] instanceof Array){
			if(chemin.length<2){
				//un seul point a été donné
				chemin[1]=chemin[0];
			}//sinon c'est que ça doit être correct
		}else{
			//seul un point a été donné
			chemin=[chemin,chemin];
		}
	}else{
		chemin=[defaultValue.location,defaultValue.location];
	}
	if(typeof date !== "string"){
		if(date instanceof Date){
			date = date.toLocaleDateString();
		}else{
			date = defaultValue.date;
		}
	}
	if(typeof titre !== "string" || !titre){
		titre = "Randonnée n°"+this.uid;
	}
	if(typeof color !== "string" || !color){
		color = "#FF0000";
	}
	if(typeof comment !== "string"){
		comment = "";
	}
	
	//création des membres
	var membres = {
		position:{
			get: function(){
				return pst;
			},
			set: function(position){
				pst=position;
				this.display();
			},
			enumerable : true,
			configurable : false
		},
		titre:{
			value : titre,
			writable : true,
			enumerable : true,
			configurable : false
		},
		date:{
			get: function(){
				return date;
			},
			set: function(dt){
				console.debug("Date:"+dt);//TODO analyser le format
				date=dt;
			},
			enumerable : true,
			configurable : false
		},
		chemin:{
			value : chemin, //TODO copie de tableau
			writable : false,
			enumerable : true,
			configurable : false
		},
		color:{
			value : color,
			writable : true,
			enumerable : true,
			configurable : false
		},
		comment:{
			value : comment,
			writable : true,
			enumerable : true,
			configurable : false
		},
		map:{
			value : null,
			writable : true,
			enumerable : true,
			configurable : false
		},
		parentElement:{
			value:null,
			writable : true,
			enumerable : false,
			configurable : false
		},
		currentMode:{
			value:"editor_view",
			writable : true,
			enumerable : false,
			configurable : false
		},
		uid:{
			value:this.uid++,
			writable : false,
			enumerable : false,
			configurable : false
		}
	};
	
	Object.defineProperties(this,membres);
}

(function(){
	if(typeof defaultValue !== "object"){
		defaultValue = {};
		Object.defineProperties(defaultValue,{
			location:{
				value : [45.0456,3.8849,null],
				writable : true, enumerable : true, configurable : false
			},
			zoom:{
				value : 10,
				writable : true, enumerable : true, configurable : false
			},
			date:{
				value : (new Date()).toLocaleDateString(),
				writable : true, enumerable : true, configurable : false
			},
			color:{
				get: function(){
					//TODO
					console.warn("get color: à écrire. Il devra récupérer la couleur HSL par défaut, la convertir en RGB (celle qui sera retournée) et modifier la couleur HSL par défaut");
					return this.colorH;
				},
				set: function(color){
					//TODO
					console.warn("set color: à écrire. Il devra changer la couleur par défaut");
					this.colorH=color;
				},
				enumerable : true, configurable : false
			},
			colorH:{
				value:250,
				writable : true, enumerable : false, configurable : false
			},
			colorS:{
				value:250,
				writable : true, enumerable : false, configurable : false
			},
			colorL:{
				value:250,
				writable : true, enumerable : false, configurable : false
			}
		});
	}

	var membres = {
		/**
		 * méthode permettant de récupérer les informations de cet élément
		 */
		getInfo:{
			value:function(parentElement,mode){
				var obj={
					type:"parcours",
					titre:this.titre,
					date: this.date,
					px:this.chemin[0][0],
					py:this.chemin[0][1],
					pa:this.chemin[0][2],
					parcours:this.parcours,
					distance:this.map.listPath[0].distance(),
					comment:this.comment,
					color:this.color
				};
				return obj;
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		/**
		 * méthode permettant d'afficher le contenu de cet élément
		 * 	parentElement (DOMelement): conteneur parentElement
		 *	mode (string): type d'affichage
		 * 			"editor":		édition des données
		 * 			"editor_view":	affichage en mode édition
		 * 			"hide" : n'affiche rien
		 * 	focus (string) : définission d'un élément où le focus doit se faire (optionnel et dépend du mode)
		 */
		display:{
			value:function(parentElement,mode,focus){
				this.parentElement = parentElement = parentElement || this.parentElement;
				this.currentMode = mode = mode || this.currentMode;
				
				if(parentElement === null){
					return;
				}
				
				var that=this;
				
				parentElement.innerHTML=""; //on efface le contenu existant
				
				//gestion de la carte
				if(!this.map && mode!=="hide"){
					this.map = new Map(document.createElement("div"),{
						center:this.chemin[0],
						zoom:defaultValue.zoom,
						onclick:function(){alert('todo');}
					});
				}
				
				switch(mode){
					case "hide":
						break;
					case "editor":
						parentElement.className = "parcours_editor";
						
						//entete
						var header = document.createElement("header");
						
						var position = document.createElement("input");
						position.type="number";
						position.min=0;
						position.max=randoListe.liste.length;
						position.value = this.position;
						position.className = "position";
						position.title="Ordre de positionnement";
						position.onchange = function(){
							if(that.position!=this.value){
								randoListe.changePosition(that.position,this.value);
							}
						};
						header.appendChild(position);
						
						var titre = document.createElement("input");
						titre.type="text";
						titre.value = this.titre;
						titre.placeholder=titre.title="intitulé du parcours";
						titre.className = "titre";
						titre.onchange = function(){that.titre=this.value;};
						header.appendChild(titre);
						
						var menu = document.createElement("menu");
						menu.type="list";
						
						var command = document.createElement("button");
						command.textContent="⤴";
						command.title="Passage en mode vue";
						command.onclick=function(){that.display(parentElement,"editor_view");};
						menu.appendChild(command);
						
						header.appendChild(menu);
						
						//contenu
						var corps = document.createElement("article");
						
						//première zone (détails)
						var section = document.createElement("aside");
						
						var date = document.createElement("input");
						date.type="date";
						date.value = this.date;
						date.title = "Date de l'événement";
						date.onchange = function(){that.date=this.value;};
						date.className = "date";
						section.appendChild(date);
						
						
						var commentaires = document.createElement("textarea");
						commentaires.placeholder=commentaires.title="Remarques sur ce parcours";
						commentaires.value = this.comment;
						commentaires.onchange = function(){that.comment=this.value;};
						section.appendChild(commentaires);
						
						corps.appendChild(section);
						
						//deuxième zone (carte)
						section = document.createElement("section");
						
						var carte = document.createElement("div");
						carte.textContent = "TODO affichage carte";
						section.appendChild(carte);
						
						menu = document.createElement("menu");
						menu.type = "toolbar";
						
						command = document.createElement("button");
						command.textContent = "Carte";
						command.onclick = function(){alert("todo")};
						menu.appendChild(command);
						
						command = document.createElement("button");
						command.textContent = "Dénivelé";
						command.onclick = function(){alert("todo")};
						menu.appendChild(command);
						
						section.appendChild(menu);
						
						corps.appendChild(section);
						
						//ajout au bloc parent
						parentElement.appendChild(header);
						parentElement.appendChild(corps);
						
						//gestion du focus
						switch(focus){
							case "position":
								position.focus();
								break;
							case "titre":
								titre.focus();
								break;
							case "date":
								date.focus();
								break;
							case "commentaire":
								commentaires.focus();
								break;
						}
						break;
					case "editor_view":
					default:
						parentElement.className = "parcours_editor_view";
						
						//entete
						var header = document.createElement("header");
						
						var position = document.createElement("output");
						position.value = this.position;
						position.onclick=function(){that.display(parentElement,"editor","position");};
						header.appendChild(position);
						
						var titre = document.createElement("h1");
						titre.textContent = this.titre;
						titre.ondblclick=function(){that.display(parentElement,"editor","titre");};
						header.appendChild(titre);
						
						var menu = document.createElement("menu");
						menu.type="list";
						
						var command = document.createElement("button");
						command.textContent="⚙";
						command.title="Édition";
						command.onclick=function(){that.display(parentElement,"editor");};
						menu.appendChild(command);
						
						header.appendChild(menu);
						
						//contenu
						var corps = document.createElement("article");
						
						//première zone (détails)
						var section = document.createElement("aside");
						
						var date = document.createElement("time");
						date.datetime = this.date;
						date.textContent = this.date;
						section.appendChild(date);
						
						var distance = document.createElement("output");
						distance.value = this.distance+" km";
						section.appendChild(distance);
						
//						this.comment = "Texte à changer qui ne sert pour l'instant qu'à tester les commentaires... à voir donc!";
						var commentaires = document.createElement("details");
						var debut = document.createElement("summary");
						debut.textContent = this.comment.substr(0,30); //TODO améliorer cet affichage
						commentaires.appendChild(debut);
						commentaires.appendChild(document.createTextNode(this.comment.substr(30,this.comment.length)));
						section.appendChild(commentaires);
						
						corps.appendChild(section);
						
						//deuxième zone (carte)
						section = document.createElement("section");
						
						//var carte = document.createElement("div");
						//carte.textContent = "TODO affichage carte";
						section.appendChild(this.map.sourceElement);
						
						menu = document.createElement("menu");
						menu.type = "toolbar";
						
						command = document.createElement("button");
						command.textContent = "Carte";
						command.onclick = function(){alert("todo")};
						menu.appendChild(command);
						
						command = document.createElement("button");
						command.textContent = "Dénivelé";
						command.onclick = function(){alert("todo")};
						menu.appendChild(command);
						
						section.appendChild(menu);
						
						corps.appendChild(section);
						
						//ajout au bloc parent
						parentElement.appendChild(header);
						parentElement.appendChild(corps);
				}
				this.map.refresh();
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		toString:{
			value:function(){
				return this.titre;
			},
			writable : false,
			enumerable : false,
			configurable : false
		},
		uid:{
			value:1,
			writable : true,
			enumerable : false,
			configurable : false
		}
	};
	
	Object.defineProperties(Parcours.prototype,membres);
})();
