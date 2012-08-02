

function Denivele(chemin,color){
	this.color = color || "#000033";
	this.maxX = 1000;
	this.maxY = 500;
	this.margeX = 40;
	this.margeY = 40;
	this.width = this.maxX+this.margeX;
	this.height = this.maxY+this.margeY;
	this.distance = 0;
	this.maxHeight = 0; //TODO altitude négative
	this.convert2D(chemin);
	
}

Denivele.prototype.convert2D = function(chemin){
	var distance = 0,
		maxHeight = 0;
		i = 1, li = chemin.length;
	
	//TODO remove points sans altitude
	
	this.points = [[0,chemin[0][2]]];
	maxHeight = Math.max(maxHeight,chemin[0][2]);
	do{
		distance += calculDistance(chemin[i-1],chemin[i]);
		maxHeight = Math.max(maxHeight,chemin[i][2]);
		this.points.push([distance,chemin[i][2]]);
	}while(++i<li);
	
	this.distance = distance;
	this.maxHeight = Math.ceil(maxHeight/10+1.4)*10;
	
	function calculDistance(p1,p2){
	//calcul approximatif (TODO utiliser le calcul de Map)
		var dx = (p1[0] - p2[0])*100,
			dy = (p1[1] - p2[1])*100,
			dh = (p1[2] - p2[2]),
			dst = Math.sqrt(dx*dx + dy*dy + dh*dh);
		return dst;
	}
};

Denivele.prototype.draw2 = function(x,y){
	var i = 0,
		points = this.points,
		li = points.length,
		ctx2 = this.ctx2,
		tx = this.maxX/this.distance,
		ty = this.maxY/this.maxHeight,
		dst=0,
		a,b;

	x-=this.margeX;
	
	
	ctx2.save();
	
	ctx2.clearRect(0,0,this.width,this.height);
	
	if(x>0){// && y<this.maxY
		//recherche de la position y
		x = x/tx;
		while(i<li && dst<x){
			dst = points[i++][0];
		}
		if(x<dst){
			i--;
			a=(points[i-1][1]-points[i][1])/(points[i-1][0]-points[i][0]);
			b=points[i][1]-points[i][0]*a;
			y = x*a + b;
			
			ctx2.save();
			ctx2.translate(this.margeX+x*tx,this.maxY-y*ty);
			
			//marqueur
			ctx2.beginPath();
			ctx2.fillStyle = "rgba(100,60,0,0.8)";
			ctx2.arc(0, 0, 3.5, 0, 2 * Math.PI, false);
			ctx2.fill();
			
			ctx2.beginPath();
			ctx2.strokeStyle = "rgba(0,0,0,0.3)";
			ctx2.moveTo(-13,0);
			ctx2.lineTo(13,0);
			ctx2.stroke();
			
			//dessin marcheur
			
			ctx2.strokeStyle = "rgba(0,0,0,0.6)";
			ctx2.scale(0.7,0.7);
			ctx2.beginPath();
			
			//tete
			ctx2.arc(0, -35, 5, 0, 2 * Math.PI, false);
			//jambes
			ctx2.moveTo(-10,0);
			ctx2.lineTo(0,-10);
			ctx2.lineTo(10,0);
			//bras
			ctx2.moveTo(-20,-30);
			ctx2.lineTo(20,-30);
			//corps
			ctx2.moveTo(0,-10);
			ctx2.lineTo(10,-30);
			ctx2.lineTo(-10,-30);
			ctx2.lineTo(0,-10);
			
			
			//baton
			ctx2.moveTo(18,-32);
			ctx2.lineTo(17,0);
			
			ctx2.stroke();
			ctx2.restore();
			
			//label
			ctx2.fillStyle = "rgba(100,0,0,1)";
			ctx2.font='17px Helvetica';
			
			ctx2.textAlign = "center";
			ctx2.textBaseline = "bottom";
			ctx2.fillText("distance: "+(Math.round(x*100)/100)+"m  hauteur:"+(Math.round(y*100)/100)+"m", this.width/2, this.height);
		}
    }
	
	ctx2.restore();
};

Denivele.prototype.draw = function(){
	var i = 0,
		li = this.points.length,
		ctx = this.ctx,
		ctx2 = this.ctx2,
		tx = this.maxX/this.distance,
		ty = this.maxY/this.maxHeight,
		x,y,
		pi2 = Math.PI/2;
	
	ctx.save();
	
	ctx.clearRect(0,0,this.width,this.height);
	
	//label
	ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.font='17px Helvetica';
	
	//ordonée
	ctx.beginPath();
	ctx.moveTo(this.margeX,this.maxY);
	ctx.lineTo(this.margeX, 0);
	ctx.strokeStyle = "rgba(0,0,0,1)";
	ctx.lineWidth = 1.5;
	//ctx.stroke();
	
	//absisse
	//ctx.beginPath();
	ctx.moveTo(this.margeX,this.maxY);
	ctx.lineTo(this.width, this.maxY);
	ctx.strokeStyle = "rgba(0,0,0,1)";
	ctx.lineWidth = 1.5;
	ctx.stroke();
	
	ctx.save();
	//absisses
	var interval = this.maxY/5;
	ctx.strokeStyle = "rgba(0,0,0,0.5)";
	ctx.lineWidth = 0.2;
	ctx.beginPath();
	for(i=1;i<5;i++){
		y=this.maxY - interval*i;
		ctx.moveTo(this.margeX, y);
		ctx.lineTo(this.width, y);
		//label ordonnée
		ctx.save();
		/*ctx.textAlign = "right"
		ctx.textBaseline = "middle";*/
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.translate(this.margeX, y);
		ctx.rotate(-pi2);
		ctx.fillText(Math.round(interval*i*10/ty)/10+"m", 0,0);
		ctx.restore();
		//label absisse
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText(Math.round(this.maxX*i/0.5/tx)/10+"m", this.maxX*i/5+this.margeX, this.maxY);
	}
	
	ctx.font="15px Helvetica";
	ctx.textAlign = "right";
	//label ordonnée
	ctx.save();
	ctx.textBaseline = "bottom";
	ctx.translate(this.margeX, this.maxY - interval*i);
	ctx.rotate(-pi2);
	ctx.fillText(Math.round(interval*i*10/ty)/10+"m", 0,0);
	ctx.restore();
	//label absisse
	ctx.textBaseline = "top";
	ctx.fillText(Math.round(this.maxX*i/0.5/tx)/10+"m", this.maxX*i/5+this.margeX, this.maxY);
	
	ctx.stroke();
	ctx.restore();
	
	
    
	
	//courbe
	ctx.beginPath();
	ctx.moveTo(this.margeX, this.maxY-(this.points[0][1]*ty));

	for(i=1;i<li;i++){
		x=this.margeX+this.points[i][0]*tx;
		y=this.maxY-(this.points[i][1]*ty);
		ctx.lineTo(x, y);
	}
	
	ctx.save();
	ctx.lineCap = 'round';
	//ctx.lineJoin = 'round';
	/*ctx.strokeStyle = "rgba(0,0,100,0.1)";
	ctx.lineWidth = 8.5;
	ctx.stroke();
	ctx.strokeStyle = "rgba(0,0,100,0.4)";
	ctx.lineWidth = 5.5;
	ctx.stroke();*/
	ctx.shadowOffsetX = 1;
	ctx.shadowOffsetY = 3;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 50, 0.6)";
  
	ctx.strokeStyle = "rgba(100,100,250,1)";
	ctx.lineWidth = 1.5;
	ctx.stroke();
	ctx.restore();
	
	
	ctx.restore();
	
	//la surcouche
	this.draw2();
	
};

Denivele.prototype.create = function(){
	var that = this;
	this.element = document.createElement("div");
	this.element.onresize = function(){console.log('resize element');};
	
	this.canvasFond = document.createElement("canvas");
	this.canvasFond.style.cssText = "width: 100%; height:100%; top:0; left:0;";
	this.canvasFond.onresize = function(){console.log('resize canvas1');};
	this.canvasFond.width = this.width;
	this.canvasFond.height = this.height;
	this.ctx = this.canvasFond.getContext("2d");
	this.element.appendChild(this.canvasFond);
	
	this.canvasAvant = document.createElement("canvas");
	this.canvasAvant.style.cssText = "width: 100%; height:100%; top:0; left:0; position:absolute";
	this.canvasAvant.onresize = function(){console.log('resize canvas2');};
	this.canvasAvant.onmousemove = function(event){
		var x,y;
		if(typeof event.offsetX !== "undefined"){
			x=event.offsetX;
			y=event.offsetY;
		}else{
			x=event.layerX; //pas tout à fait la même chose => peut entrainer des bugs
			y=event.layerY;
		}
		that.draw2(x,y);
	};
	this.canvasAvant.width = this.width;
	this.canvasAvant.height = this.height;
	this.ctx2 = this.canvasAvant.getContext("2d");
	this.element.appendChild(this.canvasAvant);
	
	setTimeout(this.resize.bind(this),50);
	setTimeout(function(){that.element.parentNode.onresize = function(){console.log('resize parent');};},100); //DEBUG
	
	return this.element;
};

Denivele.prototype.resize = function(){
	this.width = this.canvasFond.offsetWidth;
	this.height = this.canvasFond.offsetHeight;
	this.maxX = this.width - this.margeX;
	this.maxY = this.height - this.margeY;
	this.canvasFond.width = this.canvasAvant.width = this.width;
	this.canvasFond.height = this.canvasAvant.height = this.height;
	
	console.log(this.width+" "+this.height);
	this.draw();
};


//DEBUG
var debug_chemin=[
	[42,5,100],
	[42.1,5.5,101],
	[42.2,5.512,111],
	[42.1,5.515,105],
	[42.1789,5.51575,125],
	[42.14567,5.5152456,0],
	[43,5,90],
	[43.1,5.5,101],
	[43.2,5.512,115],
	[43.1,5.515,107],
	[43.1789,5.51575,116],
	[43.14567,5.6152456,101],
	[42,5.9,129],
	[42.1,6.4,95],
	[42.2,6.412,72],
	[42.1,6.515,102],
	[42.1789,6.51575,95],
	[42.14567,6.5152456,119],
	[43,6,103],
	[43.1,6.5,123],
	[43.2,6.512,131],
	[43.1,6.515,108.5],
	[43.17892,6.51555,116.16],
	[43.14567,6.5152456,20],
	[43.14567,6.4152456,20]
];
var debug=new Denivele(debug_chemin);
document.body.appendChild(debug.create());