/*
	API de gestion de carte pour Google Map
*/


function GoogleMap(sourceElement,option){
	option||(option={});
	try{
		var internalAttribute = {
			position : {
				value : [0,0,0],
				writable : false,
				enumerable : false,
				configurable : false
			},
			vType : {
				value : "",
				writable : true,
				enumerable : false,
				configurable : false
			},
			markers : {
				value : [],
				writable : false,
				enumerable : false,
				configurable : false
			},
			listPath : {
				value : [],
				writable : false,
				enumerable : false,
				configurable : false
			},
			map : {
				value : null,
				writable : true,
				enumerable : true,
				configurable : false
			},
			sourceElement : {
				value : sourceElement,
				writable : true,
				enumerable : false,
				configurable : false
			}
		};
		Object.defineProperties(this,internalAttribute);
	
		option.zoom = option.zoom || 10;
		option.type = option.type || "Map";
	
		var center = option.center;
		this.map = new google.maps.Map(sourceElement, {
			zoom: option.zoom,
			center: new google.maps.LatLng(center[0],center[1]),
			mapTypeId: option.type
		});
		
		this.center = option.center;
		this.zoom = option.zoom;
		this.type = option.type;
		
		if(typeof option.onclick === "function"){
			google.maps.event.addListener(this.map, "click", callback(onclick,this));
		}
		if(typeof option.ondrag === "function"){
			google.maps.event.addListener(this.map, "drag", callback(ondrag,this));
		}
		if(typeof option.ondragend === "function"){
			google.maps.event.addListener(this.map, "dragend", callback(ondragend,this));
		}
		if(typeof option.ondragstart === "function"){
			google.maps.event.addListener(this.map, "dragstart", callback(ondragstart,this));
		}
		if(typeof option.ondblclick === "function"){
			google.maps.event.addListener(this.map, "dblclick", callback(ondblclick,this));
		}
	}catch(e){
		console.warn("Google Map could not be used. DefaultMap will be used instead.\n"+e.message);
		return new DefaultMap(sourceElement,option);
	}
	this.resize();
}

(function(){
	//héritage
	GoogleMap.prototype = new DefaultMap();
	GoogleMap.prototype.constructor = GoogleMap;
	
	//définition des accesseurs
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
				var position=this.map.getCenter();
				position=[position.lat(),position.lng(),this.position[2]]; //[Latitude,Longitude, Altitude]
				return position;
			},
			set : function(position){
				if(!position || ! position instanceof Array){
					position = [];
				}
				var that = this;
				
				//latitude
				if(typeof position[0] !== "number"){
					position[0] = this.position[0] || 0;
				}
				this.position[0] = position[0];
				
				//longitude
				if(typeof position[1] !== "number"){
					position[1] = this.position[1] || 0;
				}
				this.position[1] = position[1];
				
				//altitude
				if(typeof position[2] !== "number"){
					position[2] = this.position[2] || 0;
					this.getAltitude(this.position[0],this.position[1],function(alt){
						if(alt!==null){
							that.position[2] = alt;
						}
					});
				}
				this.position[2] = position[2];
				
				if(this.Walker){
					this.Walker.move(position[0],position[1]);
				}
				var latlng=new google.maps.LatLng(position[0],position[1]);
				
				this.map.panTo(latlng);
			},
			enumerable : true,
			configurable : false
		},
		zoom : {
			get : function(){
				return this.map.getZoom();
			},
			set : function(zoom){
				this.map.setZoom(zoom);
			},
			enumerable : true,
			configurable : false
		},
		resize : {//permet de rafraichir la carte quand la taille de l'élément source a changé
			value : function(){
				google.maps.event.trigger(this.map, 'resize');
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		refresh : {//permet de rafraichir la carte
			value : function(){
				google.maps.event.trigger(this.map, 'resize');
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		type : {
			get : function(){
				switch(this.vType){
					case google.maps.MapTypeId.SATELLITE :
						return "Satellite";
				}
				return "";
			},
			set : function(type){
				switch(type){
					case "Satellite" :
						this.vType = google.maps.MapTypeId.SATELLITE;
						break;
				}
				this.vType = type;
			},
			enumerable : true,
			configurable : false
		},
		addMarker : {
			value : function(option){
				option||(option={});
				var center=this.center,
					position_lat=option.lattitude||center[0],
					position_long=option.longitude||center[1],
					visible=option.visible===false?false:true,
					title=option.title||"",
					onclick=option.onclick,
					ondrag=option.ondrag,
					ondragstart=option.ondragstart,
					ondragend=option.ondragend,
					ondblclick=option.ondblclick,
					obj={
						position:new google.maps.LatLng(position_lat,position_long),
						title:title,
						map:this.map,
						visible:visible,
						icon:this.getIcon(option.type),
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
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		addPath : {
			value : function(option){
				this.listPath.push(new GoogleMap.Path(this,option));
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
					latMax=max(location1[0],location2[0]);
					latMin=min(location1[0],location2[0]);
					lngMax=max(location1[1],location2[1]);
					lngMin=min(location1[1],location2[1]);
				}
				var rect=new google.maps.LatLngBounds(new google.maps.LatLng(latMin,lngMin),new google.maps.LatLng(latMax,lngMax));
				this.map.fitBounds(rect);
				
				var latlng=this.map.getCenter();
				this.position[0]=latlng.lat();
				this.position[1]=latlng.lng();
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		getAltitude : {
			value : function(lat,long,f){
				var latlng=new google.maps.LatLng(lat,long);
				var getAltitude=new google.maps.ElevationService();
				getAltitude.getElevationForLocations({locations:[latlng]}, function(results, elevationStatus){
					if(elevationStatus==="OK"){
						f(results[0].elevation);
					}else{
						f(null);
					}
				});
			},
			writable : false,
			enumerable : true,
			configurable : false
		},
		removeMarker : {
			value : function(index){
				this.markers[index].setMap(null);
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
				this.markers[index].setPosition(new google.maps.LatLng(position[0],position[1]));
			},
			writable : false,
			enumerable : true,
			configurable : false
		}
	};
	
	Object.defineProperties(GoogleMap.prototype,properties);
	
	GoogleMap.Path = function(map,option){
		this.map=map;
		option || (option = {});
		this.points=option.points || [map.center,map.center]; //liste des points du chemin
		this.color=option.color||"#FF0000"; //couleur du tracé
		this.opacity=option.opacity||0.8; //opacité du tracé
		this.baseWidth=option.width||2; //épaisseur du tracé
		
		//propriétées interne
		this.chemins=[];//liste des tracés utilisés
		this.marqueurs=[];//liste des marqueurs utilisés
		
		//recalcule toutes les altitudes des points du chemin
		if(option.recalcAltitude){
			this.resetAltitude();
		}
		
		//dessine le tracé
		this.draw();
	}; //TODO à relier avec DefaultMap.Path
	
	GoogleMap.Path.prototype = new DefaultMap.Path();
	GoogleMap.Path.prototype.constructor = GoogleMap.Path;
	
	properties = {
		draw : {
			value : function(){
				var i=0,li=this.points.length,trace=[],chemin;
				if(this.editable){
					var that=this;
					function setAltitude(position){
						return function(altitude){
							this.points[position][2] = altitude;
						};
					}
					function marker_moved(i){ //permet de bouger un point
						return function(info){
							var i=that.marqueurs.indexOf(this);
							that.points[i][0]=info.latLng.lat();
							that.points[i][1]=info.latLng.lng();
							that.map.getAltitude(that.points[i][0],that.points[i][1],setAltitude(i));
							that.draw(i);
						};
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
			},
			writable : false,
			enumerable : true,
			configurable : false
		}
	};
	
	Object.defineProperties(GoogleMap.Path.prototype,properties);
	
})();

if(typeof callback !== "function"){
	function callback(f,obj){
		return function(){
			f.apply(obj,arguments);
		};
	}
}

var Map = GoogleMap;