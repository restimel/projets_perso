
var main={
	liste:null,
	mode:"Carte",
	current:{obj:null,section:0,action:0},
	separatorV:"25em",
	separatorH:"6em",
	loader:function(obj){
		obj.toString=function(){return"toto"};
		this.liste=obj.actions;
		if(document.getElementById("affichage").className==="modeCarte"){
			this.mode="Carte";
		}else{
			this.mode="Image";
		}
		this.current.action=this.current.section=0;
		this.display();
	},
	changeMode:function(mode){
		if(mode!=this.mode){
			if(mode=="Carte"){
				this.mode="Carte";
			}else{
				this.mode="Image";
			}
			this.display();
		}
	},
	nextSection:function(notUpdate){
		//permet de passer à la section suivante
		if(this.current.section<this.liste.length-1){
			this.current.action=0;
			this.current.section++;
			if(!notUpdate) this.update();
		}
	},
	previousSection:function(notUpdate){
		//permet de passer à la section précédente
		if(this.current.section>0){
			this.current.action=0;
			this.current.section--;
			if(!notUpdate) this.update();
		}
	},
	nextAction:function(notUpdate){
		//permet de passer à l'action suivante
		if(this.current.action<this.liste[this.current.section].actions.length-1){
			this.current.action++;
			if(!notUpdate) this.update();
		}else{
			this.nextSection(notUpdate);
		}
	},
	previousAction:function(notUpdate){
		//permet de passer à l'action précédente
		if(this.current.action>0){
			this.current.action--;
			if(!notUpdate) this.update();
		}else{
			if(this.current.section>0){
				this.previousSection(true);
				this.current.action=this.liste[this.current.section].actions.length-1;
				if(!notUpdate) this.update();
			}
		}
	},
	goto:function(sct,act){
		//permet d'aller à la section sct et à l'action act
		if(sct>=this.liste.length){
			sct=this.liste.length-1;
		}else if(sct<0){
			sct=0;
		}
		if(act>=this.liste[sct].actions.length){
			act=this.liste[sct].actions.length-1;
		}else if(act<0){
			act=0;
		}
		this.current.section=sct;
		this.current.action=act;
		this.update();
	},
	display:function(){
		//permet de refaire l'affichage complet de la page
		var affichage=document.getElementById("affichage");
		affichage.innerHTML="";
		affichage.className="mode"+this.mode;
		switch(this.mode){
			case "Carte":
				dspCarte(affichage);
				break;
			case "Image":
				dspImage(affichage);
				break;
			default:
				dspLoader(affichage);
		}
	},
	update:function(){}
};

function dspCarte(affichage){
	//permet de créer l'affichage pour le mode Carte
	var zoneMap=document.createElement("div");
	zoneMap.className="zoneMap";
	zoneMap.style.right=main.separatorV;

	var carte=new Map(zoneMap,{walker:true});


	var zoneSection=document.createElement("div");
	zoneSection.className="zoneSection";
	zoneSection.style.width=main.separatorV;
	zoneSection.style.height=main.separatorH;

	var titreSection=document.createElement("header");
	zoneSection.appendChild(titreSection);
	var dateSection=document.createElement("time");
	zoneSection.appendChild(dateSection);


	var zoneAction=document.createElement("div");
	zoneAction.className="zoneAction";
	zoneAction.style.width=main.separatorV;
	zoneAction.style.top=main.separatorH;

	var zoomImage=document.createElement("img");
	zoomImage.className="zoomImage";

	var timer=0;
	var eventDown=document.createElement("command");
	eventDown.className="down";
	eventDown.onmouseover=function(){this.textContent="▼";};
	eventDown.onmouseout=function(){this.textContent="";clearTimeout(timer);};
	eventDown.onmousedown=function(){
		main.nextAction();
		timer=setTimeout(function(){eventDown.onmousedown();},800);
		this.classList.add("Active");
	};
	eventDown.onmouseup=function(){
		clearTimeout(timer);
		this.classList.remove("Active");
	};

	var eventUp=document.createElement("command");
	eventUp.className="up";
	eventUp.onmouseover=function(){this.textContent="▲";};
	eventUp.onmouseout=function(){this.textContent="";clearTimeout(timer);};
	eventUp.onmousedown=function(){
		main.previousAction();
		timer=setTimeout(function(){eventUp.onmousedown();},800);
		this.classList.add("Active");
	};
	eventUp.onmouseup=function(){
		clearTimeout(timer);
		this.classList.remove("Active");
	};

	var eventLeft=document.createElement("command");
	eventLeft.className="left";
	eventLeft.onmouseover=function(){this.textContent="◀";};
	eventLeft.onmouseout=function(){this.textContent="";clearTimeout(timer);};
	eventLeft.onmousedown=function(){
		main.previousSection();
		timer=setTimeout(function(){eventLeft.onmousedown();},800);
		this.classList.add("Active");
	};
	eventLeft.onmouseup=function(){
		clearTimeout(timer);
		this.classList.remove("Active");
	};

	var eventRight=document.createElement("command");
	eventRight.className="right";
	eventRight.onmouseover=function(){this.textContent="▶";};
	eventRight.onmouseout=function(){this.textContent="";clearTimeout(timer);};
	eventRight.onmousedown=function(){
		main.nextSection();
		timer=setTimeout(function(){eventRight.onmousedown();},800);
		this.classList.add("Active");
	};
	eventRight.onmouseup=function(){
		clearTimeout(timer);
		this.classList.remove("Active");
	};


	var createActions=(function(){
		var alternate=true;
		return function(action,sct,act,oldDate){
			function goto(){
				main.goto(sct,act);
			}
			var section=document.createElement("section"),
				titre=document.createElement("header"),
				date=document.createElement("time"),
				comment=document.createElement("article"),
				image=document.createElement("img");
			section.id="action_"+sct+"_"+act;
			section.onclick=goto;
			titre.textContent=action.titre;
			date.datetime=action.date;
			date.textContent=formatDate(action.date,oldDate);
			image.src=action.photo;
			image.className=alternate?"aGauche":"aDroite";
			image.onmouseover=function(){zoomImage.src=this.src;zoomImage.style.display="block";};
			image.onmouseout=function(){zoomImage.style.display="none";};
			image.onclick=function(){if(this.parentNode.className==="current"){main.changeMode("Image");}};
			comment.innerHTML=action.comment.replace(/[&<>]/g,function(motif){return "&#"+motif.charCodeAt(0)+";";}).replace(/\r\n|\n\r|\n|\r/g,"<br>");

			alternate=!alternate;

			section.appendChild(image);
			section.appendChild(titre);
			section.appendChild(date);
			section.appendChild(comment);

			carte.addMarker({type:action.metaType,lattitude:action.px,longitude:action.py,onclick:goto});
			return section;
		};
	})();

	zoneAction.appendChild(document.createElement("br"));//pour éviter d'être dans la zone de dégradé
	var i=0,li=main.liste.length,sct,act,j,lj,tmpDate=null;
	while(i<li){
		sct=main.liste[i];
		j=0,lj=sct.actions.length;
		tmpDate=sct.date;
		carte.addPath({color:sct.color,points:sct.parcours,width:3,opacity:0.6,editable:false});
		while(j<lj){
			zoneAction.appendChild(createActions(sct.actions[j],i,j,tmpDate));
			tmpDate=sct.actions[j++].date;
		}
		i++;
	}

	affichage.appendChild(zoneMap);
	affichage.appendChild(zoneSection);
	affichage.appendChild(zoneAction);
	affichage.appendChild(eventDown);
	affichage.appendChild(eventUp);
	affichage.appendChild(eventLeft);
	affichage.appendChild(eventRight);
	affichage.appendChild(zoomImage);

	var currentAction=document.getElementById("action_"+main.current.section+"_"+main.current.action);
	currentAction.className="current";

	setTimeout(function(){
		carte.refresh();
		carte.fit();
		main.update(false);
	},10);

	var move_to=(function(){
		//permet de gérer un mouvement de translation
		var target=0,
			desc=zoneAction,
			timer=0;
		function mv_target(){
			var y=target,
				sct=desc.scrollTop,
				dy=Math.max(100,Math.round(Math.abs(sct-y)/10));
			if(y>sct){
				if(y-sct<dy){
					dy=y;
				}else{
					dy+=sct;
				}
			}else{
				if(sct-y<dy){
					dy=y;
				}else{
					dy=sct-dy;
				}
			}
			desc.scrollTop=dy;
			if(dy!==y && desc.scrollTop===dy){
				timer=setTimeout(mv_target,47);
			}
		}
		return function mv_to(y){
			clearTimeout(timer);
			target=y;
			mv_target();
		}
	})();

	main.update=function dspDeltaCarte(noMove){
		var section=main.liste[main.current.section],
			action=section.actions[main.current.action];
		titreSection.textContent=section.titre;
		dateSection.datetime=section.date;
		dateSection.textContent=formatDate(section.date);

		currentAction.className="";	currentAction=document.getElementById("action_"+main.current.section+"_"+main.current.action);
		if(!noMove) currentAction.className="current";
		//currentAction.scrollIntoView();
		move_to(currentAction.offsetTop-40);

		if(!noMove) carte.center=[action.px,action.py,action.pa];
	};
	zoneMap.style.position="absolute";
	/*zoneMap.style.background="FF0000";
	carte.element.style.position="absolute";*/
	carte.fit();
	main.update(true);
}



function dspImage(affichage){
	//permet de créer l'affichage pour le mode Image
	var zoneMap=document.createElement("div");
	zoneMap.className="zoneMap";
	//zoneMap.style.width=main.separatorV;

	var carte=new Map(zoneMap,{walker:true,onclick:function(){main.changeMode("Carte");}});


	var zoneSection=document.createElement("div");
	zoneSection.className="zoneSection";
	/*zoneSection.style.width=main.separatorV;
	zoneSection.style.height=main.separatorH;*/

	var titreSection=document.createElement("header");
	zoneSection.appendChild(titreSection);
	var dateSection=document.createElement("time");
	zoneSection.appendChild(dateSection);


	var zoneAction=document.createElement("div");
	zoneAction.className="zoneAction";
	/*zoneAction.style.width=main.separatorV;
	zoneAction.style.top=main.separatorH;*/

	var titreAction=document.createElement("header");
	zoneAction.appendChild(titreAction);
	var dateAction=document.createElement("time");
	zoneAction.appendChild(dateAction);
	var commentAction=document.createElement("article");
	zoneAction.appendChild(commentAction);

	var zoneImage=document.createElement("div");
	zoneImage.className="zoneImage";
	var zoomImage=document.createElement("img");
	zoomImage.className="zoomImage";
	zoneImage.appendChild(zoomImage);

	var timer=0;
	var eventDown=document.createElement("command");
	eventDown.className="down";
	eventDown.onmouseover=function(){this.textContent="▶";};
	eventDown.onmouseout=function(){this.textContent="";clearTimeout(timer);};
	eventDown.onmousedown=function(){
		main.nextAction();
		timer=setTimeout(function(){eventDown.onmousedown();},800);
		this.classList.add("Active");
	};
	eventDown.onmouseup=function(){
		clearTimeout(timer);
		this.classList.remove("Active");
	};

	var eventUp=document.createElement("command");
	eventUp.className="up";
	eventUp.onmouseover=function(){this.textContent="◀";};
	eventUp.onmouseout=function(){this.textContent="";clearTimeout(timer);};
	eventUp.onmousedown=function(){
		main.previousAction();
		timer=setTimeout(function(){eventUp.onmousedown();},800);
		this.classList.add("Active");
	};
	eventUp.onmouseup=function(){
		clearTimeout(timer);
		this.classList.remove("Active");
	};

	var eventLeft=document.createElement("command");
	eventLeft.className="left";
	eventLeft.onmouseover=function(){this.textContent="◀";};
	eventLeft.onmouseout=function(){this.textContent="";clearTimeout(timer);};
	eventLeft.onmousedown=function(){
		main.previousSection();
		timer=setTimeout(function(){eventLeft.onmousedown();},800);
		this.classList.add("Active");
	};
	eventLeft.onmouseup=function(){
		clearTimeout(timer);
		this.classList.remove("Active");
	};

	var eventRight=document.createElement("command");
	eventRight.className="right";
	eventRight.onmouseover=function(){this.textContent="▶";};
	eventRight.onmouseout=function(){this.textContent="";clearTimeout(timer);};
	eventRight.onmousedown=function(){
		main.nextSection();
		timer=setTimeout(function(){eventRight.onmousedown();},800);
		this.classList.add("Active");
	};
	eventRight.onmouseup=function(){
		clearTimeout(timer);
		this.classList.remove("Active");
	};

	var i=0,li=main.liste.length,sct,act,j,lj;
	while(i<li){
		sct=main.liste[i];
		j=0,lj=sct.actions.length;
		carte.addPath({color:sct.color,points:sct.parcours,width:3,opacity:0.6,editable:false});
		while(j<lj){
			act=sct.actions[j];
			carte.addMarker({type:act.metaType,lattitude:act.px,longitude:act.py,onclick:(function(i,j){return function(){main.goto(i,j);};})(i,j)});
			j++;
		}
		i++;
	}

	affichage.appendChild(zoneMap);
	affichage.appendChild(zoneSection);
	affichage.appendChild(zoneAction);
	affichage.appendChild(zoneImage);
	affichage.appendChild(eventDown);
	affichage.appendChild(eventUp);
	affichage.appendChild(eventLeft);
	affichage.appendChild(eventRight);



	setTimeout(function(){
		carte.refresh();
		carte.fit();
	},10);

	main.update=function dspDeltaImage(noMove){
		var section=main.liste[main.current.section],
			action=section.actions[main.current.action];
		titreSection.textContent=section.titre;
		dateSection.datetime=section.date;
		dateSection.textContent=formatDate(section.date);

		titreAction.textContent=action.titre;
		dateAction.textContent=formatDate(action.date,section.date);
		dateAction.datetime=action.date;
		commentAction.textContent=action.comment;
		zoomImage.src=action.photo;
		zoneAction.scrollTop=0;

		if(!noMove) carte.center=[action.px,action.py,action.pa];
	};
	carte.fit();
	main.update(true);
}

function formatDate(dateAction,dateSection){
	var txt="",date=new Date(),heure=false;
		afficheJour=["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],
		afficheMois=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
	var tmp=(/(\d\d\d\d)-(\d\d)-(\d\d)(?:[ T](\d\d):(\d\d))?/).exec(dateAction);
	if(tmp){
		date=new Date();
		date.setFullYear(tmp[1],tmp[2]-1,tmp[3]);
		if(tmp[4]){
			heure=true;
			date.setHours(tmp[4],tmp[5]);
		}
	}else{
		//format non reconnu...
		return dateAction;
	}

	if(dateSection){
		var refDate=new Date();
		tmp=(/(\d\d\d\d)-(\d\d)-(\d\d)(?:[ T](\d\d):(\d\d))?/).exec(dateSection);
		if(tmp){
			refDate=new Date();
			refDate.setFullYear(tmp[1],tmp[2]-1,tmp[3]);
			if(tmp[4]) refDate.setHours(tmp[4],tmp[5]);

			if((tmp=date.getMinutes())<10) tmp="0"+tmp;
			if(date.getFullYear()!==refDate.getFullYear()){
				txt=afficheJour[date.getDay()]+" "+date.getDate()+" "+afficheMois[date.getMonth()]+" "+date.getFullYear();
				if(heure){
					txt+=" ("+date.getHours()+"h "+tmp+")";
				}
			}else if(!heure || date.getMonth()!==refDate.getMonth() || date.getDate()!==refDate.getDate()){
				txt=afficheJour[date.getDay()]+" "+date.getDate()+" "+afficheMois[date.getMonth()];
				if(heure){
					txt+=" ("+date.getHours()+"h "+tmp+")";
				}
			}else{
				txt=date.getHours()+"h "+tmp;
			}
			return txt;
		}else{
			//format non reconnu...
			dateSection=null;
		}
	}

	txt=afficheJour[date.getDay()]+" "+date.getDate()+" "+afficheMois[date.getMonth()]+" "+date.getFullYear();
	if(heure){
		if((tmp=date.getMinutes())<10) tmp="0"+tmp;
		txt+=" ("+date.getHours()+"h "+tmp+")";
	}
	return txt;
}

function dspLoader(affichage){
	affichage.textContent="Aucune donnée n'a été chargée";
	affichage.appendChild(document.createElement("br"));
	var input=document.createElement("input");
	input.type="url";
	input.id="dataToLoad";
	input.value="./";
	input.placeholder="url de la description";
	input.onchange=loadData;
	input.onblur=function(){
		if(this.value.substr(0,7)==="http://" && (this.value.substr(7,1)==="." ||this.value.substr(7,1)==="/")) this.value=this.value.substr(7);
	};
}

function loadData(){
	//permet de gérer le chargement des donnnées

	function parser(key,value){
		if(value && typeof value === "object"){
			if(value instanceof Array || value.type== "action" || value.type== "section"||value.type== "body"){
				return value;
			}else{
				return;
			}
		}
		return value;
	}

	var url=document.location.search.match(/data=(.*?)(?=&|$)/);
	if(url && url[1]){
		var json=JSON.parse(decodeURIComponent(url[1]),parser);
		if(json){
			main.loader(json);
		}
		url=null;
	}else{
		url=document.getElementById("dataToLoad").value;
	}
	if(url){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4){
				if(xhr.status === 200 || xhr.status === 0 ) {
					var json=JSON.parse(xhr.responseText,parser);
					if(json){
						main.loader(json);
					}
				}else{
					//une erreur est survenue
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);
	}
}

document.onkeydown=function(event){
	var code=event.keyCode;
	switch(code){
		case 38: //up
		case 37: //left
			main.previousAction();
			break;
		case 40: //down
		case 39: //left
			main.nextAction();
			break;
		case 33: //page up
			main.previousSection();
			break;
		case 34: //page down
			main.nextSection();
			break;
		case 36: //home
			main.goto(0,0);
			break;
		case 35: //end
			main.goto(Infinity,Infinity);
			break;
	}
};
