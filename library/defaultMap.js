
function DefaultMap(sourceElement,option){
	option = option || {};
	this.position = [0,0,0];
	this.markers = [];
	
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
		addPath : {
			value : function(path,option){
				this.path.push(path);
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		fit : {
			value : function(location1,location2){
				// permet de centrer la carte sur le rectangle délimité par location1 et location2
				//location1: SW
				//location2: NE
				this.center = location1;
			},
			writable : false,
			enumerable : true,
			configurable : false
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
		getIcon : {
			value : function(iconType){
				var icon = "";
				switch(icontype){
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
})();

