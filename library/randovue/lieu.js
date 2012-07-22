/**
 * API permettant de gérer les objets désignant des Lieux
 */

/**
 * Constructeur permettant de gérer les lieux
 * 	pst (number): Position de l'objet dans la liste
 * 	option (objet) : options permettant de définir le parcours
 * 		image (string): url de l'image
 * 		src (string): url de l'image (idem que précédemment)
 *		date (string): date de l'arrêt
 *		titre (string): titre de l'arrêt
 *		localisation ([number,number,number?]): position géographique de l'image [latitude,longitude,altitude]
 * 		direction (string/number): direction selon les points cardinaux de la prise de l'image
 * 		comment (string): commentaire à propos de cette image
 * 		metaType (number): type d'arrêt
 * 		orientation (string/number): orientation de l'image
 * 		zoom (number): zoom de l'affichage de la carte
 * 		dontReadEXIF (boolean): lit ou non les données EXIF de l'image pour écraser les informations
 * 		chemin ([[localisation]]): tracé du chemin sur lequel se trouve cet arrêt
 */ 
function Lieu(pst,option){
	var that = this;
	
	//vérification et préparation des paramètres
	if(typeof pst !== "number"){
		pst = 0;
	}
	
	option.image = option.image || option.src || "";
	if(typeof option.image !== "string"){
		option.image = "";
	}
	
	if(typeof option.date !== "string"){
		if(option.date instanceof Date){
			option.date = this.getDateFromStr(option.date.toLocaleDateString(),true);
		}else{
			option.date = defaultValue.date;
		}
	}else{
		option.date = this.getDateFromStr(option.date,true) || defaultValue.date;
	}
	
	if(typeof option.titre !== "string" || !option.titre){
		option.titre = "Arrêt n°"+this.uid;
	}
	
	if(option.localisation instanceof Array){
		//ok
	}else{
		option.localisation=copyArray(defaultValue.location);
	}
	
	if(typeof option.comment !== "string"){
		option.comment = "";
	}
	
	if(typeof option.metaType !== "number"){
		option.metaType = 0;
	}
	
	if(typeof option.zoom !== "number"){
		option.zoom = defaultValue.zoom;
	}else{
		defaultValue.zoom = option.zoom;
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
	}else{
		option.chemin=[option.localisation,option.localisation];
	}
	
	if(typeof option.color !== "string" || !option.color){
		option.color = "#FF0000";
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
				var date = this.getDateFromStr(dt,true);
				if(!date) return;
				defaultValue.date=option.date=date;
			},
			enumerable : true, configurable : false
		},
		chemin:{
			get: function(){
				return option.chemin;
			},
			set: function(chemin){
				option.chemin=copyArray(chemin);
			},
			enumerable : true, configurable : false
		},
		localisation:{
			get: function(){
				return option.localisation;
			},
			set: function(position){
				option.localisation=copyArray(position);
				defaultValue.location=copyArray(position);
				if(this.map){
					this.map.moveMarker(0,option.localisation,true);
				}
			},
			enumerable : true, configurable : false
		},
		longitude:{
			get: function(){
				return option.localisation[1];
			},
			set: function(position){
				option.localisation[1]=position;
				if(this.map){
					this.map.moveMarker(0,option.localisation,true);
				}
			},
			enumerable : true, configurable : false
		},
		latitude:{
			get: function(){
				return option.localisation[0];
			},
			set: function(position){
				option.localisation[0]=position;
				if(this.map){
					this.map.moveMarker(0,option.localisation,true);
				}
			},
			enumerable : true, configurable : false
		},
		altitude:{
			get: function(){
				return option.localisation[3];
			},
			set: function(position){
				option.localisation[3]=position;
			},
			enumerable : true, configurable : false
		},
		orientation:{//orientation de l'image
			get: function(){
				return option.orientation;
			},
			set: function(orientation){
				if(typeof orientation !== "number"){
					orientation = parseInt(orientation,10) || 1;
				}
				if(orientation<1 || orientation>8){
					orientation = 1;
				}
				option.orientation = orientation;
			},
			enumerable : true, configurable : false
		},
		direction:{
			get: function(){
				return option.direction;
			},
			set: function(direction){
				option.direction = direction; //TODO analyser l'entrée (string/number)
			},
			enumerable : true, configurable : false
		},
		metaType:{
			get: function(){
				return option.metaType;
			},
			set: function(metaType){
				option.metaType = metaType = parseInt(metaType,10);
				if(this.parentElement){
					this.map.changeMarkerType(0,metaType);
				}
			},
			enumerable : true, configurable : false
		},
		comment:{
			value : option.comment,
			writable : true, enumerable : true, configurable : false
		},
		map:{
			value : null,
			writable : true, enumerable : true, configurable : false
		},
		zoom:{
			get: function(){
				return option.zoom;
			},
			set: function(zoom){
				defaultValue.zoom=option.zoom=zoom;
				if(this.map){
					this.map.zoom=zoom;
				}
			},
			enumerable : true, configurable : false
		},
		exifData:{
			get: function(){
				return option.exifData;
			},
			set: function(exifData){
				if(typeof exifData === "function"){
					if(option.exifData){
						exifData(option.exifData);
					}else{
						option.exifDataCallBack = exifData;
					}
					return;
				}
				option.exifData=exifData;
				if(exifData === null){
					option.exifDataCallBack=null;
				}else if(typeof option.exifDataCallBack === "function"){
					option.exifDataCallBack.bind(this)(option.exifData);
					option.exifDataCallBack=null;
				}
			},
			enumerable : true, configurable : false
		},
		image:{
			get: function(){
				return option.image;
			},
			set: function(src){
				option.image=src;//TODO lire les données EXIF?
			},
			enumerable : true, configurable : false
		},
		parentElement:{
			value:null,
			writable : true, enumerable : false, configurable : false
		},
		currentMode:{
			value: "editor_view",
			writable : true, enumerable : false, configurable : false
		},
		uid:{
			value: Lieu.prototype.uid++,
			writable : false, enumerable : false, configurable : false
		}
	};
	
	Object.defineProperties(this,membres);
	
	
	//vérification/initialisation des paramètres sauvegardés
	if(typeof option.orientation !== "number"){
		this.orientation = option.orientation;
	}
	
	if(typeof option.direction !== "number"){
		this.direction = option.direction;
	}
	
	if(option.image){
		if(!option.dontReadEXIF){
			this.readExif(option.image,function(exifData){
				var localisation = that.localisation,
					chgtLieu = false,
					tmp;
				
				//donnée GPS
				if(exifData.GPSLatitude){
					tmp=exifData.GPSLatitude[0]+(exifData.GPSLatitude[1] + exifData.GPSLatitude[2]/60)/60;
					if(exifData.GPSLatitudeRef==="S"){
						tmp=-tmp;
					}
					localisation[0]=tmp;
					localisation[2]=null;
					chgtLieu = true;
				}
				if(exifData.GPSLongitude){
					tmp=exifData.GPSLongitude[0]+(exifData.GPSLongitude[1] + exifData.GPSLongitude[2]/60)/60;
					if(exifData.GPSLongitudeRef==="W"){
						tmp=-tmp;
					}
					localisation[1]=tmp;
					localisation[2]=null;
					chgtLieu = true;
				}
				if(exifData.GPSAltitude){
					tmp=exifData.GPSAltitude;
					if(exifData.GPSAltitudeRef==1){
						tmp=-tmp;
					}
					localisation[2]=tmp;
				}
				that.localisation = localisation;
				
				if(chgtLieu){
					Map.getPlaceName(localisation[0],localisation[1],function(nom){
						that.titre=nom;
						if(that.parentElement){
							that.display();//TODO metre a jour uniquement le titre
						}
					});
				}
				
				if(exifData.GPSImgDirection){
					tmp=exifData.GPSImgDirection;
					if(exifData.GPSImgDirectionRef==="M"){ //orientation pôle magnétique
						tmp=tmp; //TODO ajouter la déviation pole magnétique/géographique
					}
					that.orientation=tmp;
				}
				
				//donnée Image
				if(exifData.Orientation){
					that.orientation = exifData.Orientation;
				}
				
				if(exifData.DateTime || exifData.DateTimeOrginal || exifData.DateTimeDigitized){
					that.date = exifData.DateTime || exifData.DateTimeOrginal || exifData.DateTimeDigitized;
				}
				
				if(exifData.ImageDescription){
					that.comment = exifData.ImageDescription;
				}
				
				
				that.exifData = exifData;
				
				if(that.parentElement){
					that.display(); //TODO mettre ajour uniquement les parties désirées
				}
			});
		}else{
			this.readExif(option.image,function(exifData){
				that.exifData = exifData;
				if(that.parentElement){
					that.display();//TODO metre a jour uniquement le bouton EXIF
				}
			});
		}
	}
}

(function(){
	//héritage
	Lieu.prototype = new RandoListeItem(0);
	Lieu.prototype.constructor = Lieu;
	
	var membres = {
		/**
		 * méthode permettant de récupérer les informations de cet élément
		 */
		getInfo:{
			value:function(){
				var obj={
					type:"lieu",
					titre:this.titre,
					date: this.date,
					photo: this.image,
					metaType:this.metaType,
					orientation:this.orientation,
					direction:this.direction,
					px:this.localisation[0],
					py:this.localisation[1],
					pa:this.localisation[2],
					distance:this.map.listPath[0].distance(),
					comment:this.comment,
					zoom:this.zoom
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
					parentElement.className = "lieu_editor";
					 
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
					 
					//première zon (image)
					var section = document.createElement("section");
					 
					var labelEXIF = document.createElement("label");
					labelEXIF.textContent = "appliquer les données EXIF de l'image ";
					var readExif = document.createElement("input");
					readExif.type = "checkbox";
					readExif.checked = this.dontReadEXIF;
					readExif.onchange = function(){
						that.dontReadEXIF = this.value;
					};
					labelEXIF.appendChild(readExif);
					section.appendChild(labelEXIF);
					 
					var imageSRC = document.createElement("input");
					imageSRC.type = "url";
					imageSRC.value = this.image;
					imageSRC.placeholder = "url de l'image";
					imageSRC.title = "Image décrivant ce lieu";
					imageSRC.onchange = function(){
						that.image = this.value; //TODO verifier que les données EXIF seront lues
					};
					section.appendChild(imageSRC);
					 
					var imageFile = document.createElement("input");
					imageFile.type = "file";
					imageFile.placeholder = "image décivant ce lieu";
					imageFile.title = "Image décrivant ce lieu";
					imageFile.onchange = function(){
						//TODO utiliser le readFile
						console.warn("TODO: charger le fichier (récupérer l'url si possible)");
					};
					section.appendChild(imageFile);
					 
					corps.appendChild(section);
					 
					//première zone (détails)
					section = document.createElement("section");
					 
					var date = document.createElement("input");
					date.type="date";
					date.value = this.date;
					date.title = "Date de l'événement";
					date.onchange = function(){
						that.date=this.value;
						this.value=that.date;//pour afficher ce qui est réellement sauvegardé
					};
					section.appendChild(date);
					 
					/*var color = document.createElement("input");
					color.type="color";
					color.value = this.color;
					color.title = "Couleur du tracé";
					color.onchange = function(){defaultValue.color=that.color=this.value;};
					section.appendChild(color);
					*/
					
					var commentaires = document.createElement("textarea");
					commentaires.placeholder=commentaires.title="Remarques sur ce parcours";
					commentaires.value = this.comment;
					commentaires.onchange = function(){that.comment=this.value;};
					section.appendChild(commentaires);
					 
					corps.appendChild(section);
					 
					//troisème zone (carte)
					section = document.createElement("section");
					
					var zoneGPS = document.createElement("div");
					var typeAffichage = document.createElement("output");
					typeAffichage.value = "Décimal";
					typeAffichage.onclick = function(){
						if(this.value === "Décimal"){
							this.value = "Sexagésimal";
							console.warn("TODO: affichage en sexagésimal");
						}else{
							this.value = "Décimal";
							console.warn("TODO: affichage en décimal");
						}
					};
					zoneGPS.appendChild(typeAffichage);
					 
					//latitude
					var labelLat = document.createElement("label");
					labelLat.textContent = "Latitude :";
					labelLat.htmlFor = "lat"+this.uid;
					zoneGPS.appendChild(labelLat);
					 
					var orientationLat = document.createElement("select");
					var option = document.createElement("option");
					option.textContent = option.value = "N";
					orientationLat.add(option);
					option = document.createElement("option");
					option.textContent = option.value = "S";
					orientationLat.add(option);
					orientationLat.onchange=function(){
						var lat = latValue.value; //TODO lecture sexagésimal
						if(this.value === "S"){
							lat = -lat;
						}
						that.latitude = lat;
					};
					zoneGPS.appendChild(orientationLat);
					 
					var latValue = document.createElement("input");
					latValue.value = this.localisation[0];
					latValue.id = "lat"+this.uid;
					latValue.onchange=function(){
						var lat = this.value; //TODO lecture sexagésimal
						if(orientationLat.value === "S"){
							lat = -lat;
						}
						that.latitude = lat;
					};
					zoneGPS.appendChild(latValue);
					 
					//longitude
					var labelLng = document.createElement("label");
					labelLng.textContent = "Longitude :";
					labelLng.htmlFor = "lng"+this.uid;
					zoneGPS.appendChild(labelLng);
					 
					var orientationLng = document.createElement("select");
					option = document.createElement("option");
					option.textContent = option.value = "E";
					orientationLng.add(option);
					option = document.createElement("option");
					option.textContent = option.value = "W";
					orientationLng.add(option);
					orientationLng.onchange=function(){
						var lng = lngValue.value; //TODO lecture sexagésimal
						if(this.value === "W"){
							lng = -lng;
						}
						that.longitude = lng;
					};
					zoneGPS.appendChild(orientationLng);
					
					var lngValue = document.createElement("input");
					lngValue.value = this.localisation[1];
					lngValue.id = "lng"+this.uid;
					lngValue.onchange=function(){
						var lng = this.value; //TODO lecture sexagésimal
						if(orientationLng.value === "W"){
							lng = -lng;
						}
						that.longitude = lng;
					};
					zoneGPS.appendChild(lngValue);
					 
					 				 
					 section.appendChild(zoneGPS);
					 
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
						 case "image":
							 imageSRC.focus();
							 break;
						 case "commentaire":
							 commentaires.focus();
							 break;
					 }
					 break;
					 /*  "editor_view"  *****************************************************/
					 case "editor_view":
					 default:
						 parentElement.className = "lieu_editor_view";
						 
						 //gestion de la carte
						 if(!this.map){
							 //la carte n'est pas encore chargée
							 this.map = new Map(document.createElement("div"),{
								center:this.localisation,
								zoom:this.zoom,
								onclick:function(){
									var element=that.map.sourceElement.parentNode;
									if(!element.className){
										//le parcours n'est pas en mode édition
			console.debug("passage en mode édition"+that.uid);
										
										element.className = "carteActive";
										that.map.refresh();
										setTimeout(that.map.refresh.bind(that.map),600); //pour rafraichir après l'animation
										//that.map.center=that.localisation;
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
							this.map.sourceElement.className = "map";
							//ajout du parcours
							this.map.addPath({
								chemin:this.chemin,
								color:this.color
							});
							
							this.map.addMarker({
								center:this.localisation,
								type:this.metaType,
								visible:true,
								ondragend:function(event){
									that.localisation = event.localisation;
								}
							});
						}
						
						var marker = this.map.markers[0];
						 
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

						//première zone (image)
						var section = document.createElement("figure");
						
						//fonction d'affichage des information de l'image
						var displayEXIF = function(){
							var parent = this.parentNode,
								cache = document.createElement("div"),
								exifData = that.exifData,
								cadre = document.createElement("div"),
								header = document.createElement("header"),
								btn = document.createElement("button"),
								table = document.createElement("table"),
								isModified = false;
								
								//gestion du masque
								cache.className = "cache";
								cache.onclick = remove;
								
								//gestion du cadre
								cadre.className = "zoneExif";
								
								//gestion du titre
								header.textContent = "Informations contenues dans l'image";
								cadre.appendChild(header);
								
								//Récupération des données GPS
								btn.textContent = "Récupérer les données GPS";
								btn.title = "Permet de localiser l'image à partir de ses données GPS";
								if(!exifData.GPSLatitude && !exifData.GPSLongitude && !exifData.GPSAltitude){
									btn.disabled = true;
									btn.title = "Aucune information GPS n'a été trouvée pour cette image";
								}
								btn.onclick=function(){
									var localisation = that.localisation,
										tmp;
									if(exifData.GPSLatitude){
										tmp=exifData.GPSLatitude[0]+(exifData.GPSLatitude[1] + exifData.GPSLatitude[2]/60)/60;
										if(exifData.GPSLatitudeRef==="S"){
											tmp=-tmp;
										}
										localisation[0]=tmp;
									}
									if(exifData.GPSLongitude){
										var tmp=exifData.GPSLongitude[0]+(exifData.GPSLongitude[1] + exifData.GPSLongitude[2]/60)/60;
										if(exifData.GPSLongitudeRef==="W"){
											tmp=-tmp;
										}
										localisation[1]=tmp;
									}
									if(exifData.GPSAltitude){
										var tmp=exifData.GPSAltitude;
										if(exifData.GPSAltitudeRef==1){
											tmp=-tmp;
										}
										localisation[2]=tmp;
									}
									that.localisation = localisation;
									isModified = true;
								};
								cadre.appendChild(btn);
								
								//affichage des données
								if(exifData){
									for(var x in exifData){
										write(x,exifData[x]);
									}
									var thead = table.createTHead(),
									row = thead.insertRow(-1),
									cell = row.insertCell(-1);
									cell.textContent = "Paramètre";
									cell = row.insertCell(-1);
									cell.textContent = "Valeur";
									/*cell = row.insertCell(-1);
										*cell.textContent = "Action";*/
									cadre.appendChild(table);
								}else{
									cadre.textContent = "Aucune données disponible";
								}
								
								//ajout des éléments
								parent.appendChild(cache);
								parent.appendChild(cadre);
								
								function write(nom,valeur){
									var row = table.insertRow(-1),
										cell = row.insertCell(-1),
										btn;
									cell.textContent = nom;
									cell = row.insertCell(-1);
									cell.textContent = valeur;
									row.onclick = function(){addInfo(nom,valeur);};
								}
								
								function addInfo(nom,valeur){
									//permet d'ajouter une information EXIF dans l'objet
									var cache = document.createElement("div"),
										boite = document.createElement("div"),
										header = document.createElement("header"),
										select = document.createElement("select"),
										information = document.createElement("div"),
										option,btn;
									
									//création du masque
									cache.className = "cache";
									cache.onclick = removeBoite;
									
									//création de la boite
									boite.className = "question";
									
									//contenu de la boite
									//titre
									header.textContent = "Récupération de l'information \""+nom+'"';
									boite.appendChild(header);
									
									//valeur
									information.textContent = "Valeur : "+valeur;
									information.title = "Valeur à copiée";
									boite.appendChild(information);
								 
									//anticipation de sélection
									var preselected = "";
									switch(nom.toLowerCase()){
										case "orientation":
											preselected = "orientation";
											break;
										case "datetime":
										case "datetimeorignal":
										case "datetimedigitized":
											preselected = "date";
											break;
										case "imagedescription":
											preselected = "comment"
											break;
										case "gpsimgdirection":
											preselected = "direction";
											break;
										default:
											preselected="comment";
									}
									
									//récupération des propriétées de l'objet
									var exception = ["map","exifData","pst","position"];
									for(var x in that){
										if(typeof that[x] !== "function" && !~exception.indexOf(x)){
											option = document.createElement("option");
											option.textContent = option.value = x;
											if(x === preselected){
												option.selected=true;
											}
											select.add(option);
										}
									}
									select.title = "Propriété dans laquelle la valeur doit être copiée";
									boite.appendChild(select);
									
									//ajouts des boutons d'actions
									btn = document.createElement("button");
									btn.textContent = "✎";
									btn.title = "Définir cette valeur comme contenu";
									btn.onclick=function(){
										that[select.value] = valeur;
										isModified = true;
										removeBoite();
									};
									boite.appendChild(btn);
									btn = document.createElement("button");
									btn.textContent = "+";
									btn.title = "Ajouter cette valeur au contenu existant";
									btn.onclick=function(){
										that[select.value] = that[select.value] + valeur;
										isModified = true;
										removeBoite();
									};
									boite.appendChild(btn);

									//ajout des éléments au DOM
									cadre.appendChild(cache);
									cadre.appendChild(boite);

									function removeBoite(){
										cadre.removeChild(cache);
										cadre.removeChild(boite);
									}
								}
								
								function remove(){
									parent.removeChild(cache);
									parent.removeChild(cadre);
									if(isModified){
										that.display();
									}
								}
						};
						
						var image = new Image();
						image.src=this.image;
						image.className="orientation"+this.orientation;
						image.alt="image décrivant ce lieu";
						image.onclick = displayEXIF;
						section.appendChild(image);
						
						var imageZoom = new Image();
						imageZoom.src=this.image;
						imageZoom.className="zoom orientation"+this.orientation;
						imageZoom.alt="image décrivant ce lieu grossit";
						imageZoom.onclick = displayEXIF;
						section.appendChild(imageZoom);
						
						
						var exif = document.createElement("button");
						exif.textContent = "Détails de l'image";
						exif.title = "Informations contenu dans l'image";
						exif.onclick = displayEXIF;
						if(!this.exifData){
							exif.disabled=true;
							this.exifData = function(exifData){
								exif.disabled=false;
							};
						}
						section.appendChild(exif);
						
						corps.appendChild(section);
						
						//deuxième zone (détails)
						section = document.createElement("section");

						var date = document.createElement("time");
						date.datetime = this.date;
						date.textContent = this.date;
						date.ondblclick=function(){that.display(parentElement,"editor","date");event.stopPropagation();};
						section.appendChild(date);
						
						var commentaires = document.createElement("details");
						var debut = document.createElement("summary");
						debut.textContent = (this.comment||"").substr(0,30); //TODO améliorer cet affichage
						commentaires.appendChild(debut);
						commentaires.appendChild(document.createTextNode(this.comment.substr(30,this.comment.length)));
						commentaires.ondblclick=function(event){that.display(parentElement,"editor","commentaire");event.stopPropagation();};
						section.appendChild(commentaires);

						corps.appendChild(section);

						//troisième zone (carte)
						section = document.createElement("aside");

						var carte = document.createElement("div");
						carte.appendChild(this.map.sourceElement);
						section.appendChild(carte);

						var control = document.createElement("form");
						
						var metaType = this.createElementMetaType();
						metaType.onchange = function(){that.metaType=this.value;};
						control.appendChild(metaType);
						
						var direction = document.createElement("div");
						direction.textContent="→";
						direction.onclick=function(){console.warn("TODO: changer la direction");};
						control.appendChild(direction);
						
						section.appendChild(control);

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
 /**
  * Lecture des données EXIF d'une image
  * 	@src (string) : url de l'image
  * 	@callBack (function) : fonction de retour pour gérer les données EXIF
  * 		→ exifData (object): chaque propriétée est une donnée de l'image
  **/
		readExif:{
			value:function(src,callBack){
				if(typeof callBack === "undefined" && typeof src === "function"){
					callBack = src;
					src = this.image;
				}else if(typeof src === "undefined"){
					src = this.image;
				}
				if(typeof callBack !== "function"){
					callBack = null;
				}
				
				var exifData={src:src},that=this;
				function EXIF_loaded(){
					if(callBack){
						callBack.bind(that)(exifData.exifdata);
					}
				}
				EXIF.getData(exifData,EXIF_loaded,true);
			},
			writable : false, enumerable : true, configurable : false
		},
		createElementMetaType:{
			value:function(){
				var element = document.createElement("select");
				
				var optgroup=document.createElement("optgroup");
				optgroup.label="Divers";
				var option=document.createElement("option");
				option.value=0;
				option.textContent="Divers";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Lieux";
				option=document.createElement("option");
				option.value=10;
				option.textContent="Monument";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=11;
				option.textContent="Monument religieux";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=12;
				option.textContent="Lié à Compostelle";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=13;
				option.textContent="Croix";
				optgroup.appendChild(option);

				option=document.createElement("option");
				option.value=15;
				option.textContent="Rue";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Paysage";
				option=document.createElement("option");
				option.value=20;
				option.textContent="Paysage";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=21;
				option.textContent="Paysage ←";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=22;
				option.textContent="Paysage ↖";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=23;
				option.textContent="Paysage ↑";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=24;
				option.textContent="Paysage ↗";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=25;
				option.textContent="Paysage →";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=26;
				option.textContent="Paysage ↘";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=27;
				option.textContent="Paysage ↓";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=28;
				option.textContent="Paysage ↙";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=29;
				option.textContent="Chemin";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Repas";
				option=document.createElement("option");
				option.value=30;
				option.textContent="Repas (général)";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=31;
				option.textContent="Restaurant";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=32;
				option.textContent="Pique-nique";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=33;
				option.textContent="Snack";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=34;
				option.textContent="Bar/Bistrot";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Hébergement";
				option=document.createElement("option");
				option.value=40;
				option.textContent="Hébergement (général)";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=41;
				option.textContent="Gîte/refuge";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=42;
				option.textContent="Hôtel";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=43;
				option.textContent="Camping";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=44;
				option.textContent="Camping sauvage";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Services";
				option=document.createElement("option");
				option.value=50;
				option.textContent="Services (général)";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=51;
				option.textContent="Pharmacie";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=52;
				option.textContent="Poste";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=53;
				option.textContent="Épicerie";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=54;
				option.textContent="Boulangerie";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Véhicule motorisé";
				option=document.createElement("option");
				option.value=60;
				option.textContent="Véhicule (général)";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=61;
				option.textContent="Train";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=62;
				option.textContent="Bus";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=63;
				option.textContent="Avion";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=64;
				option.textContent="Bateau/Ferry";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=65;
				option.textContent="Taxis";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=66;
				option.textContent="Voiture";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Transport naturel";
				option=document.createElement("option");
				option.value=70;
				option.textContent="Transport (général)";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=71;
				option.textContent="Marche";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=72;
				option.textContent="Vélo";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=73;
				option.textContent="Cheval";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=74;
				option.textContent="Roller/Trotinette";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Itinéraire";
				option=document.createElement("option");
				option.value=80;
				option.textContent="Itinéraire (général)";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=81;
				option.textContent="Itinéraire principal";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=82;
				option.textContent="Itinéraire secondaire";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=83;
				option.textContent="Déviation";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=84;
				option.textContent="Variante";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=85;
				option.textContent="Départ";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=86;
				option.textContent="Arrivée";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=87;
				option.textContent="Étape";
				optgroup.appendChild(option);
				element.appendChild(optgroup);

				optgroup=document.createElement("optgroup");
				optgroup.label="Faune";
				option=document.createElement("option");
				option.value=90;
				option.textContent="Animal (général)";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=91;
				option.textContent="Chat";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=92;
				option.textContent="Chien";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=93;
				option.textContent="Vache";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=94;
				option.textContent="Cheval";
				optgroup.appendChild(option);
				option=document.createElement("option");
				option.value=95;
				option.textContent="Animal sauvage";
				optgroup.appendChild(option);
				option=document.createElement("option");
				element.appendChild(optgroup);
				
				var metaType = this.metaType,
					i=0,
					options=element.options,
					li=options.length;
				do{
					if(options[i].value==metaType){
						options[i].selected=true;
						break;
					}
				}while(++i<li);
				
				return element;
			},
			writable : false, enumerable : false, configurable : false
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

	Object.defineProperties(Lieu.prototype,membres);
})();
