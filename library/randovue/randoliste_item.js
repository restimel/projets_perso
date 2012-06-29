/**
 * API générique permettant de gérer les items gérée par randoListe
 */

/**
 * Constructeur
 * 	pst (number): Position de l'objet dans la liste
 *	option (objet) : options permettant de définir le parcours
 */ 
function RandoListeItem(pst,option){
	//vérification et préparation des paramètres
	if(typeof pst !== "number"){
		pst = 0;
	}
	
	this.position=pst;
}

(function(){
	//gestion du prototype de RandoListe_Item
	var membres = {
		position:{
			get: function(){
				return this.pst;
			},
			set: function(position){
				this.pst=position;//membre temporaire
				this.display();
			},
			enumerable : true, configurable : false
		},
		titre:{
			value:"item",
			writable : true, enumerable : true, configurable : false
		},
		parentElement:{
			value:null,
			writable : true, enumerable : false, configurable : false
		},
		currentMode:{
			value:"viewer",
			writable : true, enumerable : false, configurable : false
		},
		/**
		 * méthode permettant de récupérer les informations de cet élément
		 */
		getInfo:{
			value:function(){
				var obj={
					type:"item",
					titre:this.titre
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
		* 			"viewer":		affichage des données
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
				
				var position = document.createElement("output");
				position.value = this.position;
				position.onclick=function(){alert("Generic item could not been modified :'(");};
				parentElement.appendChild(position);
				
				var modeE = document.createElement("output");
				modeE.value = mode;
				parentElement.appendChild(modeE);
			},
			writable : false, enumerable : true, configurable : false
		},
		/**
		* fonction permettant de récupérer la bonne date (format YYYY-MM-DD)
		* 	strDate (string): string contenant la date
		*/
		getDateFromStr:{
			value:function(strDate){
				var date="",
					time="",
					year="",
					mounth="",
					day="",
					hour="",
					min="",
					sec="",
					extract;
				
				function convertMonth(d){
					switch(d.toLowerCase()){
						case "jan": return 1; break;
						case "january": return 1; break;
						case "janvier": return 1; break;
						case "feb": return 2; break;
						case "february": return 2; break;
						case "fevrier": return 2; break;
						case "février": return 2; break;
						case "fev": return 2; break;
						case "fév": return 2; break;
						case "mar": return 3; break;
						case "march": return 3; break;
						case "mars": return 3; break;
						case "apr": return 4; break;
						case "april": return 4; break;
						case "avr": return 4; break;
						case "avril": return 4; break;
						case "may": return 5; break;
						case "mai": return 5; break;
						case "jun": return 6; break;
						case "june": return 6; break;
						case "juin": return 6; break;
						case "jul": return 7; break;
						case "july": return 7; break;
						case "juillet": return 7; break;
						case "aug": return 8; break;
						case "august": return 8; break;
						case "aout": return 8; break;
						case "août": return 8; break;
						case "aou": return 8; break;
						case "sep": return 9; break;
						case "september": return 9; break;
						case "septembre": return 9; break;
						case "oct": return 10; break;
						case "october": return 10; break;
						case "octobre": return 10; break;
						case "nov": return 11; break;
						case "novembre": return 11; break;
						case "november": return 11; break;
						case "dec": return 12; break;
						case "déc": return 12; break;
						case "december": return 12; break;
						case "decembre": return 12; break;
						case "décembre": return 12; break;
						default:
							return 0;
					}
				}
					
				//analyse de la source
				if(extract=/([0-3]?[0-9])[-_.,/\s\\]+([0-1]?[0-9])[-_.,/\s\\]+([0-9]{4})(?:[-_.,;/\s\\:]+([0-2]?[0-9])[-_hH:.,;/\s\\]+([0-5]?[0-9])[-_mMiInN:.,;/\s\\]+([0-5]?[0-9]))?/.exec(strDate)){
					//25-09-2012 - 21:36:29 → dD-mM-YYYY ? hH:mM:sS
					year=extract[3];
					mounth=extract[2];
					day=extract[1];
					hour=extract[4];
					min=extract[5];
					sec=extract[6];
				}
				
				else if(extract=/([0-1]?[0-9])[-_.,/\s\\]+([0-3]?[0-9])[-_.,/\s\\]+([0-9]{4})(?:[-_.,;/\s\\:]+([0-2]?[0-9])[-_hH:.,;/\s\\]+([0-5]?[0-9])[-_mMiInN:.,;/\s\\]+([0-5]?[0-9]))?/.exec(strDate)){
					//09-25-2012 - 21:36:29 → mM-dD-YYYY ? hH:mM:sS
					year=extract[3];
					mounth=extract[1];
					day=extract[2];
					hour=extract[4];
					min=extract[5];
					sec=extract[6];
				}
				
				else if(extract=/([0-9]{2,4})[-_.,/\s\\]+([0-1]?[0-9])[-_.,/\s\\]+([0-3]?[0-9])(?:[-_.,;/\s\\:]+([0-2]?[0-9])[-_hH:.,;/\s\\]+([0-5]?[0-9])[-_mMiInN:.,;/\s\\]+([0-5]?[0-9]))?/.exec(strDate)){
					//2012-09-25 - 21:36:29 → yyYY-mM-dD ? hH:mM:sS
					year=extract[1];
					mounth=extract[2];
					day=extract[3];
					hour=extract[4];
					min=extract[5];
					sec=extract[6];
				}
				
				else if(extract=/([0-3]?[0-9])[-_.,/\s\\]+([A-Za-zéûÉÛ]+)[-_.,/\s\\]+([0-9]{2,4})(?:[-_.,;/\s\\:]+([0-2]?[0-9])[-_hH:.,;/\s\\]+([0-5]?[0-9])[-_mMiInN:.,;/\s\\]+([0-5]?[0-9]))?/.exec(strDate)){
					//25 Sep 2012 21:36:29 → dD mounth yyYY ? hH:mM:sS
					year=extract[3];
					mounth=convertMonth(extract[2])+"";
					day=extract[1];
					hour=extract[4];
					min=extract[5];
					sec=extract[6];
				}
				
				else if(extract=/([A-Za-zéûÉÛ]+)[-_.,/\s\\]+([0-3]?[0-9])[-_.,/\s\\]+([0-9]{2,4})(?:[-_.,;/\s\\:]+([0-2]?[0-9])[-_hH:.,;/\s\\]+([0-5]?[0-9])[-_mMiInN:.,;/\s\\]+([0-5]?[0-9]))?/.exec(strDate)){
					//September 25, 2012, 21:36:29 → dD mounth yyYY ? hH:mM:sS
					//TODO gérer lamention AM/PM
					year=extract[3];
					mounth=convertMonth(extract[1])+"";
					day=extract[2];
					hour=extract[4];
					min=extract[5];
					sec=extract[6];
				}

				//date
				if(year.length<4){
					year="20"+year;
				}
				if(mounth.length<2){
					mounth="0"+mounth;
				}
				if(day.length<2){
					day="0"+day;
				}
				date=year+"-"+mounth+"-"+day;
				
				//time
				time=hour+":"+min+":"+sec;
				
				return date;
			},
			writable : false, enumerable : true, configurable : false
		},
		toJSON:{
			value:function(key){
				return this.getInfo(key);
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
	Object.defineProperties(RandoListeItem.prototype,membres);
	
	
	//Gestion des valeurs par défaut
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
				value : RandoListeItem.prototype.getDateFromStr((new Date()).toLocaleDateString()),
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
})();
