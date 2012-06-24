/**
 * API permettant de gérer les objets désignant des parcours
 */

/**
 * Constructeur
 * 	pst (number): Position de l'objet dans la liste
 * 	option (objet) : options permettant de définir le parcours
 * 		chemin ([[]]): liste des points définissant le chemin
 *		date (string): date du parcours
 *		titre (string): titre du parcours
 *		color (string): couleur du tracé
 * 		comment (string): commentaire à propos de ce parcours
 */ 
function Parcours(pst,option){
	//vérification et préparation des paramètres
	if(typeof pst !== "number"){
		pst = 0;
	}
	if(option.chemin instanceof Array){
		if(option.chemin[0] instanceof Array){
			if(option.chemin.length<2){
				//un seul point a été donné
				option.chemin[1]=option.chemin[0];
			}//sinon c'est que ça doit être correct
		}else{
			//seul un point a été donné
			option.chemin=[chemin,chemin];
		}
	}else{
		option.chemin=[defaultValue.location,defaultValue.location];
	}
	if(typeof option.date !== "string"){
		if(option.date instanceof Date){
			option.date = this.getDateFromStr(option.date.toLocaleDateString());
		}else{
			option.date = defaultValue.date;
		}
	}else{
		option.date = this.getDateFromStr(option.date) || defaultValue.date;
	}
	if(typeof option.titre !== "string" || !option.titre){
		option.titre = "Randonnée n°"+this.uid;
	}
	if(typeof option.color !== "string" || !option.color){
		option.color = "#FF0000";
	}
	if(typeof option.comment !== "string"){
		option.comment = "";
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
			enumerable : true, configurable : false
		},
		titre:{
			value : option.titre,
			writable : true, enumerable : true, configurable : false
		},
		date:{
			get: function(){
				return option.date;
			},
			set: function(dt){
				var date = this.getDateFromStr(dt);
				if(!date) return;
				defaultValue.date=option.date=date;
			},
			enumerable : true, configurable : false
		},
		chemin:{
			value : option.chemin, //TODO copie de tableau
			writable : false, enumerable : true, configurable : false
		},
		color:{
			value : option.color,
			writable : true, enumerable : true, configurable : false
		},
		comment:{
			value : option.comment,
			writable : true, enumerable : true, configurable : false
		},
		map:{
			value : null,
			writable : true, enumerable : true, configurable : false
		},
		parentElement:{
			value:null,
			writable : true, enumerable : false, configurable : false
		},
		currentMode:{
			value:"editor_view",
			writable : true, enumerable : false, configurable : false
		},
		uid:{
			value:Parcours.prototype.uid++,
			writable : false, enumerable : false, configurable : false
		}
	};
	
	Object.defineProperties(this,membres);
}

(function(){
	//héritage
	Parcours.prototype = new RandoListeItem(0);
	Parcours.prototype.constructor = Parcours;

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
			writable : false, enumerable : true, configurable : false
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
						onclick:function(){
							//gestion du mode édition du parcours
							var element=that.map.sourceElement;
							if(!element.className){
								//le parcours n'est pas en mode édition
 								console.debug("passage en mode édition"+that.uid);
								
								element.className = "carteActive";
								that.map.listPath[0].editable=true;
								that.map.refresh();
//								that.map.center=that.localisation;
								if(that.map.listPath[0].points.length>2 || that.map.listPath[0].points[0][0]!==that.map.listPath[0].points[1][0] || that.map.listPath[0].points[0][0]!==that.map.listPath[0].points[1][0]){
									that.map.fit();
								}else{
									var p1=that.map.listPath[0].points[0],
									p2=that.map.listPath[0].points[that.map.listPath[0].points.length-1];
									that.map.center=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2];
								}
								var stop=false;
								element.onmouseout=function(){
									stop=setTimeout(function(){
										if(stop){
											element.className="";
											that.map.listPath[0].editable=false;
											that.map.refresh();
											element.onmouseout=null;
											element.onmouseover=null;
//											that.map.center=that.localisation;
											if(that.map.listPath[0].points.length>2 || that.map.listPath[0].points[0][0]!==that.map.listPath[0].points[1][0] || that.map.listPath[0].points[0][0]!==that.map.listPath[0].points[1][0]){
												that.map.fit();
											}else{
												var p1=that.map.listPath[0].points[0];
												var p2=that.map.listPath[0].points[1];
												that.map.center=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2];
											}
											that.parcours=that.map.listPath[0].points;
										}
									},1500);
								};
								element.onmouseover=function(){
									clearTimeout(stop);
									stop=false;
								};
							}
						}
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
						date.onchange = function(){
							that.date=this.value;
							this.value=that.date;//pour afficher ce qui est réellement sauvegardé
						};
						section.appendChild(date);
						
						var color = document.createElement("input");
						color.type="color";
						color.value = this.color;
						color.title = "Couleur du tracé";
						color.onchange = function(){defaultValue.color=that.color=this.value;};
						section.appendChild(color);
						
						
						var commentaires = document.createElement("textarea");
						commentaires.placeholder=commentaires.title="Remarques sur ce parcours";
						commentaires.value = this.comment;
						commentaires.onchange = function(){that.comment=this.value;};
						section.appendChild(commentaires);
						
						corps.appendChild(section);
						
						//deuxième zone (carte)
						section = document.createElement("section");
						
						/*var carte = document.createElement("div");
						carte.textContent = "TODO affichage carte";
						section.appendChild(carte);*/
						section.appendChild(this.map.sourceElement);
						
						menu = document.createElement("menu");
						menu.type = "toolbar";
						
						command = document.createElement("button");
						command.textContent = "Refresh";
						command.onclick = function(){that.map.refresh();};
						menu.appendChild(command);
						
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
						corps.ondblclick=function(){that.display(parentElement,"editor_view");};
						
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
							case "color":
								color.focus();
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
						date.ondblclick=function(){that.display(parentElement,"editor","date");event.stopPropagation();};
						section.appendChild(date);
						
						var distance = document.createElement("output");
						distance.value = this.distance+" km";
						section.appendChild(distance);
						
						var commentaires = document.createElement("details");
						var debut = document.createElement("summary");
						debut.textContent = this.comment.substr(0,30); //TODO améliorer cet affichage
						commentaires.appendChild(debut);
						commentaires.appendChild(document.createTextNode(this.comment.substr(30,this.comment.length)));
						commentaires.ondblclick=function(event){that.display(parentElement,"editor","commentaire");event.stopPropagation();};
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
						command.textContent = "Refresh";
						command.onclick = function(){that.map.refresh();};
						menu.appendChild(command);
						
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
						corps.ondblclick=function(){that.display(parentElement,"editor");};
						
						//ajout au bloc parent
						parentElement.appendChild(header);
						parentElement.appendChild(corps);
				}
				setTimeout(this.map.refresh.bind(this.map),10);
			},
			writable : false, enumerable : true, configurable : false
		},
		toString:{
			value:function(){
				return this.titre;
			},
			writable : false, enumerable : false, configurable : false
		},
		uid:{
			value:1,
			writable : true, enumerable : false, configurable : false
		}
	};
	
	Object.defineProperties(Parcours.prototype,membres);
})();
