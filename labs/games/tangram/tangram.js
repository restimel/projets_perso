var debug=false;
/*
	Shadow correspond aux figures que l'utilisateur doit reproduire (les ombres à reproduire)
*/
function Shadow(points,tag,rate){
	var minX=Infinity,minY=Infinity,maxX=0,maxY=0;
	points=points.split("|");
	var i=0,li=points.length,
		j,lj;
	while(i<li){
		points[i]=points[i].split(";");
		j=0,lj=points[i].length;
		while(j<lj){
			points[i][j]=points[i][j].split(",");
			minX=Math.min(minX,points[i][j][0]);
			minY=Math.min(minY,points[i][j][1]);
			j++;
		}
		i++;
	}
	i=0;
	while(i<li){
		j=0,lj=points[i].length;
		while(j<lj){
			points[i][j][0]-=minX;
			points[i][j][1]-=minY;
			maxX=Math.max(maxX,points[i][j][0]);
			maxY=Math.max(maxY,points[i][j][1]);
			j++;
		}
		i++;
	}
	this.points=points; //coordonnées
	this.minX=0;
	this.minY=0;
	this.maxX=maxX;
	this.maxY=maxY;
	this.tag=tag; //liste de tag désignant la figure
	this.rateMatching=rate; // taux de correspondance pour considérer la figure comme correcte (nombre entre 0 et 1)
	this.done=false; //Indique si cette figure a déjà été réalisée avec succés
}

/*
permet de connaitre les mouvements à réaliser pour le placer en fonction des Tans
	Tans: liste des Tans (sauf si y est défini alors Tans vaut x)
	y: coordonée y de la position de référence
*/
Shadow.prototype.where=function(Tans,y){
	if(typeof y === "undefined"){
		var i=0,li=Tans.length,
			minX=Infinity,minY=Infinity;
		while(i<li){
			minX=Math.min(minX,Tans[i].minX);
			minY=Math.min(minY,Tans[i++].minY);
		}
		return [minX-this.minX,minY-this.minY];
	}else{
		return [Tans-this.minX,y-this.mniY];
	}
};

/*
permet de connaitre le multiplicateur à appliquer pour que l'ombre entre dans les dimensions décrites
	sx: taille X alloué
	sy: taille y alloué
*/
Shadow.prototype.size=function(sx,sy){
	return Math.min(sx/(this.maxX-this.minX),sy/(this.maxY-this.minY));
};

/*
permet de dessiner la pièce
	ctx: context de dessin
	flStyle: couleur du fill (si aucun pas de fill)
	stkStyle: couleur du stroke (si aucun pas de stroke)
	translate: déplacement à effectuer (Array [x,y]) correspond à la position d'affichage
	scale: échelle de la figure (Number) homotétie à réaliser
	hideBorder: essaie de mieux cacher les espaces entre les pièces (boolean) true → grossit les traits
*/
Shadow.prototype.draw=function(ctx,flStyle,stkStyle,translate,scale,hideBorder){
	if(!(translate instanceof Array) || translate.length!==2){
		translate=[0,0]
	}
	if(typeof scale !== "number"){
		scale=1;
	}
	ctx.save();
	ctx.lineWidth = hideBorder?9:5;
	flStyle && (ctx.fillStyle = flStyle);
	stkStyle && (ctx.strokeStyle = stkStyle);
	ctx.translate(translate[0],translate[1]);
	ctx.scale(scale,scale);
	var i=0,li=this.points.length,
	j,lj;
	while(i<li){
		points=this.points[i++];
		j=0,lj=points.length;
		ctx.beginPath();
		ctx.moveTo(points[j][0],points[j][1]);
		while(++j<lj){
			ctx.lineTo(points[j][0],points[j][1]);
		}
		ctx.lineTo(points[0][0],points[0][1]);
		stkStyle && ctx.stroke();
		flStyle && ctx.fill();
	}
	ctx.restore();
};

// -----------------------------------------------------

/*
	Piece correspond à un Tan qui est manipulé par l'utilisateur
*/
function Piece(points,flStyle,stkStyle){
	this.points=points;
	this.colorStroke=stkStyle||"rgb(0,0,0)";
	this.colorFill=flStyle||"rgba(200,0,0,0.8)";
	this.lastX=0;
	this.lastY=0;
	this.Ox=0;
	this.Oy=0;
	this.minX=0;
	this.minY=0;
	//this.ref=reference;
	//this.defineZone(reference.zone);
}


// Permet de donner une chaine de caractères correspondant à la position du Tans (une liste des coordonées des extrémités)
Piece.prototype.toString=function(){
	var txt="",
		i=0,
		li=this.points.length;
	while(i<li){
		if(i) txt+=";";
		txt+=Math.round(this.points[i][0])+","+Math.round(this.points[i++][1]);
	}
	return txt;
};

//permet de calculer grossièrement la zone où se trouve la pièce
Piece.prototype.defineZone=function(){
	var minX=Infinity,minY=Infinity,maxX=0,maxY=0,
		ox=0,oy=0, //pour calculer le centre
		i=0,li=this.points.length;
	while(i<li){
		minX=Math.min(minX,this.points[i][0]);
		maxX=Math.max(maxX,this.points[i][0]);
		minY=Math.min(minY,this.points[i][1]);
		maxY=Math.max(maxY,this.points[i][1]);
		ox+=this.points[i][0];
		oy+=this.points[i][1];
		i++;
	}
	this.Ox=ox/li;
	this.Oy=oy/li;
	this.minX=minX;
	this.minY=minY;
	return [minX,minY,maxX,maxY,this];
}

//vérifie que le curseur est au-dessus de la pièce
Piece.prototype.isInside=function(x,y){
	var points=this.points,
		i=0,li=points.length-2;

	while(i<li){
		if(!sameSide(points[i][0],points[i][1],points[i+1][0],points[i+1][1],points[i+2][0],points[i+2][1],x,y)){
			return false;
		}
		i++;
	}
	if(!sameSide(points[i][0],points[i][1],points[i+1][0],points[i+1][1],points[0][0],points[0][1],x,y)){
		return false;
	}
	if(!sameSide(points[++i][0],points[i][1],points[0][0],points[0][1],points[1][0],points[1][1],x,y)){
		return false;
	}
	return true;
};

/*determine l'action en fonction de la zone de présence sur la pièce
	retour
		1: move
		2: round
		3: flip
*/
Piece.prototype.getAction=function(x,y){
	var points=this.points,
	i=0,li=points.length;

	while(i<li){
		if(Math.abs(points[i][0]-x)<20 && Math.abs(points[i][1]-y)<20){
			return 2;
		}
		i++;
	}
	return 1;
};

//action effectuée lorsque le curseur est au-dessus de cette pièce
Piece.prototype.mouseMove=function(x,y,element,action,listeTans){
	switch(action){
		case 0:
			if(this.isInside(x,y)){
				switch(this.getAction(x,y)){
					case 1:
						element.style.cursor="move";
						break;
					case 2:
						element.style.cursor="pointer";
						break;
					case 3:
						element.style.cursor="ns-resize";
						break;
				}
				return true;
			}
			return false;
			break;
		case 1: //move
			return this.move(x,y,listeTans);
			break;
		case 2: //rotate
			return this.rotate(x,y,listeTans);
			break;
		case 3: //flip
			return this.flip(x,y,listeTans);
			break;
	}
};

//verifie les collisions
Piece.prototype.isOnContact=function(points,listeTans,Ox,Oy){
	var i=-1,li=listeTans.length,
		j,lj,pts;
	listeDesTans:while(++i<li){
		if(listeTans[i]===this){
			continue;
		}
		pts=listeTans[i].points,j=0,lj=points.length-1;
		while(j<lj){ //parcourt les droites de la nouvelle position
			if(areSameSide(points[j][0],points[j][1],points[j+1][0],points[j+1][1],pts,Ox,Oy)){
				continue listeDesTans;
			}
			j++;
		}
		if(areSameSide(points[j][0],points[j][1],points[0][0],points[0][1],pts,Ox,Oy)){
			continue listeDesTans;
		}


		j=0,lj=pts.length-1;
		while(j<lj){ //parcourt les droites du Tans
			if(areSameSide(pts[j][0],pts[j][1],pts[j+1][0],pts[j+1][1],points,listeTans[i].Ox,listeTans[i].Oy)){
				continue listeDesTans;
			}
			j++;
		}
		if(areSameSide(pts[j][0],pts[j][1],pts[0][0],pts[0][1],points,listeTans[i].Ox,listeTans[i].Oy)){
			continue listeDesTans;
		}

		//aucune position où l'autre figure est située de l'autre côté du barycentre (par rapport aux bords) n'a été trouvée => il y a collision
		return true;
	}

	return false;
};

/**
	permet de déplacer la pièce
		x: coordonnée x de la souris permettant de calculer la nouvelle position de la pièce
		y: coordonnée y de la souris permettant de calculer la nouvelle position de la pièce
		listeTans: liste de tous les Tans (ou obstacle au déplacement) si la pièce rencontre une autre pièce le déplacement est annulé
*/
Piece.prototype.move=function(x,y,listeTans){
	var points=this.points,
		npoints=[],
		i=0,li=points.length,
		dx=x-this.lastX,
		dy=y-this.lastY,
		Ox=0,
		Oy=0;
	while(i<li){
		npoints[i]=[points[i][0]+dx,points[i][1]+dy];
		Ox+=npoints[i][0];
		Oy+=npoints[i++][1];
	}
	Ox/=li;
	Oy/=li;
	if(listeTans){
		if(this.isOnContact(npoints,listeTans,Ox,Oy)){
			return false;
		}
	}
	this.points=npoints;
	this.Ox=Ox;
	this.Oy=Oy;
	this.lastX=x;
	this.lastY=y;
	return true;
};

/**
	permet de déplacer la pièce
		x: coordonnée x de la souris permettant de calculer la rotation à effectuer
		y: coordonnée y de la souris permettant de calculer la rotation à effectuer
		unlimitedAngle: indique si les angles doivent être un multiplie de 64 ou non {true → unlimited}
*/
Piece.prototype.rotate=function(x,y,unlimitedAngle){
	var points=this.points,
		i=0,li=points.length,
		a2=(x-this.lastX)*(x-this.lastX)+(y-this.lastY)*(y-this.lastY),
		b2=(this.Ox-this.lastX)*(this.Ox-this.lastX)+(this.Oy-this.lastY)*(this.Oy-this.lastY),
		c2=(this.Ox-x)*(this.Ox-x)+(this.Oy-y)*(this.Oy-y),
		alpha=Math.acos( (b2+c2-a2)/(2*Math.sqrt(b2*c2)) ),
		x2,y2,
		//angle=unlimitedAngle?0:0.19634954084936207;//Math.PI/16:0;
		angle=unlimitedAngle?0:0.09817477042468103;//Math.PI/32:0;

	if((x-this.lastX)*(x-this.lastX)>(y-this.lastY)*(y-this.lastY)){
		if( ((x>this.lastX)&&(y>this.Oy)) || ((x<this.lastX)&&(y<this.Oy)) ){
			alpha=-alpha;
		}
	}else{
		if( ((y>this.lastY)&&(x<this.Ox)) || ((y<this.lastY)&&(x>this.Ox)) ){
			alpha=-alpha;
		}
	}
	if(angle){
		alpha=Math.round(alpha/angle)*angle;
	}
	//console.log("angle:"+angle+"\nAlpha:"+alpha);

	if(!alpha) return false;
	while(i<li){
		x2=(points[i][0]-this.Ox)*Math.cos(alpha)-(points[i][1]-this.Oy)*Math.sin(alpha)+this.Ox;
		y2=(points[i][0]-this.Ox)*Math.sin(alpha)+(points[i][1]-this.Oy)*Math.cos(alpha)+this.Oy;
		points[i++]=[x2,y2];
	}
	if(angle){
		x=this.lastX;
		y=this.lastY;
		this.lastX=(x-this.Ox)*Math.cos(alpha)-(y-this.Oy)*Math.sin(alpha)+this.Ox;
		this.lastY=(x-this.Ox)*Math.sin(alpha)+(y-this.Oy)*Math.cos(alpha)+this.Oy;
	}else{
		this.lastX=x;
		this.lastY=y;
	}
	return true;
};

//permet de retourner la pièce
Piece.prototype.flip=function(x,y){
	var points=this.points,
		i=0,li=points.length,
		c=this.Oy;

	while(i<li){
		points[i][1]=c+c-points[i][1];
		i++;
	}
	return true;
};

//permet d'initialiser les variables utiles pour les actions
Piece.prototype.initAction=function(x,y){
	this.lastX=x;
	this.lastY=y;
};

/*
	permet de dessiner la pièce
		ctx: context de dessiner
		flStyle: fillStyle à appliquer
		stkStyle: strokeStyle à appliquer
*/
Piece.prototype.draw=function(ctx,flStyle,stkStyle){
	ctx.fillStyle = flStyle||this.colorFill;
	ctx.strokeStyle = stkStyle||this.colorStroke;
	var i=0,li=this.points.length;
	ctx.beginPath();
	ctx.moveTo(this.points[i][0],this.points[i++][1]);
	while(i<li){
		ctx.lineTo(this.points[i][0],this.points[i++][1]);
	}
	ctx.lineTo(this.points[0][0],this.points[0][1]);
	if(ctx.strokeStyle && stkStyle!=="none") ctx.stroke();
	if(ctx.fillStyle && flStyle!=="none") ctx.fill();
};


// -----------------------------------------------------

//permet de vérifier que les points (xc,yc) et (xd,yd) sont du même côté par rapport à la droite (xa,ya)/(xb,yb)
function sameSide(xa,ya,xb,yb,xc,yc,xd,yd){
	var a=(yb-ya)/(xb-xa);
	return (a*(xc-xa)+ya>yc)==(a*(xd-xa)+ya>yd);
}

/*
	permet de vérifier que la liste de points liste sont tous du même côté par rapport à la droite (xa,ya)/(xb,yb)
	à l'exception du point Ex,Ey
*/
function areSameSide(xa,ya,xb,yb,liste,Ex,Ey){
	var a=(yb-ya)/(xb-xa),
		side=(a*(liste[0][0]-xa)+ya>liste[0][1]),
		i=1,li=liste.length;

	if((Ex || Ey) && side===(a*(Ex-xa)+ya>Ey)) return false; //Exception

	while(i<li){
		if(side!==(a*(liste[i][0]-xa)+ya>liste[i][1])) return false;
		i++;
	}
	return true;
}

//permet de redéfinir la fonction event.offsetX
if(typeof(offset_X)==="undefined"){
	function offset_X(event){
		if(event.offsetX) return event.offsetX;
		var el = event.target, ox = -el.offsetLeft;
		while(el=el.offsetParent){
			ox += el.scrollLeft - el.offsetLeft;
		}
		if(window.scrollX){
			ox += window.scrollX;
		}
		return event.clientX + ox;
	}
}

//permet de redéfinir la fonction event.offsetY
if(typeof(offset_Y)==="undefined"){
	function offset_Y(event){
		if(event.offsetY) return event.offsetY;
		var el = event.target, oy = -el.offsetTop;
		while(el=el.offsetParent){
			oy += el.scrollTop - el.offsetTop;
		}
		if(window.scrollY){
			oy += window.scrollY;
		}
		return event.clientY + oy;
	}
}

// -----------------------------------------------------

function Canvas(){
	var element = document.getElementById("cnvas");
	/*element.width=window.innerWidth;
	element.height=window.innerHeight;*/
	/*function search(){
		var parent=element.parentNode;
		do{
			console.debug(parent+" -> innerWidth: "+parent.Width+", scrollWidth: "+parent.scrollWidth+", clientWidth: "+parent.clientWidth+", offsetWidth: "+parent.offsetWidth);
		}while(parent=parent.parentNode);
		console.log(window.innerWidth);
	}*/
	element.width=element.parentNode.offsetWidth; //pour le cas où le code est embarqué dans une autre page
	element.height=window.innerHeight;
	//search();
	if (element.getContext) {
		var ctx = element.getContext("2d");
		ctx.lineWidth = 3.5;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		var zone=[];//[x1,y1,x2,y2,objet],...

		//var reference={zone:zone};
		var action=0; //action en cours (0: pas d'action, 1: action en cours sur une pièce)
		var pieceActive=null;

		var Tans=[
			new Piece([[200,200],[400,200],[200,400]],"rgba(0,200,0,0.8)"),
			new Piece([[200,0],[400,0],[200,200]],"rgba(0,200,200,0.8)"),
			new Piece([[0,0],[100,100],[0,200]],"rgba(0,0,200,0.8)"),
			new Piece([[100,200],[200,200],[200,300],[100,300]],"rgba(200,200,0,0.8)"),
			new Piece([[350,100],[450,100],[550,200],[450,200]],"rgba(200,0,200,0.8)"),
			new Piece([[0,200],[100,200],[0,300]],"rgba(150,150,150,0.8)"),
			new Piece([[100,100],[200,100],[100,200]],"rgba(200,0,0,0.8)")
		];

		var liste_target=[
			new Shadow("793,218;993,218;793,18|793,219;993,219;793,419|692,320;592,220;692,120|693,119;793,119;793,219;693,219|792,420;792,320;692,220;692,320|793,220;793,320;693,220|793,118;693,118;793,18","carre figure convexe basique",0.944),
			new Shadow("512,210;653,352;370,352|226,210;84,352;367,352|227,210;368,210;368,69|370,210;441,281;512,210;441,139|227,211;298,281;439,281;368,211|440,139;370,210;370,69|368,352;298,282;439,282","triangle figure convexe basique",0.944),
			new Shadow("202,403;2,403;202,603|3,200;3,0;203,200|2,202;102,302;202,202|103,302;203,302;203,402;103,402|2,202;2,302;102,402;102,302|2,403;2,303;102,403|204,301;104,301;204,201","trapeze figure convexe basique",0.944),
			new Shadow("620,403;820,403;620,203|417,402;417,202;217,402|418,202;518,302;418,402|519,303;619,303;619,403;519,403|418,202;518,202;618,302;518,302|518,403;518,303;418,403|619,202;519,202;619,302,0","figure convexe",0.944),
			new Shadow("306,324;165,465;165,182|22,325;164,183;164,466|22,324;22,183;164,183|236,111;307,182;236,253;165,182|23,182;94,112;235,112;164,182|236,253;307,183;307,324|165,40;236,111;95,111","figure convexe basique",0.944),
			new Shadow("222,313;22,313;222,113|242.85,311.55;223.25,112.50;441.90,291.94|333,202;223,112;313,3|137,314;237,314;237,414;137,414|238,414;338,414;438,314;338,314|136.66,314;136.66,414;36.66,314|238,314;338,314;238,414","bateau voilier",0.932),
			new Shadow("259.5,205.25;132.6,360;104.9,78.5|259.4,206.8;414,333.7;132.5,361.4|259.5,205.25;150,115.5;240,6.2|11,261;111,261;111,361;11,361|135,432.35;205.25,361.6;347,361.6;276.35,432.35|135,432.35;63.6,361;205.25,361|111.66,260.66;11.66,260.66;111.66,160.66","bateau voilier",0.931),
			new Shadow("80,200;60,1;279,180|304,200;284,1;503,180|303,200;203,300;103,200|304,200;404,200;404,300;304,300|3,200;103,200;203,300;103,300|405,200;505,200;405,300|304,300;304,200;204,300","bateau voilier",0.92),
			new Shadow("631,445;773,303;773,586|772,588;631,729;631,446|601,758;701,658;801,758|701,231;772,302;701,373;630,302|701,231;748,143;707,7;660,95|702,658;773,588;773,729|701,373;631,444;631,303","objet bougie",0.92),
			new Shadow("1019,267;942,451;834,190|649,267;833,190;725,451|757,375;888,321;834,190|564,193;656,155;694,247;602,285|1019,267;1057,174;1003,43;965,136|655,154;562,193;617,62|657,154;749,116;695,247","animal chat",0.92),
			new Shadow("553,443;553,243;753,443|553,444;753,444;553,644|512,283;512,142;654,142|624,172;695,243;624,314;553,243|591,706;591,606;691,506;691,606|662,636;733,707;592,707|482,638;553,709;553,568","homme chinois",0.925)
		]
		//var target=new Shadow("50,50;250,50;250,250;50,250");
		var target=null;//liste_target[Math.floor(Math.random()*liste_target.length)];

		/*
			zone_target correspond à la zone où est affiché l'ombre à reproduire
		*/
		var zone_target={
			taille:100,
			x:element.width-100,
			y:0,
			actif:false,//permet de dire si on est en mode selection (l'utilisateur choisit son nouveau motif)
			defineZone:function(){ //permet de donner les coordonées grossière de la zone
				if(this.actif) return [this.x-this.taille*liste_target.length/2,this.y,this.x+this.taille,this.y+this.taille,this];
				else return [this.x,this.y,this.x+this.taille,this.y+this.taille,this];
			},
			isInside:function(x,y){//permet de dire si le curseur est dans la zone
				/*if(this.actif) return x>=this.x-this.taille*(liste_target.length+1)/2 && x<=this.x+this.taille && y>=this.y && y<=this.y+this.taille;
				else return x>=this.x && x<=this.x+this.taille && y>=this.y && y<=this.y+this.taille;*/
				return	(x>=this.x && x<=this.x+this.taille && y>=this.y && y<=this.y+this.taille) ||
						( this.actif && x>=this.x-this.taille*liste_target.length/2 && x<=this.x && y>=this.y && y<=this.y+this.taille/2);

			},
			draw:function(ctx,soluce){ //permet de dessiner la zone | soluce: true → permet de voir les bords des Tans
				if(soluce){
					//on est en mode soluce
					target.draw(ctx,"#880022","#FFFF00",[this.x+5,5],target.size(this.taille-10,this.taille-10));
				}else if(this.actif){
					//on est en mode de sélection de figure, il faut donc afficher toutes les figures
					ctx.save();
					ctx.strokeStyle = "#333333";
					ctx.lineWidth = 1.5;
					ctx.strokeRect(this.x,this.y,this.taille,this.taille);
					ctx.restore();
					target.draw(ctx,"#333333","#333333",[this.x+5,5],target.size(this.taille-10,this.taille-10),true);

					//on parcourt la liste des figures
					var li=liste_target.length,x,cl,tg;
					while(li--){
						tg=liste_target[li];
						ctx.save();
						ctx.strokeStyle = "#333333";
						ctx.lineWidth = 1.5;
						x=this.x-(this.taille*(li+1)/2);
						ctx.strokeRect(x,this.y,this.taille/2,this.taille/2);
						ctx.restore();
						if(target==tg) cl="#0000CC";
						else if(tg.done) cl="#006600";
						else cl="#660000";
						tg.draw(ctx,cl,cl,[x+3,3],tg.size(this.taille/2-6,this.taille/2-6),true);
					}

				}else{
					//on est en mode visualisation de la figure à reproduire (une seule figure est à reproduire)
					ctx.save();
					ctx.strokeStyle = "#333333";
					ctx.lineWidth = 1.5;
					ctx.strokeRect(this.x,this.y,this.taille,this.taille);
					ctx.restore();
					target.draw(ctx,"#000000","#000000",[this.x+5,5],target.size(this.taille-10,this.taille-10),true);
				}
			},
			mouseMove:function(x,y,element,action){//permet de gérer les actions à réaliser lorsque le curseur survole la zone
				if(this.isInside(x,y)){
					element.style.cursor="pointer";
					return true;
				}else{
					return false;
				}
			},
			getAction:function(x,y){return 0;}, //permet d'assurer la compatibilité avec les objets Piece
			initAction:function(x,y){ //permet de gérer les actions à réaliser lorsqu'on clique sur la zone
				if(this.actif){
					this.actif=false;
					if(x<this.x){
						var li=liste_target.length;
						x-=this.x-this.taille*li/2;
						x=Math.ceil(x/(this.taille/2));
						init(li-x);//on met en place la figure choisie
					}//sinon on clique sur la figure actuelle => on ne selectionne pas de nouvelle figure
				}else{
					//on passe en mode selection
					this.actif=true;
				}
				return false;
			}
		};


	}else{
		alert("Your browser doesn't support the Canvas feature :(");
		return false;
	}

	/*
		permet de réinitialiser le contexte
			cible:	indique l'index de la prochaine figure à reproduire
					si undefined alors la prochaine cible est définie au hasard
	*/
	function init(cible){
		switch(typeof cible){
			case "number":
				cible=cible%liste_target.length;
				if(cible<0) cible=-cible;
				break;
			case "string": //TODO (recherche par mot clef)
			default:
				cible=Math.floor(Math.random()*liste_target.length); //si cible n'a pas été défini ou est d'un type bizarre alors on choisi au hasard
		}
		element.style.backgroundColor="#D5DDF0";
		element.style.backgroundImage="url('./marbreBleu.jpg')";
		target=liste_target[cible];
	}

	//fonction de dessin de tous les morceaux
	function draw(notClr,flStyle,stkStyle){
		var i=0,li=Tans.length;
		if(!notClr){
			//tout doit être effacé
			zone=[];
			ctx.clearRect(0,0,element.width,element.height);

			//zone représentant la figure à reproduire
			zone.push(zone_target.defineZone());
			zone_target.draw(ctx);

			//dessin de tous les Tans
			while(i<li){
				zone.push(Tans[i].defineZone());
				Tans[i++].draw(ctx,flStyle,stkStyle);
			}
		}else{
			//dessin de tous les Tans
			while(i<li){
				Tans[i++].draw(ctx,flStyle,stkStyle);
			}
		}
	}

	//vérifie la forme créée par rapport au modèle
	function verify(){
		var d1=Date.now();
		var position=target.where(Tans);

		ctx.clearRect(0,0,element.width,element.height);
		ctx.save();
		target.draw(ctx,"#000000",'',position);
		ctx.globalCompositeOperation = "xor";
		draw(true,"#FF0000","none");
		var x1=position[0]>0?position[0]:0,
			y1=position[1]>0?position[1]:0,
			x2=(position[0]+target.maxX)<element.width?target.maxX:element.width-position[0],
			y2=(position[1]+target.maxY)<element.height?target.maxY:element.height-position[1];
		var dt=ctx.getImageData(x1, y1, x2, y2).data;
		ctx.restore();
		draw();
		var i=3,li=dt.length,compteur=0,vide=0;
		while(i<li){
			if(dt[i]===0){
				vide++;
			}
			compteur++;
			i+=4;
		}
		if(vide/compteur>target.rateMatching){
			console.log("Bravo !!!"); //TODO message plus lisible
			element.style.background="rgba(125,250,125,0.6)";
			target.done=true;
		}
		if(debug) console.log(Date.now()-d1+"ms :"+(vide/compteur) );
//		console.log("remplissage: "+((1-vide/compteur)*100)+"%");

	}

	//action réalisée lorsque le curseur passe au dessus du canvas
	function mouseMove(event){
		var	x=offset_X(event),
			y=offset_Y(event);
		if(!action){ //si aucune action n'est en cours
			var i=zone.length;
			while(i--){
				if(x>=zone[i][0] && x<=zone[i][2] && y>=zone[i][1] && y<=zone[i][3]){ //analyse rapide de la position
					//if(Tans[i].mouseMove(x,y,element,action)){
					if(zone[i][4].mouseMove(x,y,element,action)){
						return true;
					}
				}
			}
			element.style.cursor="default";
		}else{
			//console.log("test"+action);
			if(pieceActive.mouseMove(x,y,element,action,event.ctrlKey?Tans:null)) draw();
		}
	}

	//action réalisée lorsqu'il y a un clique sur le canvas
	function mouseDown(event){
		var i=zone.length,
			x=offset_X(event),
			y=offset_Y(event);
		while(i--){
			if(x>=zone[i][0] && x<=zone[i][2] && y>=zone[i][1] && y<=zone[i][3]){
				if(zone[i][4].isInside(x,y)){
					//pieceActive=Tans[i];
					pieceActive=zone[i][4];
					action=pieceActive.getAction(x,y);
					pieceActive.initAction(x,y);
					break;
				}
			}
		}
		if(i<0){
			pieceActive=null;
		}
	}

	init();
	draw(false);
	element.onmousemove=mouseMove;
	element.onmousedown=mouseDown;
	element.onmouseup=function(){action=0;
		//pieceActive=null;
		verify();
	};
	element.ondblclick=function(event){
		if(pieceActive){if(pieceActive.mouseMove(offset_X(event),offset_Y(event),element,3)) draw();}
	};
	document.onkeydown=function(event){
		if(event.keyCode===68){ //d
			debug=!debug;
			console.log("mode debug: ",debug?"on":"false");
		}
		if(debug && event.keyCode===71){ //g
			console.log(Tans.join("|")); //permet de récupérer les coordonées d'une nouvelle figure
		}
		if(event.keyCode===83){ //s
			if(confirm("Are you sure you want to see the solution?")) zone_target.draw(ctx,true);
		}
		if(typeof help==="function"&&event.keyCode===72){ //h
			help();
		}
	}
}

var canvas;
/*window.onload=function(){
	Canvas();
};*/
Canvas();
