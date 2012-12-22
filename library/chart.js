function Chart(option){
	option = option || {};
	this.maxX = 1000;
	this.maxY = 500;
	this.margeX = 40;
	this.margeY = 40;
	this.width = this.maxX+this.margeX;
	this.height = this.maxY+this.margeY;
	
	this.plotsList = [];
	
	this.viewBox = [	0, //xMin
						0, //xMax
						0, //yMin
						0 //yMax
					];
	this.mouseMove = option.mouseMove || null;
	this.mouseClick = option.mouseClick || null;
	this.uniteX = option.uniteX || "";
	this.uniteY = option.uniteY || "";
}

Chart.prototype.add = function(plots){
	if(!(plots instanceof ChartPlots)){
		if(plots instanceof Array && plots.length && plots[0] instanceof Array){
			plots = new ChartPlots(plots);
		}else{
			return null;
		}
	}
	var i=this.plotsList.push(plots),
		box = this.plotsList[i-1].getBox();
	this.viewBox[0] = Math.min(this.viewBox[0],box[0]);
	this.viewBox[1] = Math.max(this.viewBox[1],box[1]);
	this.viewBox[2] = Math.min(this.viewBox[2],box[2]);
	this.viewBox[3] = Math.max(this.viewBox[3],box[3]);
}

Chart.prototype.remove = function(index){
	if(index>=0 && index<this.plotsList.length){
		this.plotsList.splice(index,1);
	}
}

Chart.prototype.draw = function(){
	var i = this.viewBox[0],
		li = this.plotsList.length,
		ctx = this.ctx,
		ctx2 = this.ctx2,
		tx = this.maxX/(this.viewBox[1]-this.viewBox[0]),
		ty = this.maxY/(this.viewBox[3]-this.viewBox[2]),
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
		ctx.fillText(Math.round(interval*i*10/ty)/10+this.uniteY, 0,0);
		ctx.restore();
		//label absisse
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText(Math.round(this.maxX*i/0.5/tx)/10+this.uniteX, this.maxX*i/5+this.margeX, this.maxY);
	}
	
	ctx.font="15px Helvetica";
	ctx.textAlign = "right";
	//label ordonnée
	ctx.save();
	ctx.textBaseline = "bottom";
	ctx.translate(this.margeX, this.maxY - interval*i);
	ctx.rotate(-pi2);
	ctx.fillText(Math.round(interval*i*10/ty)/10+this.uniteY, 0,0);
	ctx.restore();
	//label absisse
	ctx.textBaseline = "top";
	ctx.fillText(Math.round(this.maxX*i/0.5/tx)/10+this.uniteX, this.maxX*i/5+this.margeX, this.maxY);
	
	ctx.stroke();
	ctx.restore();
	
	
    
	
	//courbe
	ctx.translate(this.margeX,this.maxY);
	ctx.scale(1,-1);
	li=this.plotsList.length;
	for(i=0;i<li;i++){
		this.plotsList[i].draw(ctx,tx,ty);
	}
	
	ctx.restore();
	
	//la surcouche
	this.draw2();
	
};

Chart.prototype.draw2 = function(x,y){
	var i = 0,
		li = this.plotsList.length,
		ctx2 = this.ctx2;

	ctx2.save();
	ctx2.clearRect(0,0,this.width,this.height);
	
	ctx2.translate(this.margeX,this.maxY);
	ctx2.scale(1,-1);
	
	for(i=0;i<li;i++){
		this.plotsList[i].draw2(ctx2,x-this.margeX,y);
	}
	ctx2.restore();
};


Chart.prototype.create = function(){
	var that = this;
	this.element = document.createElement("div");
	this.element.style.cssText ="position:relative;width:100%;height:100%;";
	console.debug(this);
	this.element.onresize = this.resize.bind(this);
	
	this.canvasFond = document.createElement("canvas");
	this.canvasFond.style.cssText = "width: 100%; height:100%; top:0; left:0; position:absolute;";
	this.canvasFond.onresize = this.resize.bind(this);
	this.canvasFond.width = this.width;
	this.canvasFond.height = this.height;
	this.ctx = this.canvasFond.getContext("2d");
	this.element.appendChild(this.canvasFond);
	
	this.canvasAvant = document.createElement("canvas");
	this.canvasAvant.style.cssText = "width: 100%; height:100%; top:0; left:0; position:absolute; ";
	this.canvasAvant.onresize = this.resize.bind(this);
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
	if(this.mouseClick){
		this.canvasAvant.onclick = function(event){
			var x,y;
			if(typeof event.offsetX !== "undefined"){
				x=event.offsetX;
				y=event.offsetY;
			}else{
				x=event.layerX; //pas tout à fait la même chose => peut entrainer des bugs
				y=event.layerY;
			}
			console.warn("todo: click on chart");
			//that.draw2(x,y);
		};
	}
	this.canvasAvant.width = this.width;
	this.canvasAvant.height = this.height;
	this.ctx2 = this.canvasAvant.getContext("2d");
	this.element.appendChild(this.canvasAvant);
	
	setTimeout(this.resize.bind(this),50);
	setTimeout(function(){that.element.parentNode.onresize = function(){console.log('resize parent');that.resize();};},100); //DEBUG
	
	return this.element;
};

Chart.prototype.resize = function(){
	this.width = this.canvasFond.offsetWidth;
	this.height = this.canvasFond.offsetHeight;
	this.maxX = this.width - this.margeX;
	this.maxY = this.height - this.margeY;
	this.canvasFond.width = this.canvasAvant.width = this.width;
	this.canvasFond.height = this.canvasAvant.height = this.height;
	
	this.draw();
};

