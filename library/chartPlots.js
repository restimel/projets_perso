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

ChartPlots.prototype.draw = function(ctx,tx,ty){
	var i,x,y,
		li = this.points.length;
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

ChartPlots.prototype.draw2 = function(ctx,x,y){
	var tx=this.tx,
		ty=this.ty,
		points = this.points;
	if(x>0){// && y<this.maxY
		//recherche de la position y
		x = x/tx;
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
				if(this.mouseMove.call(this,ctx,x,y) === false){
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

ChartPlots.prototype.getBox = function(xMin,xMax){
	var box = [
			Infinity,
			-Infinity,
			Infinity,
			-Infinity
		],
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
			continue;
		}
		box[0] = Math.min(point[0],box[0]);
		box[1] = Math.max(point[0],box[1]);
		box[2] = Math.min(point[1],box[2]);
		box[3] = Math.max(point[1],box[3]);
	}
	if(box[0]>box[1]){
		box[0] = xMin;
		box[1] = xMax;
	}
	if(box[2]>box[3]){
		box[2] = -Infinity;
		box[3] = Infinity;
	}
	return box;
}


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