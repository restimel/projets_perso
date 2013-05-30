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
	
	if(typeof option.chemin === "undefined" && option.parcours){
		option.chemin = option.parcours;
	}
	
	if(option.chemin instanceof Array){
		if(option.chemin[0] instanceof Array){
			if(option.chemin.length<2){
				//un seul point a été donné
				option.chemin[1]=option.chemin[0];
			}//sinon c'est que ça doit être correct
		}else{
			//seul un point a été donné
			option.chemin=[option.chemin,option.chemin];
		}

		option.chemin = copyArray(option.chemin);
	}else{
		if(typeof option.chemin !== "string"){
			option.chemin=[defaultValue.location,defaultValue.location]; //valeur par défaut
		}
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
			get: function(){
				return option.chemin;
			},
			set: function(path){
				if(typeof path === "string"){
					//identifier le type de texte (KML, sony, Array)
					//TODO KML
					if(/^[\s\r\n[]+(?:[-0-9.]+[,:/\s][-0-9.]+(?:[,:/\s][-0-9.]*)?(?:[\r\n\s;|[\]]+(?:,[\r\n\s[]+)?|$))+$/.exec(path)){
						//Array
						path = path.split(/\s*[\r\n;|[\]]+(?:\s*,[\r\n\s[]+)?\s*/);
						var i=0,li=path.length;
						while(i<li){
							if(path[i] === ""){
								path.splice(i,1);
								li--;
								continue;
							}	
							path[i]=path[i].split(/[,:/\s]+/);
							path[i].forEach(function(vl,ind,tab){tab[ind]=vl===""?null:parseFloat(vl,10);});
							i++;
						}
						option.chemin = path; //sauvegarde des données
					}else if(/^@Sonygps\/ver3.0\/wgs-84\//.exec(path)){
						//format NMEA
						//TODO http://www.gpsinformation.org/dale/nmea.htm (gérer d'autres format)
						path = path.split(/\s*[\r\n]+\s*/);
						var i=0,li=path.length,ligne,j=0,points=[];
						//traitement pour chaque ligne
						while(i<li){
							ligne = path[i].split(",");
							//TODO identifier des lignes déjà traitées
							switch(ligne[0]){
								case "$GPGGA":
									points[j++]=[
										mapTools.convertCoordinate(ligne[2]+","+ligne[3],"décimal"),
										mapTools.convertCoordinate(ligne[4]+","+ligne[5],"décimal"),
										parseFloat(ligne[9])
									];
									break;
								default :
									console.warn("ligne au format "+ligne[0]+" non connu");
							}
							i++;
						}
						points = pathSmoothing(points,0.025); //lissage des points
						option.chemin = points; //sauvegarde des données
					}else{
						console.warn("format non reconnu !");//TODO en faire un vrai message
					}
				}else if(path instanceof Array){ //le format est déjà une liste de points (Array)
					if(path[0] instanceof Array){
						if(path.length<2){
							//un seul point a été donné
							option.chemin = copyArray(path);
							option.chemin[1] = option.chemin[0];
						}else{
							//sinon c'est que ça doit être correct
							option.chemin = copyArray(path);
						}
					}else{
						//seul un point a été donné
						if(typeof path[0] === "number"){
							option.chemin=[copyArray(path),copyArray(path)];
						}//sinon on ne fait rien car on ne sait pas gérer (générer une erreur?)
					}
				}
				
				//on effectue les changements sur la carte
				if(this.map){
					this.map.listPath[0].changePath(option.chemin);
					this.map.fit();
				}
			},
			enumerable : true, configurable : false
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
	
	this.chemin = option.chemin;
	
	/*
		permet de lisser un chemin en enlevant les points trop près
	*/
	function pathSmoothing(points,range){
		range = range || 0.015;
		console.warn("debug: original = "+points.length);
		var i = points.length,
			p1 = points[--i],
			p2,
			lst = [p1];
			
			while(i--){
				p2 = points[i];
				if(mapTools.distance(p1,p2) > range){
					if(lst.length>1) points.splice(i+1,lst.length,meanPoints(lst)); //remplacement des points par leur barycentre
					p1 = p2; //changement de référence
					lst = [p1];
				}else{
					lst.push(p2); //ajout du point à la liste de points proches
				}
			}
			if(lst.length>1) points.splice(0,lst.length,meanPoints(lst));
			
			console.debug("debug: final = "+points.length);
			
			return points;
	}
	
	//calcule le barycentre des points
	function meanPoints(points){
		var i,
			li = points.length,
			x = 0,
			y = 0,
			z = 0;
		for(i=0;i<li;i++){
			x += points[i][0];
			y += points[i][1];
			z += points[i][2]||0;
		}
		return [x/li,y/li,z/li]
	}
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
			value:function(){
				var obj={
					type:"parcours",
					titre:this.titre,
					date: this.date,
					px:this.chemin[0][0],
					py:this.chemin[0][1],
					pa:this.chemin[0][2],
					parcours:this.chemin,
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
				
				
				switch(mode){
/*  "hide"  *******************************************************/
					case "hide":
						parentElement = null;
						break;
/*  "editor"  *****************************************************/
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
						
						var chemin = document.createElement("textarea");
						chemin.value = this.chemin.join("\n");
						chemin.placeholder = chemin.title = "Liste des coordonées du parcours";
						chemin.onchange = function(){
							that.chemin = this.value;
						};
						section.appendChild(chemin);
						
						var cheminFile = document.createElement("input");
						cheminFile.type = "file";
						cheminFile.title = "fichier contenant une description des coordonées du parcours";
						cheminFile.onchange = function(event){
							console.log("debug read File");
							console.debug(this.files[0]);
							for(var x in this.files[0]){
								console.log(x);
							}
							console.log("moz:"+this.files[0].mozFullPath+"\nwebkit:"+this.files[0].webkitFullPath+"\nopera:"+this.files[0].oFullPath+"\nall:"+this.files[0].fullPath);
							
							if(this.files[0]){
								var reader = new FileReader();
								console.log(reader);
								reader.onload=function(fl){
									console.log("ok");
									that.chemin = fl.target.result;
								};
								console.log(reader.readAsText);
								console.log(reader.readAsText(this.files[0]));
							}
						};
						section.appendChild(cheminFile);
						
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
/*  "editor_view"  *****************************************************/
					case "editor_view":
					default:
						parentElement.className = "parcours_editor_view";
						
						//gestion de la carte
						if(!this.map){
							//la carte n'est pas encore chargée
							this.map = new Map(document.createElement("div"),{
								center:this.chemin[0],
								zoom:defaultValue.zoom,
								onclick:function(){
									//gestion du mode édition du parcours
									var element=that.map.sourceElement.parentNode;
									if(!element.className){
										//le parcours n'est pas en mode édition
										console.debug("passage en mode édition"+that.uid);
										
										element.className = "carteActive";
										that.map.listPath[0].editable=true;
										//that.map.refresh();
										//setTimeout(that.map.refresh.bind(that.map),600); //pour rafraichir après l'animation
										//that.map.center=that.localisation;
										if(that.map.listPath[0].points.length>2 || that.map.listPath[0].points[0][0]!==that.map.listPath[0].points[1][0] || that.map.listPath[0].points[0][0]!==that.map.listPath[0].points[1][0]){
											that.map.fit(); //TODO voir avec le else si c'est bien comme ca .... car il faut aussi faire un centrage ici
											setTimeout(that.map.refresh.bind(that.map),600); //pour rafraichir après l'animation
										}else{
											var p1=that.map.listPath[0].points[0],
												p2=that.map.listPath[0].points[that.map.listPath[0].points.length-1];
											//that.map.center=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2];
											setTimeout(function(){
												that.map.refresh();
												that.map.center=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2];
											},600); //pour rafraichir après l'animation
										}
										//that.map.listPath[0].draw();
										
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
							this.map.sourceElement.className = "map";
							//ajout du parcours
							this.map.addPath({
								chemin:this.chemin,
								color:this.color
							});
						}
						
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
						distance.value = Math.round(this.getInfo().distance*10)/10+" km";
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
						
						var carte = document.createElement("div");
						carte.appendChild(this.map.sourceElement);
						section.appendChild(carte);
						
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
