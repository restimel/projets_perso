/**
 * ChartPlots est une classe permettant de gérer l'affichage et l'intéractivité d'une courbe. Elle complète la classe Chart
 * 
 * needed : Chart (not required for execution)
 * 
 * Constructor:
 * 	new ChartPlots(plots,option);
 * 		plots [Array]: liste des points de la courbe. [[x,y],…]
 * 		option [object]:
 * 			-  color [string] : couleur de la courbe (default : "rgba(100,100,250,1)")
 * 			- mouseClick [function]: appelée lorsque l'utilisateur clique sur le graphe (à voir/sur le courbe)
 * 				f(ctx,x,y) : this fait référence au ChartPlots déclencheur | ctx=contexte de dessins secondaire | x=coordonée X du click dans le canvas | y=coordonée Y du click dans le canvas
 * 			- mouseMove [function]: appelée lorsque l'utilisateur se déplace sur le graphe
 * 				f(ctx,x,y) : this fait référence au ChartPlots déclencheur | ctx=contexte de dessins secondaire | x=coordonée X du click dans le canvas | y=coordonée Y du click dans le canvas
 * 
 * Méthodes:
 * 		- draw(plotInfo) : dessine la courbe (ctx: contexte de dessin, tx,ty: translation à effectuer avant de dessiner)
 * 		- draw2(plotInfo) : dessine les interactions avec la courbe (ctx: contexte de dessin, x,y: coordonées de l'interaction)
 * 		- click(ctx,x,y) : permet de gérer un click sur la courbe
 * 		- getBox(xMin,xMax,extended) : permet d'obtenir la zone contenant la courbe
 * 		- isOn(x,y,r) : indique si les coordonées x,y est proche de la courbe
 **/

 
/**
 * PlotInfo : objet contenant des informations sur le point
 * 
 * 		mx,my : coordonées du curseur sur le canvas
 * 		cx,cy : coordonées correspondant à la courbe
 *		ctx : contexte du canvas utilisé (pour dessiner)
 *		tx,ty : transformation à appliquer pour dessiner sur le canvas
 **/ 


function ChartPlots(plots,option){
	if(plots instanceof Array && plots.length && plots[0] instanceof Array){
		this.points = copyArray(plots);
	}else{
		return null;
	}
	option = option || {};
	this.color = option.color || "rgba(100,100,250,1)";
	
	this.mouseMove = option.mouseMove || null;
	this.mouseClick = option.mouseClick || null;
}

/**
 * dessine la courbe dans le contexte
 **/
ChartPlots.prototype.draw = function(plotInfo){
	var i,x,y,
		li = this.points.length,
		ctx = plotInfo.ctx,
		tx = plotInfo.tx,
		ty = plotInfo.ty;
	//courbe
	ctx.beginPath();
	ctx.moveTo(0, this.points[0][1]*ty);

	for(i=1;i<li;i++){
		x=this.points[i][0]*tx;
		y=this.points[i][1]*ty;
		ctx.lineTo(x, y);
	}
	
	ctx.save();
	ctx.lineCap = 'round';
	ctx.shadowOffsetX = 1;
	ctx.shadowOffsetY = 3;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 50, 0.6)";
  
	ctx.strokeStyle = this.color;
	ctx.lineWidth = 1.5;
	ctx.stroke();
	ctx.restore();
	
	this.tx = tx;
	this.ty = ty;
};

/**
 * permet de dessiner les interactions avec la courbe
 **/
ChartPlots.prototype.draw2 = function(plotInfo){
	var tx=this.tx,
		ty=this.ty,
		points = this.points,
		ctx = plotInfo.ctx,
		x = plotInfo.cx/tx,
		y = plotInfo.cy/ty;
	
	plotInfo.cx = x;
	plotInfo.cy = y;
	plotInfo.tx = tx;
	plotInfo.ty = ty;
	
	//  console.log("isOn(%s,%s) : %s",plotInfo.cx,plotInfo.cy,this.isOn(plotInfo.cx,plotInfo.cy,10));
	
	if(x>0){// && y<this.maxY
		//recherche de la position y
		//x = x/tx;
		
		var i=0,dst=0,li=points.length;
		while(i<li && dst<x){
			dst = points[i++][0];
		}
		if(x<dst && i>1){
			i--;
			a=(points[i-1][1]-points[i][1])/(points[i-1][0]-points[i][0]);
			b=points[i][1]-points[i][0]*a;
			y = x*a + b;
			
			ctx.save();
			ctx.translate(x*tx,y*ty);
			
			if(typeof this.mouseMove === "function"){
				if(this.mouseMove.call(this,ctx,x,y,plotInfo) === false){
					return false;
				}
			}
			
			//marqueur
			ctx.beginPath();
			ctx.fillStyle = "rgba(100,60,0,0.8)";
			ctx.arc(0, 0, 3.5, 0, 2 * Math.PI, false);
			ctx.fill();
			
			ctx.beginPath();
			ctx.strokeStyle = "rgba(0,0,0,0.3)";
			ctx.moveTo(-13,0);
			ctx.lineTo(13,0);
			ctx.stroke();
			
			
			ctx.restore();
			/*
			//label
			ctx.fillStyle = "rgba(100,0,0,1)";
			ctx.font='17px Helvetica';
			
			ctx.textAlign = "center";
			ctx.textBaseline = "bottom";
			ctx.fillText("distance: "+(Math.round(x*100)/100)+this.uniteX+"  hauteur:"+(Math.round(y*100)/100)+this.uniteY, this.width/2, this.height);
			*/
		}
    }
	
};

/**
 * gestion d'un click sur la courbe
 **/
ChartPlots.prototype.click = function(ctx,x,y){
	if(typeof this.mouseClick === "function"){
		if(this.mouseClick.call(this,ctx,x,y) === false){
			return false;
		}
	}
}

/**
 * permet d'obtenir les limites dans laquelle la courbe s'inscrit
 * 	xMin : exclut les x inférieur à cette valeur
 * 	xMax : exclut les x supérieur à cette valeur
 * extended : retourne les limites en extrapolant pour obtenir les valeur xMin et xMax
 * 
 * retourne Array [xMin,xMax,yMin,yMax]
 **/
ChartPlots.prototype.getBox = function(xMin,xMax,extended){
	function majBox(point){
		box[0] = Math.min(point[0],box[0]);
		box[1] = Math.max(point[0],box[1]);
		box[2] = Math.min(point[1],box[2]);
		box[3] = Math.max(point[1],box[3]);
	}
	function intersection(point,last,x1,x2){
		var a = (last[1]-point[1])/(last[0]-point[0]),
			b = point[1] - a*point[0];
		majBox([x1,a*x1 + b]);
		if(typeof x2 === "number"){
			majBox([x2,a*x2 + b]);
		}
	}
	var box = [
			Infinity, //xMin
			-Infinity, //xMax
			Infinity, //yMin
			-Infinity //yMax
		],
		last = null, //dernier point étudié
		lastIn = -1, //était dans l'interval
		li = this.points.length,
		i,point;
	if(typeof xMin !== "number"){
		xMin = -Infinity;
	}
	if(typeof xMax !== "number"){
		xMax = Infinity;
	}
	for(i=0;i<li;i++){
		point=this.points[i];
		if(point[0]<xMin || point[0]>xMax){
			if(extended){
				if(point[0]<xMin && lastIn>=0){
					intersection(point,last,xMin,lastIn>0?xMax:"");
				}
				if(point[0]>xMax && lastIn<=0){
					intersection(point,last,xMax,lastIn<0?xMin:"");
				}
				lastIn = point[0]-xMin;
				last = point;
			}
			continue;
		}
		if(extended){
			if(lastIn!==0 && last){
				intersection(point,last,last[0]<xMin?xMin:xMax);
			}
			lastIn = 0;
			last = point;
		}
		majBox(point);
	}
	/*if(box[0]>box[1]){
		//aucun point trouvé
		box[0] = xMin;
		box[1] = xMax;
	}
	if(box[2]>box[3]){
		box[2] = Infinity;
		box[3] = -Infinity;
	}*/
	console.debug(box);
	return box;
}

/**
 * Indique si les coordonées sont proche de la courbe
 * 	x,y: coordonées
 * 	r : rayon de marge
 * 
 * retourne true si les coordonée sont à moins de r de la courbe
 **/
ChartPlots.prototype.isOn = function(x,y,r){
	r = r || 1;
	//x = x/this.tx;
	//y = y/this.ty;
	var box = this.getBox(x-r,x+r,true);
	if(y>box[2]-r && y<box[3]+r){
		return true;
	}else{
		return false;
	}
}

/**
 * permet de créer une fonction de copie de tableau
 **/
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