
function DefaultMap(sourceElement,option){
	option = option || {};
	this.position = [0,0,0];
	this.markers = [];//interne
	this.listPath = [];//interne
	
	this.center = option.center;
	this.sourceElement = sourceElement;
	this.zoom = option.zoom || 10;
	this.type = option.type || "Map";
	if(this.sourceElement){
		this.resize();
	}
}

(function(){
	//définition des accesseurs et des propriétés
	var properties = {
		size : { //permet de modifier ou de récupérer la taille de l'élément source où se trouve la carte
			get : function(){
				var elem = this.sourceElement;
				var size = [elem.clientWidth,elem.clientHeight];
				return size;
			},
			set : function(size){
				var elem = this.sourceElement;
				elem.style.width = size[0];
				elem.style.height = size[1];
				this.resize();
			},
			enumerable : true,
			configurable : false
		},
		center : { //permet de modifier ou de récupérer le centre de la carte
			get : function(){
				return this.position;
			},
			set : function(position){
				if(!position || ! position instanceof Array){
					position = [];
				}
				//latitude
				if(typeof position[0] !== "number"){
					position[0] = this.position[0] || 0;
				}
				//longitude
				if(typeof position[1] !== "number"){
					position[1] = this.position[1] || 0;
				}
				//altitude
				if(typeof position[2] !== "number"){
					position[2] = this.position[2] || 0;
				}
				this.position = position;
			},
			enumerable : true,
			configurable : false
		},
		zoom : {
			get : function(){
				return this.vZoom;
			},
			set : function(zoom){
				this.vZoom = zoom;
			},
			enumerable : true,
			configurable : false
		},
		refresh : {//permet de rafraichir la carte
			value : function(){
				var couleur = "";
				switch(this.vType){
					case "Satellite" : couleur = "#CCCCFF";
						break;
					case "Map" : couleur = "#CCFFCC";
						break;
					default:
						couleur = "#FFCCCC";
				}
				this.sourceElement.style.backgroundColor = couleur;
				this.sourceElement.textContent = this.center.join(",")+" | "+this.vType;
			},
			writable : false,
			enumerable : true,
			configurable : false
		},resize : {//permet de rafraichir la carte quand la taille de l'élément source a changé
			value : function(){
				this.refresh();
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		type : {
			get : function(){
				return this.vType;
			},
			set : function(type){
				this.vType = type;
			},
			enumerable : true,
			configurable : false
		},
		addMarker : {
			value : function(option){
				option||(option={});
				var marker = {center:option.position};
				this.markers.push(marker);
				return marker;
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		removeMarker : {
			value : function(index){
				return this.markers.splice(index,1);
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		moveMarker : {
			value : function(index,position,centerMap){
				if(centerMap){
					this.center = position;
				}
				this.markers[index].center = position;
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		changeMarkerType : {
			value : function(index,newType){
				this.markers[index].type = this.getIcon(newType);
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		addPath : {
			value : function(option){
				this.listPath.push(option && option.path);
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		fit : {
			value : function(location1,location2){
				/**
				 * permet de centrer la carte sur le rectangle délimité par location1 et location2
				 * 		@location1 [lat,lng]: SW
				 * 		@location2 [lat,lng]: NE
				 * 
				 * 		Si aucun n'est définit, les bords sont choisit en fonctions des chemins et marqueurs 
				 */
				var latMax=-Infinity,
					latMin=Infinity,
					lngMax=-Infinity,
					lngMin=Infinity,
					tmp,
					max=Math.max,
					min=Math.min;
				if(!location1 || !location2){
					//définit les bords en fonctions des chemins et marqueurs
					var i,li;
					//liste chemins
					i=0,li=this.listPath.length;
					while(i<li){
						tmp=this.listPath[i++].getRect();
						latMax=max(latMax,tmp[2]);
						latMin=min(latMin,tmp[0]);
						lngMax=max(lngMax,tmp[3]);
						lngMin=min(lngMin,tmp[1]);
					}
					//liste des marqueurs
					i=0,li=this.markers.length;
					while(i<li){
						tmp=this.markers[i++].getPosition();
						latMax=max(latMax,tmp.lat());
						latMin=min(latMin,tmp.lat());
						lngMax=max(lngMax,tmp.lng());
						lngMin=min(lngMin,tmp.lng());
					}
				}else{
					latMax=max(location1[0],location2[0]);
					latMin=min(location1[0],location2[0]);
					lngMax=max(location1[1],location2[1]);
					lngMin=min(location1[1],location2[1]);
				}
				
				this.center = location1;
			},
			writable : false,enumerable : true,configurable : false
		},
		getAltitude : {
			value : function(lat,long,f){
				f(0);
				return 0;
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		getPlaceName : {
			value : function(lat,long,f){
				f(null);
				return null;
			},
		writable : false,
		enumerable : true,
		configurable : false
		},
		getIcon : {
			value : function(iconType){
				var icon = "";
				switch(iconType){
					case 11:
						icon="./images/croix_compostelle_icone.gif";
						break;
					case 12:
						icon="./images/coquille2_icone.gif";
						break;

					case 20:
					case 21:
					case 22:
					case 23:
					case 24:
					case 25:
					case 26:
					case 27:
					case 28:
						icon="./images/icone_photo.gif";break;

					case 31:
						icon="http://maps.gstatic.com/intl/fr_fr/mapfiles/ms/micons/restaurant.png";
						break;

					case 41:
						icon="http://maps.gstatic.com/intl/fr_fr/mapfiles/ms/micons/homegardenbusiness.png";
						break;
					case 42:
						icon="http://maps.gstatic.com/intl/fr_fr/mapfiles/ms/micons/lodging.png";
						break;
					case 43:
						icon="http://maps.gstatic.com/intl/fr_fr/mapfiles/ms/micons/campground.png";
						break;

					case 61:
						icon="http://maps.gstatic.com/intl/fr_fr/mapfiles/ms/micons/rail.png";
						break;
					case 85:
						icon="./images/drapeau_D.gif";break;
					case 86:
						icon="./images/drapeau_A.gif";break;
					case 87:
						icon="./images/drapeau_E.gif";break;
					//marqueur edition de chemin
					case -10:
						icon="./images/drapeau_D.gif";break;
					case -11:
						icon="./images/drapeau_A.gif";break;
					case -12:
						icon="./images/drapeau_E.gif";break;
					default:
						icon="";
				}
				return icon;
			},
			writable : false,
			enumerable : true,
			configurable : false
		}
		
	};
	
	Object.defineProperties(DefaultMap.prototype,properties);
	
	DefaultMap.Path = function(map,option){
		this.map=map||{};
		option || (option = {});
		this.points=option.points || [this.map.center,this.map.center]; //liste des points du chemin
		this.color=option.color||"#FF0000"; //couleur du tracé
		this.opacity=option.opacity||0.8; //opacité du tracé
		this.baseWidth=option.width||2; //épaisseur du tracé
		
		//propriétées interne
		this.chemins=[];//liste des tracés utilisés
		this.marqueurs=[];//liste des marqueurs utilisés
		
		var properties = {
			editable : {
				get : function(){
					return option.editable;
				},
				set : function(b){
					option.editable = !!b;
					this.draw();
				},
				enumerable : true, configurable : false
			},
			changePath : {
				value : function(pth){
					this.points = pth;
					this.draw();
				},
				writable : false, enumerable : true, configurable : false
			}
		};
		Object.defineProperties(this,properties);
		
		//recalcule toutes les altitudes des points du chemin
		if(option.recalcAltitude){
			this.resetAltitude();
		}
		
		//dessine le tracé
		this.draw();
	};
	
	properties = {
		draw : {
			value : function(){
				
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		clear : {
			/*
			fonction permettant d'effacer le tracé
			paramètre:
				@pointer: paramètre indiquant ce qu'il y a à redessiner
					false (ou undefined): tout redessiner
					true : seulement les marqueurs d'édition
					/[0-9]+/ : seulement le point en question
			*/
			value : function(pointer){
				
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		resetAltitude : {
			value : function(){
				function setAltitude(position){
					return function(altitude){
						this.points[position][2] = altitude;
					};
				}
				var i=0,li=this.points.length,point;
				do{
					point = this.points[i];
					this.map.getAltitude(point[0],point[1],setAltitude(i));
				}while(++i<li);
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		changeColor : {
			value : function(){
				this.color = color;
				this.draw();
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		distance : {
			value : function(){
				var calc_distance=mapTools.distance,
					i=0,
					li=this.points.length,
					cumul=0;
				do{
					cumul+=calc_distance(this.points[i],this.points[++i]);
				}while(i<li-1);
				return cumul; //en km
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		getRect : {
			value : function(){
				var i=0,
					li=this.points.length,
					min=Math.min,
					max=Math.max,
					latMax=-Infinity,
					latMin=Infinity,
					lngMax=-Infinity,
					lngMin=Infinity;
				while(i<li){
					latMin=min(latMin,this.points[i][0]);
					latMax=max(latMax,this.points[i][0]);
					lngMin=min(lngMin,this.points[i][1]);
					lngMax=max(lngMax,this.points[i++][1]);
				}
				return [latMin,lngMin,latMax,lngMax];
			},
			writable : false,
			enumerable : true,
			configurable : false
		}
	};
	
	Object.defineProperties(DefaultMap.Path.prototype,properties);
	
})();

var Map = DefaultMap;

var mapTools = {
	distance : function(p1,p2){
		/*
		 * p[0]=lattitude
		 * p[1]=longitude
		 */
		//equateur: 6 378,137 km
		//polaire: 	6 356,7523142 km
		var Rt=6370,conv=Math.PI/180,
			lat1=p1[0]*conv,lat2=p2[0]*conv,lng=(p2[1]-p1[1])*conv,
			d=Rt*Math.acos(Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng)+Math.sin(lat1)*Math.sin(lat2));
		if(typeof p1[2] === "number" && typeof p2[2] === "number"){
			d=Math.sqrt(d*d+(p1[2]-p2[2])*(p1[2]-p2[2])/1000000);
		}
		return d;//en km
	},
	/**
	 * Convertion de coordonnées Sexagésimal,décimal en un autre format
	 * 		@ str (string) : coordonée à convertir
	 * 		@ output (string/number) : format de sortie de la coordonée
	 *				- (0) "décimal" : 12.345 (default)
	 * 				- (1) "sexagésimal" : 12°34'56.78"
	 * 				- (2) "sexa-décimal" : 12°34.56
	 */
	convertCoordinate : function(str,output){
		str = str+"";
		var deg,match,d,m,s,neg,rslt;
		if(match=/^\s*([-WESN]?)(\d{1,3})\s*[°\s]\s*([0-6]?\d)\s*['\s]\s*([0-6]?\d(?:\.\d+)?)\s*[\s"']+\s*([WESN]?)\s*$/.exec(str)){
			//format d°m's" (sexagésimal)
			deg = match[4]/3600 + match[3]/60 + parseFloat(match[2]);
			if(match[1] && ~"-SW".indexOf(match[1])){
				deg = -deg;
			}
			if(match[5] && ~"SW".indexOf(match[5])){
				deg = -deg;
			}
		}else if(match=/^\s*([-WESN]?)(\d{1,3})\s*[°\s]\s*([0-6]?\d(?:\.\d+)?)\s*["'\s]+\s*([WESN]?)\s*$/.exec(str)){
			//format d°f (sexagésimal-décimal)
			deg = match[3]/60 + parseFloat(match[2]);
			if(match[1] && ~"-SW".indexOf(match[1])){
				deg = -deg;
			}
			if(match[4] && ~"SW".indexOf(match[4])){
				deg = -deg;
			}
		}else if(match=/^\s*([-WESN]?)\s*([0-3]?\d{1,2})([0-6]\d(?:\.\d+)?)\s*,?\s*([WESN]?)\s*$/.exec(str)){
			//format df (sexagésimal-décimal)
			deg = match[3]/60 + parseFloat(match[2]);
			if(match[1] && ~"-SW".indexOf(match[1])){
				deg = -deg;
			}
			if(match[4] && ~"SW".indexOf(match[4])){
				deg = -deg;
			}
		}else if(match=/^\s*([WESN]?)(-?\d{1,3}(?:\.\d+)?)\s*[°"']?\s*([WESN]?)\s*$/.exec(str)){
			//format décimal
			deg = parseFloat(match[2]);
			if(match[1] && ~"-SW".indexOf(match[1])){
				deg = -deg;
			}
			if(match[3] && ~"SW".indexOf(match[3])){
				deg = -deg;
			}
		}else{
			//format non reconnu
			return NaN;
		}
		
		switch(output){
			case 1:
			case "sexagésimal":
			case "sexagesimal":
				neg = deg<0?-1:1;
				deg *= neg;
				
				m = (deg%1)*60;
				d = neg*Math.floor(deg);
				s = (m%1)*60;
				m = Math.floor(m);
				rslt = d+"°"+m+"'"+s+'"';
				break;
			case 2:
			case "sexa-décimal":
			case "sexa-decimal":
			case "sexadécimal":
			case "sexadecimal":
				neg = deg<0?-1:1;
				deg *= neg;
				
				m = (deg%1)*60;
				d = neg*Math.floor(deg);
				rslt = d+"°"+m;
				break;
			case 0:
			case "décimal":
			case "decimal":
			default:
				//format décimal
				rslt = deg;
		}
		return rslt;
	}
};

if(typeof copyArray === "undefined"){
	var copyArray = function(arr){
		if(! arr instanceof Array){
			return null;
		}
		var lst = [], i=0, li=arr.length;
		while(i<li){
			if(arr[i] instanceof Array){
				lst[i] = copyArray(arr[i]);
			}else{
				lst[i] = arr[i];
			}
			i++;
		}
		return lst;
	};
}