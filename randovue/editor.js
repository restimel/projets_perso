var userPosition=[45.0456,3.8849,null];
if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(function(position){
		userPosition=[position.coords.latitude,position.coords.longitude,null]
	});
}

function trim(str){
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function runAction(){
	var obj,
		pstElement=document.getElementById("newPosition"),
		position=parseInt(pstElement.value,10) || 0,
		localisation=null,
		date=null,
		metaType=0,
		zoom=10,
		src,
		chemin=null;

	if(position>randoListe.liste.length) position=randoListe.liste.length;

	if(position>0){
		var previous=randoListe.liste[position-1].getInfo();
		localisation=[previous.px,previous.py,previous.pa];
		date=previous.date;
		metaType=previous.metaType;
		zoom=previous.zoom;
		if(!document.getElementById("newSection").checked){
			var i=position;
			while(i-- && randoListe.liste[i].getInfo().type!=="section"){}
			if(i>=0){chemin=randoListe.liste[i].getInfo().parcours}
		}
	}
	if(!localisation){
		localisation=userPosition;//.concat([]);
	}

	if(document.getElementById("newSection").checked){
		obj=new rSection(position,localisation,date);
	}else{
		obj=new rAction(position,localisation,date,metaType,zoom,src,chemin);
	}
	randoListe.add(obj,position);
	pstElement.value=position+1;
	pstElement.max=randoListe.liste.length;
}

var bulkLoader=(function(){
	var fenetre=document.createElement("div");
	fenetre.className="fenetre";
	var data=document.createElement("textarea");
	data.placeholder="liste images ou objet JSON";
	fenetre.appendChild(data);
	var close=document.createElement("button");
	close.className="close";
	close.textContent="X";
	close.onclick=function(){fenetre.style.display="none";};
	fenetre.appendChild(close);

	var loader=document.createElement("button");
	loader.textContent="import";
	loader.onclick=function(){
		var obj,
			pstElement=document.getElementById("newPosition"),
			position=parseInt(pstElement.value,10) || 0,
			localisation=null,
			date=null,
			metaType=0,
			zoom=10,
			src,
			chemin=null,
			dta;

		if(position>0){
			var previous=randoListe.liste[position-1].getInfo();
			localisation=[previous.px,previous.py,previous.pa];
			date=previous.date;
			metaType=previous.metaType;
			zoom=previous.zoom;
			var i=position;
			while(i-- && randoListe.liste[i].getInfo().type!=="section"){}
			if(i>=0){chemin=randoListe.liste[i].getInfo().parcours}
		}
		if(!localisation){
			localisation=userPosition;//.concat([]);
		}

		//test JSON
		function parser(key,value){
			if(!key){
				if(value && typeof value === "object" && (value.type === "body" || value instanceof Array)){
					return value;
				}else{
					return;
				}
			}else{
				/*
				if(value && typeof value === "object"){
					if(value.type === "action"){
						obj=new rAction(position,[value.px,value.py,value.pa],value.date,value.metaType,zoom,value.photo,chemin,value.titre,value.comment);
						randoListe.add(obj,position++);
					}else if(value.type === "section"){
						obj=new rSection(position,value.parcours,value.date,value.titre,value.color);
						randoListe.add(obj,position++);
					}else{
						return null;
					}
				}*/
			}
			return value;
		}
		function addActions(act){
			var obj=new rAction(position,[act.px,act.py,act.pa],act.date,act.metaType,zoom,act.photo,chemin,act.titre,act.comment,true);
			randoListe.add(obj,position++);
		}
		function addSections(sct){
			var obj=new rSection(position,sct.parcours,sct.date,sct.titre,sct.color);
			randoListe.add(obj,position++);
			chemin=sct.parcours;
			var i=0,li=sct.actions.length;
			while(i<li){
				if(sct.actions[i].type==="action") addActions(sct.actions[i]);
				else if(sct.actions[i].type==="section") addSections(sct.actions[i]);
				i++;
			}
		}
		try{
			dta=JSON.parse(data.value,parser);
			var i=0,li=dta.actions.length;
			while(i<li){
				if(dta.actions[i].type==="action") addActions(dta.actions[i]);
				else if(dta.actions[i].type==="section") addSections(dta.actions[i]);
				i++;
			}
		}catch(e){
			dta=null;
		}

		//test listes images
		if(!dta){
			dta=data.value.split(/\r\n|\n|\r|[,;\t]/g);
			var i=0,li=dta.length;
			while(i<li){
				if(!dta[i] || !(/\.[a-z0-9]{3}$/i).test(dta[i]) ){
					i++;
					continue;
				}
				obj=new rAction(position,localisation,date,metaType,zoom,dta[i++],chemin,"","",false);
				randoListe.add(obj,position++);
			}
		}
		document.getElementById("newPosition").value=position;
		data.value="";
		fenetre.style.display="none";
	};
	fenetre.appendChild(loader);

	fenetre.style.display="none";
	document.body.appendChild(fenetre);
	return function(){
		fenetre.style.display="block";
	};
})();

//permet de formater les dates
function formatDate(date,withHour){
	var tmp,rslt;
	if(date){
		tmp=(/(\d\d\d\d)[-:\/\\](\d?\d)[-:\/\\](\d?\d)(?:[ T](\d\d):(\d\d))?/).exec(date);
		if(tmp){
			date=new Date();
			date.setFullYear(tmp[1],tmp[2]-1,tmp[3]);
			if(tmp[4]) date.setHours(tmp[4],tmp[5]);
		}else{
			date=new Date();
		}
	}else{
		date=new Date();
	}

	tmp=date.getMonth()+1;
	if(tmp<10) tmp="0"+tmp;
	rslt=date.getFullYear()+"-"+tmp+"-";
	tmp=date.getDate();
	if(tmp<10) tmp="0"+tmp;
	rslt+=tmp;
	if(withHour){
		tmp=date.getHours();
		if(tmp<10) tmp="0"+tmp;
		rslt+="T"+tmp+":";
		tmp=date.getMinutes();
		if(tmp<10) tmp="0"+tmp;
		rslt+=tmp+"Z";
	}
	return rslt;
}


//permet de créer un input permettant de gérer la position de l'objet
function createPosition(pst){
	var element=document.createElement("input");
	element.type="number";
	element.previousValue=element.value=pst;
	//element.min=0;
	element.title="Position";
	element.onchange=positionOnChange;

	//permet d'inverser les boutons up et down afin de correspondre au mouvement des flèches
	element.onmousedown=positionOnMouseDown;
	element.onclick=positionOnClick;
	element.onmouseup=positionOnMouseUp;
	return element;
}

//fonction gérant le changement de position
function positionOnChange(event){
	if(isNaN(this.value)){
		this.value=this.previousValue;
		return false;
	}
	if(typeof this.oldValue!== "undefined"){
		return false;
	}
	randoListe.changePosition(parseInt(this.previousValue,10),parseInt(this.value,10));
}

/*
fonctions permettant d'inverser les boutons up et down afin de correspondre au mouvement des flèches
*/
function positionOnMouseDown(event){
	this.oldValue=this.value;
	setTimeout(function(that){
		return function(){
			if(typeof that.oldValue !== "undefined"){ //TODO detecter souris encore enfoncée ou non
				if(that.oldValue!=this.value){
					positionOnClick(event);
				}
				delete that.oldValue;
			}
		};
	}(this),500);
}
function positionOnMouseUp(){
	setTimeout(function(that){
		return function(){
			if(typeof that.oldValue !== "undefined"){
				delete that.oldValue;
			}
		};
	}(this),100);
}
function positionOnClick(event){
	if(this.oldValue!=this.value){
		if(Math.abs(this.oldValue-this.value)===1) this.value=parseInt(this.value,10)+2*(this.oldValue-this.value);
		delete this.oldValue;
		this.onchange(event);
	}else{
		delete this.oldValue;
	}
}

function readExif(obj){
	var exifData={src:obj.image};
	function EXIF_loaded(){
		var data=exifData.exifdata;
		/*if(data.UserComment){
			obj.commentElement.value=obj.comment=trim(data.UserComment);
		}*/
		if(data.ImageDescription){
			obj.titreElement.value=obj.titre=trim(data.ImageDescription);
		}
		if(data.DateTimeOriginal || data.DateTimeDigitized){
			obj.dateElement.value=obj.date=formatDate(data.DateTimeOriginal || data.DateTimeDigitized,true);
		}
		if(data.GPSLatitude){
			var tmp=data.GPSLatitude[0]+(data.GPSLatitude[1] + data.GPSLatitude[2]/60)/60;
			if(data.GPSLatitudeRef==="S") tmp=-tmp;
			obj.localisation[0]=tmp;
		}
		if(data.GPSLongitude){
			var tmp=data.GPSLongitude[0]+(data.GPSLongitude[1] + data.GPSLongitude[2]/60)/60;
			if(data.GPSLongitudeRef==="W") tmp=-tmp;
			obj.localisation[1]=tmp;
		}
		if(data.GPSAltitude){
			var tmp=data.GPSAltitude;
			if(data.GPSAltitudeRef==1) tmp=-tmp;
			obj.localisation[2]=tmp;
		}
		if(data.GPSLatitude || data.GPSLongitude || data.GPSAltitude){
			obj.map.moveMarker(0,obj.localisation,true);
		}
	}

	EXIF.getData(exifData,EXIF_loaded,true);
}

//objet Action
function rAction(pst,localisation,date,metaType,zoom,src,chemin,titre,comment,dontReadEXIF){
	var that=this;
	this.position=pst;
	this.element=document.createElement("section");
	this.element.className="rAction";
	this.positionElement=createPosition(pst);
	this.element.appendChild(this.positionElement);

	this.titre=titre||"";
	this.titreElement=document.createElement("input");
	this.titreElement.type="text";
	this.titreElement.value=this.titre;
	this.titreElement.placeholder=this.titreElement.title="Titre pour cette action";
	this.titreElement.onchange=function(){that.titre=this.value;};
	this.element.appendChild(this.titreElement);


	this.date=formatDate(date,true);
	this.dateElement=document.createElement("input");
	this.dateElement.type="dateTime";
	this.dateElement.value=this.date;//"2011-05-05T12:00Z"
	this.dateElement.placeholder=this.dateElement.title="Date: AAAA-MM-JJ HH:MM";
	this.dateElement.onchange=function(){that.date=formatDate(this.value,true);};
	this.element.appendChild(this.dateElement);

	this.image=src||"";
	this.imageElement=document.createElement("img");
	this.imageElement.src=this.image;
	this.imageElement.alt=src||"Image à afficher";
	this.imageElement.title="Image de cette action";
	this.imageElement.onclick=function(){
		var srcElement=document.createElement("input");
		srcElement.type="url";
		srcElement.value=that.image;
		srcElement.placeholder="url de l'image";
		srcElement.onblur=function(){
			if(this.value.substr(0,7)==="http://" && (this.value.substr(7,1)==="." ||this.value.substr(7,1)==="/")) this.value=this.value.substr(7);
			that.imageElement.alt=that.imageElement.src=that.image=this.value;
			that.element.removeChild(srcElement);
			that.imageElement.style.display="";
			if(this.value!=="" && this.value!=="http://" && this.value!=="./"){
				readExif(that);
			}
		}
		that.element.appendChild(srcElement);
		that.imageElement.style.display="none";
		srcElement.focus();
	};
	this.element.appendChild(this.imageElement);
	if(!this.image) setTimeout(function(){that.imageElement.onclick();},10);

	this.comment=comment||"";
	this.commentElement=document.createElement("textarea");
	this.commentElement.placeholder="Saisisez ici vos commentaires";
	this.commentElement.value=this.comment;
	this.commentElement.title="Commentaires de cette action";
	this.commentElement.onchange=function(){that.comment=this.value;};
	this.element.appendChild(this.commentElement);

	this.metaType=metaType||0;

	this.localisation=localisation||[45.0456,3.8849,null]; //[lattitude,longitude]
	this.localisationElement=document.createElement("div");
	this.localisationElement.title="localisation";
	this.map=new Map(this.localisationElement,{center:this.localisation,onclick:function(){
		if(!that.localisationElement.className){
			that.localisationElement.className="carteActive";
			that.map.refresh();
			that.map.center=that.localisation;
			var stop=false;
			that.localisationElement.onmouseout=function(){
				stop=setTimeout(function(){
					if(stop){
						that.localisationElement.className="";
						that.map.refresh();
						that.localisationElement.onmouseout=null;
						that.localisationElement.onmouseover=null;
						that.map.center=that.localisation;
					}
				},500);
			};
			that.localisationElement.onmouseover=function(){
				clearTimeout(stop);
				stop=false;
			};
			that.localisationElement.scrollIntoView();
		}
	}});
	this.map.zoom=zoom||14;
	this.map.addMarker({type:this.metaType,lattitude:that.localisation[0],longitude:that.localisation[1],ondragend:function(info){that.localisation=Map.parseInfo(info,"center");}});
	if(chemin){
		this.map.addPath({color:"#FF0000",points:chemin,editable:false,opacity:0.3,width:3,recalcAltitude:false});
	}
	this.element.appendChild(this.localisationElement);
	setTimeout(function(){
		that.map.refresh();
		that.map.center=that.localisation;
	},10);

	/*Element metaType*/
	this.metaTypeElement=document.createElement("select");
	this.metaTypeElement.title="Type d'action";
	this.metaTypeElement.onchange=function(){
		that.metaType=parseInt(this.value,10);
		if(that.map.markers[0].type!==this.value){
			that.map.removeMarker(0);
			that.map.addMarker({lattitude:that.localisation[0],longitude:that.localisation[1],type:that.metaType,ondragend:function(info){that.localisation=Map.parseInfo(info,"center");}});
		}
	};

	var optgroup=document.createElement("optgroup");
	optgroup.label="Divers";
	var option=document.createElement("option");
	option.value=0;
	option.textContent="Divers";
	optgroup.appendChild(option);
	this.metaTypeElement.appendChild(optgroup);

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
	this.metaTypeElement.appendChild(optgroup);

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
	this.metaTypeElement.appendChild(optgroup);

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
	this.metaTypeElement.appendChild(optgroup);

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
	this.metaTypeElement.appendChild(optgroup);

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
	this.metaTypeElement.appendChild(optgroup);

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
	this.metaTypeElement.appendChild(optgroup);

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
	this.metaTypeElement.appendChild(optgroup);

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
	this.metaTypeElement.appendChild(optgroup);

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
	option.value=85;
	option.textContent="Animal sauvage";
	optgroup.appendChild(option);
	option=document.createElement("option");
	this.metaTypeElement.appendChild(optgroup);

	if(this.metaType){
		var i=1,options=this.metaTypeElement.options,li=options.length;
		do{
			if(options[i].value==this.metaType){
				options[i].selected=true;
				break;
			}
		}while(++i<li);
	}

	this.element.appendChild(this.metaTypeElement);

	var btn=document.createElement("button");
	btn.textContent="getPst";
	btn.onclick=function(){
		var previous=randoListe.liste[that.position-1];
		that.localisation=previous.localisation;
		that.map.moveMarker(0,that.localisation,true);
		that.map.zoom=previous.map.zoom;
	};
	this.element.appendChild(btn);

	btn=document.createElement("button");
	btn.textContent="X";
	btn.title="delete";
	btn.onclick=function(){
		if(confirm("Êtes-vous sûr de supprimer")) randoListe.delete(that.position);
	};
	this.element.appendChild(btn);

	this.isDisplayed=true;
	if(!dontReadEXIF && that.image){
		readExif(this);
	}
}

//permet de gérer si l'objet doit être affiché complètement ou partiellement
rAction.prototype.display=function(dsp){
	var display=dsp||true;
	if(display){
		if(!this.isDisplayed){
			this.element.innerHTML="";
			this.appendChild(this.positionElement);
			this.appendChild(this.titreElement);
			this.appendChild(this.dateElement);
			this.appendChild(this.imageElement);
			this.appendChild(this.commentElement);
			this.appendChild(this.metaTypeElement);
			this.isDisplayed=true;
		}
	}else{
		if(this.isDisplayed){
			this.element.innerHTML="";
			this.isDisplayed=false;
		}
	}
};

//permet de récupérer les informations de l'action
rAction.prototype.getInfo=function(){
	var obj={
		type:"action",
		titre:this.titre,
		comment:this.comment,
		photo:this.image,
		date: this.date,
		metaType:this.metaType,
		px:this.localisation[0],
		py:this.localisation[1],
		pa:this.localisation[2],
		zoom:this.map.zoom
	};
	return obj;
}



//objet Section
function rSection(pst,localisation,date,titre,color){
	var that=this;
	this.position=pst;
	this.element=document.createElement("section");
	this.element.className="rSection";
	this.positionElement=createPosition(pst);
	this.element.appendChild(this.positionElement);

	this.titre=titre||"";
	this.titreElement=document.createElement("input");
	this.titreElement.type="text";
	this.titreElement.value=this.titre;
	this.titreElement.placeholder=this.titreElement.title="Titre de la section";
	this.titreElement.onchange=function(){that.titre=this.value;};
	this.element.appendChild(this.titreElement);

	this.date=formatDate(date,false);
	this.dateElement=document.createElement("input");
	this.dateElement.type="date";
	this.dateElement.value=this.date;//"2011-05-05";
	this.dateElement.placeholder=this.dateElement.title="Date: AAAA-MM-JJ";
	this.dateElement.onchange=function(){that.date=formatDate(this.value,false);};
	this.element.appendChild(this.dateElement);

	this.color=color||"#FF0000";
	this.colorElement=document.createElement("input");
	this.colorElement.type="color";
	this.colorElement.value=this.color;
	this.colorElement.required=true;
	this.colorElement.onchange=function(){
		that.color=this.value;
		that.map.listPath[0].changeColor(that.color);
	};
	this.element.appendChild(this.colorElement);

	if(localisation){
		if(localisation[0] instanceof Array){
			this.parcours=localisation.concat([]);
		}else{
			this.parcours=[localisation.concat([]),localisation.concat([])];
		}
	}else{
		this.parcours=[[45.0456,3.8849],[45.0456,3.8849]];
	}
	this.parcoursElement=document.createElement("div");
	this.parcoursElement.title="Parcours";
	this.map=new Map(this.parcoursElement,{center:this.parcours[0],onclick:function(){
		if(!that.map.listPath[0].editable){
			that.map.listPath[0].editable=true;
			that.parcoursElement.className="carteActive";
			that.map.refresh();
			if(that.map.listPath[0].points.length>2 || that.map.listPath[0].points[0][0]!==that.map.listPath[0].points[1][0] || that.map.listPath[0].points[0][0]!==that.map.listPath[0].points[1][0]){
				that.map.fit();
			}else{
				var p1=that.map.listPath[0].points[0],
					p2=that.map.listPath[0].points[that.map.listPath[0].points.length-1];
				that.map.center=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2];
			}

			var stop=false;
			that.parcoursElement.onmouseout=function(){
				stop=setTimeout(function(){
					if(stop){
						that.map.listPath[0].editable=false;
						that.parcoursElement.className="";
						that.map.refresh();
						that.parcoursElement.onmouseout=null;
						that.parcoursElement.onmouseover=null;
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
			that.parcoursElement.onmouseover=function(){
				clearTimeout(stop);
				stop=false;
			};
			that.parcoursElement.scrollIntoView();
		}
	}});
	this.map.addPath({color:this.color,points:this.parcours,editable:false,recalcAltitude:false}); //QUESTION: laisser une option pour forcer la calculation des altitudes?
	//this.parcoursElement.onclick=function(){that.map.listPath[0].editable=!that.map.listPath[0].editable};
	this.element.appendChild(this.parcoursElement);
	setTimeout(function(){
		that.map.refresh();
		var p1=that.map.listPath[0].points[0],
			p2=that.map.listPath[0].points[1];
		that.map.center=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2];
	},10);

	var btn=document.createElement("button");
	btn.textContent="X";
	btn.title="delete";
	btn.onclick=function(){
		if(confirm("Êtes-vous sûr de supprimer")) randoListe.delete(that.position);
	};
	this.element.appendChild(btn);

	this.isDisplayed=true;
}

//permet de gérer si l'objet doit être affiché complètement ou partiellement
rSection.prototype.display=function(){
	var display=true;
	if(display){
		if(!this.isDisplayed){
			this.element.innerHTML="";
			this.appendChild(this.positionElement);
			this.appendChild(this.titreElement);
			this.appendChild(this.dateElement);
			this.appendChild(this.parcoursElement);
			this.isDisplayed=true;
		}
	}else{
		if(this.isDisplayed){
			this.element.innerHTML="";
			this.isDisplayed=false;
		}
	}
};

//permet de récupérer les informations de la section
rSection.prototype.getInfo=function(){
	var obj={
		type:"section",
		titre:this.titre,
		date: this.date,
		px:this.parcours[0][0],
		py:this.parcours[0][1],
		pa:this.parcours[0][2],
		parcours:this.parcours,
		distance:this.map.listPath[0].distance(),
		color:this.color
	};
	return obj;
}

//permet de gérer un changement de position dans le document
rAction.prototype.changePosition=rSection.prototype.changePosition=function(newPosition){
	this.position=this.positionElement.previousValue=this.positionElement.value=newPosition;
}

rAction.prototype.toString=rSection.prototype.toString=function(){
	return this.titre;
}

//objet principal permettant de gérer la liste des actions
var randoListe={
	zone:document.getElementById("affichage"),//zone d'affichage
	liste:[], //liste des objets
	add:function(obj,position){
	//ajoute un nouvel objet
		this.liste.push(obj);
		this.zone.appendChild(obj.element);
		this.changePosition(this.liste.length-1,position);
/*
		if(position>=this.liste.length){
			this.liste.push(obj);
			this.zone.appendChild(obj.element);
		}else if(position<=0){
			this.zone.insertBefore(obj.element,this.liste[0].element);
			this.liste.shift(obj);
		}else{
			this.zone.insertBefore(obj.element,this.liste[position].element);
			this.liste.splice(position,0,obj);
		}*/
	},
	delete:function(position){
		this.changePosition(position,this.liste.length-1);
		this.zone.removeChild(this.liste.splice(this.liste.length-1,1)[0].element);
		this.view(position);
	},
	display:function(){
	//gère l'affichage des objets
		var aff=this.zone;
		aff.innerHTML="";
		var i=0,li=this.liste.length;
		while(i<li){
			aff.appendChild(this.liste[i++].element);
		}
	},
	view:function(index){
		//if(index>=this.liste.length-1) index=this.liste.length-1;
		this.liste[index].element.scrollIntoView();
	},
	changePosition:function(oldPosition,newPosition){
		//permet de modifier la position d'un objet
		if(oldPosition<newPosition){
			//mise à jour DOM
			if(newPosition>=this.liste.length-1){
				newPosition=this.liste.length-1;
				this.zone.appendChild(this.liste[oldPosition].element);
			}else{
				this.zone.insertBefore(this.liste[oldPosition].element,this.liste[newPosition+1].element);
			}

			//mise à jour des n° de position
			var i=newPosition;
			while(i>oldPosition){
				this.liste[i].changePosition(--i);
			}
			this.liste[i].changePosition(newPosition);
			//mise à jour de la liste
			this.liste.splice(newPosition,0,this.liste.splice(oldPosition,1)[0]);
		}else{
			if(newPosition<0) newPosition=0;
			//mise à jour DOM
			this.zone.insertBefore(this.liste[oldPosition].element,this.liste[newPosition].element);
			//mise à jour des n° de position
			var i=newPosition;
			while(i<oldPosition){
				this.liste[i].changePosition(++i);
			}
			this.liste[i].changePosition(newPosition);
			//mise à jour de la liste
			this.liste.splice(newPosition,0,this.liste.splice(oldPosition,1)[0]);
		}
		this.view(newPosition);
	},
	getInfo:function(){
		//permet d'obtenir un objet en incluant les actions dans les sections
		var i=0,li=this.liste.length,rslt={actions:[],type:"body"},section=rslt,obj;
		while(i<li){
			obj=this.liste[i++].getInfo();
			if(obj.type==="section"){
				if(section!==rslt) rslt.actions.push(section);
				section={
					actions:[],
					type:"section",
					titre:obj.titre,
					date:obj.date,
					parcours:obj.parcours,
					distance:obj.distance,
					color:obj.color
				};
			}else{
				section.actions.push(obj);
			}
		}
		if(section!==rslt) rslt.actions.push(section);
		return rslt;
	},
	toString:function(){
		//permet d'obtenir une chaine de caractères de l'ensemble
		return JSON.stringify(this.getInfo(),function(key,value){
			if(key === "zoom") return;
			return value;
		});
	}
};
