                                                                     
                                                                     
                                                                     
                                                                     
                                                                     
                                                                     
function Denivele(chemin,color){
	this.color = color || "#000033";
	this.maxX = 1000;
	this.maxY = 500;
	this.margeX = 20;
	this.margeY = 20;
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
		//calcul approximatif (utiliser le calcul de Map)
		var dx = (p1[0] - p2[0]),
		dy = (p1[1] - p2[1]),
		dh = (p1[2] - p2[2]),
		dst = Math.sqrt(dx*dx + dy*dy + dh*dh);
		return dst;
	}
};

Denivele.prototype.draw = function(){
	var i = 0,
	li = this.points.length,
	ctx = this.ctx,
	tx = this.maxX/this.distance,
	ty = this.maxY/this.maxHeight;
	
	ctx.save();
	
	ctx.clearRect(0,0,this.width,this.height);
	
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
		
		ctx.moveTo(this.margeX,this.maxY - interval*i);
		ctx.lineTo(this.width, this.maxY - interval*i);
		
		
	}
	ctx.stroke();
	ctx.restore();
	
	//courbe
	ctx.beginPath();
	var x,y;
	ctx.moveTo(this.margeX, this.maxY-(this.points[0][1]*ty));
	
	for(i=1;i<li;i++){
		x=this.margeX+this.points[i][0]*tx;
		y=this.maxY-(this.points[i][1]*ty);
		ctx.lineTo(x, y);
		console.log(x,y);
	}
	
	ctx.save();
	ctx.lineCap = 'round';
	//ctx.lineJoin = 'round';
	/*ctx.strokeStyle = "rgba(0,0,100,0.1)";
	c tx.lineWidth = 8.5;                     *
	ctx.stroke();
	ctx.strokeStyle = "rgba(0,0,100,0.4)";
	ctx.lineWidth = 5.5;
	ctx.stroke();*/
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 3;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 50, 0.6)";
	
	ctx.strokeStyle = "rgba(100,100,250,1)";
	ctx.lineWidth = 1.5;
	ctx.stroke();
	ctx.restore();
	
	
	ctx.restore();	
};

Denivele.prototype.create = function(){
	this.element = document.createElement("canvas");
	this.element.width = this.width;
	this.element.height = this.height;
	this.ctx = this.element.getContext("2d");
	this.draw();
	return this.element;
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
	[43.1789,6.51555,116.16],
	[43.14567,6.5152456,101]
];
var debug=new Denivele(debug_chemin);
document.body.appendChild(debug.create());