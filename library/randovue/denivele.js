                                                                     
                                                                     
                                                                     
                                                                     
                                                                     
                                                                     
function Denivele(chemin){
	this.convert2D(chemin);
	this.maxX = 1000;
	this.maxY = 1000;
	this.margeX = 20;
	this.margeY = 20;
	this.width = maxX+this.margeX;
	this.height = maxY+this.margeY;
}

Denivele.prototype.convert2D = function(chemin){
	var distance = 0,
	i = 1, li = chemin.length;
	
	this.points = [[0,chemin[0][2]]];
	do{
		distance += calculDistance(chemin[i-1],chemin[i]);
		this.points.push([distance,chemin[i][2]]);
	}while(++i<li);
};

Denivele.prototype.draw = function(){
	var i = 0, li = this.points.length, ctx = this.ctx;
	
	ctx.clearRect(0,0,this.width,this.height);
	
	ctx.beginPath();
	ctx.moveTo(this.margeX, 30);
	
	
	
	while(i<li){
		ctx.lineTo(150, 150); //TODO
	}
	ctx.stroke();
};

Denivele.prototype.create = function(){
	this.element = document.createElement("canvas");
	this.ctx = this.element.getContext("2d");
	this.draw();
	return this.element;
};