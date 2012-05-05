/*
	API de gestion de carte pour Google Map
*/

/*
	Constructeur Map(element,option)
		element: élément où la carte doit être affichée
		option: liste des options pour créer cette carte
			{
				center:[x,y] coordonées du centre de la carte
				onclick (function): action à déclencher lorsqu'on clique sur la carte (default: null)
				ondrag (function): action à déclencher lorsqu'on déplace la carte (default: null)
				ondragstart (function): action à déclencher lorsqu'on commence à déplacer la carte (default: null)
				ondragend (function): action à déclencher lorsqu'on fini de déplacer la carte (default: null)
				ondblclick (function): action à déclencher lorsqu'on double-clique sur la carte (default: null)
			}

	Membres:
		map: carte gmap
		element: élément où la carte doit être affichée
		markers ([{marker},…]): liste des marqueurs présents
		listPath ({Path},…]): liste des chemins
		center ([lat,long,alt]): définie le centre de la carte (les éléments lat,long et alt ne sont pas modifiable individuellement)
		zoom (number): niveau de zoom plus le zoom est grand plus le zoom est important

	Méthodes:
		refresh(): permet de rafraichir la carte aux dimensions du div
		addMarker(option): permet d'ajouter un marqueur
			option: {

			}
		removeMarker(index): supprimes un marqueur qui est à index dans la liste markers
		moveMarker(index,position,centerMap): déplace un marqueur qui est à index (centerMap positionne la carte à l'endrois de ce marqueur s'il est à True)
		addPath(option): permet d'ajouter un chemin
			option: {
				point [lat,long,alt]:
			}
		removePath(index): permet de supprimer un chemin

*/

function Map(element,option){
	var position_lat=(option.center && option.center[0])||46.765,
		position_long=(option.center && option.center[1])||1.780409,
		onclick=option.onclick,
		ondrag=option.ondrag,
		ondragstart=option.ondragstart,
		ondragend=option.ondragend,
		ondblclick=option.ondblclick;

	this.element=element;
	this.map = new google.maps.Map(element, {
		zoom: 14,
		center: new google.maps.LatLng(position_lat,position_long),
		mapTypeId: google.maps.MapTypeId.SATELLITE
	});
	this.markers=[];
	this.listPath=[];
	this.altitude=null;


	/*definition des Getter et Setter*/

	this.__defineGetter__("center",function(){
		var latlng=this.map.getCenter();
		latlng=[latlng.lat(),latlng.lng(),this.altitude]; //[Latitude,Longitude, Altitude]
		return latlng;
	});
	this.__defineSetter__("center",function(latlng){ //[Latitude,Longitude, Altitude]
		if(this.Walker){
			this.Walker.move(latlng[0],latlng[1]);
		}
		latlng=new google.maps.LatLng(latlng[0],latlng[1]);
		var getAltitude=new google.maps.ElevationService();
		getAltitude.getElevationForLocations({locations:[latlng]}, function(results, elevationStatus){
			if(elevationStatus==="OK"){
				this.altitude=results[0].elevation;
			}else{
				this.altitude=null;
			}
		});
		this.map.panTo(latlng);
	});

	this.__defineGetter__("zoom",function(){
		return this.map.getZoom();
	});
	this.__defineSetter__("zoom",function(val){
		this.map.setZoom(val);
	});

	/*Paramétrage*/
	if(typeof onclick === "function"){
		google.maps.event.addListener(this.map, "click", callback(onclick,this));
	}
	if(typeof ondrag === "function"){
		google.maps.event.addListener(this.map, "drag", callback(ondrag,this));
	}
	if(typeof ondragend === "function"){
		google.maps.event.addListener(this.map, "dragend", callback(ondragend,this));
	}
	if(typeof ondragstart === "function"){
		google.maps.event.addListener(this.map, "dragstart", callback(ondragstart,this));
	}
	if(typeof ondblclick === "function"){
		google.maps.event.addListener(this.map, "dblclick", callback(ondblclick,this));
	}

	if(option.walker){
		var latlng=this.map.getCenter();
		this.Walker=new Walker(this.map,latlng.lat(),latlng.lng(),0);
	}

	// marqueur de position
	/*if(option.marqueur){
	this.position=new google.maps.Marker({position:new google.maps.LatLng(option.marqueur[0],option.marqueur[1]),title:"emplacement",map:this.map,visible:false,icon:"./images/icone_photo.gif",clickable:false,draggable:false,zIndex:49000});
}*/
	//this.addMarker(); //DEBUG
	//this.addPath({points:[[46.76509394065213,1.7804098754883402],[46.7,1.7]]});
}

Map.prototype.fit=function(location1,location2){
	// permet de centrer la carte sur le rectangle délimité par location1 et location2
	//location1: SW
	//location2: NE
	var latMax=-Infinity,
		latMin=Infinity,
		lngMax=-Infinity,
		lngMin=Infinity,
		tmp,
		max=Math.max,
		min=Math.min;
	if(!location1 || !location2){
		//définiT les bords en fonctions des chemins et marqueurs
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
		//TODO ordonner correctement
		//if(location1 intanceOf google.maps.LatLng){

		//}
		alert('TODO: fit');
	}
	var rect=new google.maps.LatLngBounds(new google.maps.LatLng(latMin,lngMin),new google.maps.LatLng(latMax,lngMax));
	this.map.fitBounds(rect);
}

Map.prototype.refresh=function(){
	google.maps.event.trigger(this.map, 'resize');
};

Map.prototype.addMarker=function(option){
	/*
		option:{
			lattitude (number): définie la lattitude de la position du marqueur (default: lattitude du centre de la carte)
			longitude (number): définie la longitude de la position du marqueur (default: longitude du centre de la carte)
			visible (boolean): définie si le marqueur doit être visible (default: true)
			type (number): définie le type de marqueur (default: -1 (unknown))
			title (string): définie le titre du marqueur (default :"")

			onclick (function): définie l'action à déclencher lorsqu'on clique sur le marqueur (default: null)
			ondrag (function): définie l'action à déclencher lorsqu'on bouge le marqueur (default: null)
			ondragstart (function): définie l'action à déclencher lorsqu'on commence à bouger le marqueur (default: null)
			ondragend (function): définie l'action à déclencher lorsqu'on fini de bouger le marqueur (default: null),
			ondblclick (function): définie l'action à déclencher lorsqu'on double-clique sur le marqueur (default: null)
		}
	*/
	option||(option={});
	var center=this.center,
		position_lat=option.lattitude||center[0],
		position_long=option.longitude||center[1],
		visible=option.visible===false?false:true,
		icon="",
		title=option.title||"",
		onclick=option.onclick,
		ondrag=option.ondrag,
		ondragstart=option.ondragstart,
		ondragend=option.ondragend,
		ondblclick=option.ondblclick,
		obj;

	switch(option.type){

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
			if(isNaN(option.type)) option.type=-1;
	}

	obj={
		position:new google.maps.LatLng(position_lat,position_long),
		title:title,
		map:this.map,
		visible:visible,
		icon:icon,
		clickable:!!onclick,
		draggable:!!(ondragend||ondrag||ondragstart),
		zIndex:49000
	};
	var marker=new google.maps.Marker(obj);
	//Gestion événements
	if(typeof onclick === "function"){
		google.maps.event.addListener(marker, "click", callback(onclick,marker));
	}
	if(typeof ondrag === "function"){
		google.maps.event.addListener(marker, "drag", callback(ondrag,marker));
	}
	if(typeof ondragend === "function"){
		google.maps.event.addListener(marker, "dragend", callback(ondragend,marker));
	}
	if(typeof ondragstart === "function"){
		google.maps.event.addListener(marker, "dragstart", callback(ondragstart,marker));
	}
	if(typeof ondblclick === "function"){
		google.maps.event.addListener(marker, "dblclick", callback(ondblclick,marker));
	}
	marker.type=option.type;
	this.markers.push(marker);
	return marker;
};

Map.prototype.removeMarker=function(index){
	this.markers[index].setMap(null);
	this.markers.splice(index,1);
}

Map.prototype.moveMarker=function(index,position,centerMap){
	if(centerMap){
		this.center=position;
	}
	this.markers[index].setPosition(new google.maps.LatLng(position[0],position[1]));
}

Map.prototype.addPath=function(option){
	this.listPath.push(new Path(this,option));
}

Map.prototype.removePath=function(index){
	this.listPath[index].clear();
	this.listPath.splice(index,1);
}

Map.parseInfo=function(info,dataType){
	switch(dataType){
		case "center":
			var center=info.latLng;
			if(center){
				return [center.lat(),center.lng(),null];
			}else{
				return [null,null,null];
			}
		default:
			return null;
	}
}


function Path(map,option){
	this.map=map;
	this.points=option.points || [map.center,map.center];
	this.color=option.color||"#FF0000";
	this.opacity=option.opacity||0.8;
	this.baseWidth=option.width||2;
	this.chemins=[];//liste des tracés utilisés
	this.marqueurs=[];//liste des marqueurs utilisés

	var that=this,
		editable=option.editable || false;
	this.__defineGetter__("editable",function(){return editable;});
	this.__defineSetter__("editable",function(newVal){
		if(newVal==editable) return false;
		editable=!!newVal;
		that.draw();
		return editable;
	});

	if(option.recalcAltitude){
		var getAltitude=new google.maps.ElevationService();
		function setAltitude(position){//permet de définir l'altitude d'un point
			getAltitude.getElevationForLocations({locations:[new google.maps.LatLng(position[0],position[1])]},
				function(results, elevationStatus){
					if(elevationStatus==="OK"){
						position[2]=results[0].elevation;
					}else{
						position[2]=null;
					}
				}
			);
		}
		var i=0,li=this.points.length;
		do{
			setAltitude(this.points[i]);
		}while(++i<li);
	}

	this.draw();
}
/*
fonction permettant de dessiner le tracé
paramètre:
	pointer: paramètre indiquant ce qu'il y a à redessiner
		false (ou undefined): tout redessiner
		true : seulement les marqueurs d'édition
		/[0-9]+/ : seulement le point en question
*/
Path.prototype.draw=function(pointer){
	var i=0,li=this.points.length,trace=[],chemin;
	if(this.editable){
		var that=this;
		function setAltitude(position){//permet de définir l'altitude d'un point
			var getAltitude=new google.maps.ElevationService();
			getAltitude.getElevationForLocations({locations:[new google.maps.LatLng(position[0],position[1])]}, function(results, elevationStatus){
				if(elevationStatus==="OK"){
					position[2]=results[0].elevation;
				}else{
					position[2]=null;
				}
			});
		}
		function marker_moved(i){ //permet de bouger un point
			return function(info){
				var i=that.marqueurs.indexOf(this);
				that.points[i][0]=info.latLng.lat();
				that.points[i][1]=info.latLng.lng();
				setAltitude(that.points[i]);
				that.draw(i);
			}
		}
		function marker_removed(i){ //permet de supprimer un point
			return function(info){
				var i=that.marqueurs.indexOf(this);
				if(that.points.length<=2) return false;
				that.points.splice(i,1);
				that.marqueurs[i].setMap(null);
				that.marqueurs.splice(i,1);
				that.draw();
			}
		}
		function add_point(i){ //permet d'ajouter un point
			return function(info){
				var i=that.chemins.indexOf(this)+1;
				var x=(that.points[i-1][0]+that.points[i][0])/2,
					y=(that.points[i-1][1]+that.points[i][1])/2;
				that.points.splice(i,0,[x,y]);
				setAltitude(that.points[i]);

				//ajout des objets sur la carte
				that.marqueurs.splice(i,0,that.map.addMarker({type:-12,lattitude:x,longitude:y,ondragend:marker_moved(),ondblclick:marker_removed()}));

				trace=[
					new google.maps.LatLng(x,y),
					new google.maps.LatLng(x,y)
				];//ce tracé sera redéfini lors du draw placé ci-dessous => pas la peine de calculer ici le tracé exact
				chemin=new google.maps.Polyline({
					path: trace,
					strokeColor: that.color,
					strokeOpacity: that.opacity/2,
					strokeWeight: that.baseWidth*2,
					map: that.map.map
				});
				google.maps.event.addListener(chemin, "rightclick",add_point());
				that.chemins.splice(i,0,chemin);

				that.draw(i);
			}
		}
		if(typeof pointer !== "number"){
			this.clear(pointer);//enlève les précédents tracés
			while(i<li-1){
				if(i){
					this.marqueurs.push(this.map.addMarker({type:-12,lattitude:this.points[i][0],longitude:this.points[i][1],ondragend:marker_moved(i),ondblclick:marker_removed(i)}));
				}else{
					//premier point
					this.marqueurs.push(this.map.addMarker({type:-10,lattitude:this.points[0][0],longitude:this.points[0][1],ondragend:marker_moved(i),ondblclick:marker_removed(i)}));
				}
				if(pointer!==true){//dessin du tracé
					trace=[
						new google.maps.LatLng(this.points[i][0],this.points[i++][1]),
						new google.maps.LatLng(this.points[i][0],this.points[i][1])
					];
					chemin=new google.maps.Polyline({
						path: trace,
						strokeColor: this.color,
						strokeOpacity: this.opacity/2,
						strokeWeight: this.baseWidth*2,
						map: this.map.map
					});
					google.maps.event.addListener(chemin, "rightclick",add_point(i));
					this.chemins.push(chemin);
				}else{
					i++;
				}
			}
			this.marqueurs.push(this.map.addMarker({type:-11,lattitude:this.points[i][0],longitude:this.points[i][1],ondragend:marker_moved(i),ondblclick:marker_removed(i)}));
		}else{//modification d'un seul point
			i=pointer-1;
			if(i>=0){
				trace=[
					new google.maps.LatLng(this.points[i][0],this.points[i++][1]),
					new google.maps.LatLng(this.points[i][0],this.points[i][1])
				];
				this.chemins[pointer-1].setPath(trace);
			}
			i=pointer;
			if(i<this.chemins.length){
				trace=[
					new google.maps.LatLng(this.points[i][0],this.points[i++][1]),
					new google.maps.LatLng(this.points[i][0],this.points[i][1])
				];
				this.chemins[pointer].setPath(trace);
			}
		}

	}else{ //affichage du chemin sans édition

		while(i<li){
			trace.push(new google.maps.LatLng(this.points[i][0],this.points[i++][1]));
		}
		chemin=new google.maps.Polyline({
			path: trace,
			strokeColor: this.color,
			strokeOpacity: this.opacity,
			strokeWeight: this.baseWidth,
			map: this.map.map
		});
		this.chemins.push(chemin);
	}
};

Path.prototype.changeColor=function(color){
	this.color=color;
	this.draw();
};
/*
fonction permettant d'effacer le tracé
paramètre:
	pointer: paramètre indiquant ce qu'il y a à redessiner
		false (ou undefined): tout redessiner
		true : seulement les marqueurs d'édition
		/[0-9]+/ : seulement le point en question
*/
Path.prototype.clear=function(pointer){
	if(typeof pointer !== "number"){

		//enlève le tracé
		if(pointer!==true){
			var i=this.chemins.length;
			while(i--){
				this.chemins[i].setMap(null);
			}
			this.chemins=[];
		}

		//enlève les marqueurs d'edition
		var markers=this.map.markers;
		i=markers.length;
		while(i--){ //Il faut parcourrir le tableau à l'envers
			if(markers[i].type<-9 && markers[i].type>-13){
				this.map.removeMarker(i);
			}
		}
		this.marqueurs=[];
	}else{ //seulement le point en question
		//alert('todo (clear)');//TODO
	}
}

Path.prototype.distance=function(){
	function calc_distance(p1,p2){
		/*
		 p[0]=lattitude
		 p[1]=longitude
		*/
		//equateur: 6 378,137 km
		//polaire: 	6 356,7523142 km
		var Rt=6370,conv=Math.PI/180,
			lat1=p1[0]*conv,lat2=p2[0]*conv,lng=(p2[1]-p1[1])*conv,
			d=Rt*Math.acos(Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng)+Math.sin(lat1)*Math.sin(lat2));
		if(typeof p1[2] === "number" && typeof p2[2] === "number"){
			d=Math.sqrt(d*d+(p1[2]-p2[2])*(p1[2]-p2[2])/1000000);
		}
		return d;
	}
	var i=0,li=this.points.length,cumul=0;
	do{
		cumul+=calc_distance(this.points[i],this.points[++i]);
	}while(i<li-1);
	return cumul; //en km
};

Path.prototype.getRect=function(){
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
};


/*
	permet de gérer une icone mobile
*/
function Walker(map,lat,long,type){
	this.lat=lat;
	this.long=long;
	if(isNaN(this.lat)){this.lat=0;}
	if(isNaN(this.long)){this.long=0;}
	this.map=map;
	this.timer=0;
	this.nextType=type||0;
	obj={
		position:new google.maps.LatLng(lat,long),
		map:this.map,
		visible:true,
		zIndex:50000
	};
	this.marker=new google.maps.Marker(obj);
	this.changeType(type);
}

Walker.prototype.changeType=function(type){
	var url="";
	switch(type){
		//eat
		case 30:
		case 31:
		case 32:
		case 33:
		case 34:
			url="./images/marcheur_eat.gif";
			break;
		//hebergement
		case 40:
		case 41:
		case 42:
		case 43:
		case 44:
			url="./images/marcheur_sleep.gif";
			break;
		//marqueur mobile
		case -21:
			url="./images/marcheur_right_move.gif"
			break;
		case -22:
			url="./images/marcheur_left_move.gif"
			break;
		default:
			url="./images/marcheur_statique.gif";
	}
	this.marker.setIcon(url);
}

Walker.prototype.move=function(lat,long,type){
	//permet de déplacer l'icone
	type || (type=this.nextType);
	var i=0,
		liste_point=[],
		that=this;
	if(this.timer){
		clearInterval(this.timer);
	}
	(function create_liste(){
		//genere la liste de points où le marqueur doit être placé
		var nbPoints=20,
			px=that.long,
			py=that.lat,
			dx=(long-px)/nbPoints,
			dy=(lat-py)/nbPoints,
			i=0;
		while(i++<nbPoints){
			liste_point.push([px+dx*i,py+dy*i]);
		}
		if(dx>0){
			that.changeType(-21);
		}else{
			that.changeType(-22);
		}
	})();
	function deplace(){
		that.lat=liste_point[i][1];
		that.long=liste_point[i++][0];
		that.marker.setPosition(new google.maps.LatLng(that.lat,that.long));
		if(i>=liste_point.length){
			clearInterval(that.timer);
			that.timer=0;
			that.changeType(type);
		}
	}
	this.timer=setInterval(deplace,100);
}


if(typeof callback !== "function"){
	function callback(f,obj){
		return function(){
			f.apply(obj,arguments);
		};
	}
}
