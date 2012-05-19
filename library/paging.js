function PagingElement(sourceElement,mode,defaultSize,marge){
	switch(mode){
		case 1: //paging horizontal
			this.config = this.configH;
			break;
		case 2: //paging horizontal + vertical TODO
			this.config = this.configV;
			break;
		case 0: //paging vertical
		default:
			this.config = this.configV;
	}
	this.source = sourceElement;
	this.container = document.createElement("div"); //élément contenant tous les éléments de la liste
	this.elements = []; //éléments de la liste
	this.innerSize = this.source[this.config.clientSize]; //taille de l'espace affichable
	this.positionTop = 0; //index du premier élément affichable
	this.positionBottom = 0; //index du dernier élément affichable
	this.defaultSize = defaultSize || 20; //taille d'un élément par défaut
	this.sizeTop = 0; //taille des éléments cachés au début
	this.sizeBottom = 0; //taille des éléments cachés à la fin
	this.margin = marge || 0; //marge d'affichage. Correspond au nombre d'élément afficher en plus au-delà de l'espace d'affichage
	
	var attribut={
		get:function(){
			return this.source[this.config.scrollTop];
		},
		set:function(v){
			v=parseInt(v,10);
			if(!isNaN(v)){
				this.source[this.config.scrollTop]=v;
			}
		},
		enumerable:true
	};
	Object.defineProperties(this,{scrollTop:attribut,scrollLeft:attribut});
	
	//gestion du scroll
	var that = this;
	this.source.onscroll = function(event){
//console.log("debut event "+event.type);
		//lors d'un scroll on récupère la nouvelle position
		var pos = that.source.scrollTop;
//console.log("pos "+pos +" innerSize");
		//on cherche la position des éléments correspondant au nouvel affichage
		var range = that.getPosition(pos,pos+that.innerSize);
		//gestion de l'affichage
		that.range(range[0]-that.margin,range[1]+that.margin);
//		console.log(range);
	};
	this.source.scrollTop = 0;
	this.source.appendChild(this.container);
	var fin = document.createElement("hr");
	fin.style.margin = "0px";
	this.source.appendChild(fin);
}

PagingElement.prototype.configH = {
	clientSize : "clientWidth",
	offsetSize : "offsetWidth",
	marginTop : "marginLeft",
	marginBottom : "marginRight",
	scrollTop : "scrollLeft",
	styleDisplay : "inline-block"
};
PagingElement.prototype.configV = {
	clientSize : "clientHeight",
	offsetSize : "offsetHeight",
	marginTop : "marginTop",
	marginBottom : "marginBottom",
	scrollTop : "scrollTop",
	styleDisplay : "block"
};

/**
	permet d'ajouter un élément à la liste 
**/
PagingElement.prototype.add = function(fCreation,position){
	if(typeof position === "undefined"){
		position = this.elements.length;
	}
	var element = {
		size : this.defaultSize,
		element : null,
		creation : fCreation,
		position : false //true→est considéré comme avant l'affichage, false→ est considéré comme après l'affichage
	};
	this.elements.splice(position,0,element);
	if(position<this.positionTop){//ajout d'un élément avant la zone d'affichage
		this.sizeTop += element.size;
		element.position = true;
		this.container.style[this.config.marginTop] = this.sizeTop+"px";
	}else{
		this.sizeBottom += element.size;
		this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
		if(position<=this.positionBottom){
			this.display(position);
		}
	}
};

/**
	permet de supprimer un élément de la liste
**/
PagingElement.prototype.remove = function(position){
	var elem = this.elements[position];
	var element = elem.element;
	if(element){
		this.container.removeChild(element);
	}else if(elem.position){
		this.sizeTop -= this.elements[position].size;
		this.container.style[this.config.marginTop] = this.sizeTop+"px";
	}else{
		this.sizeBottom -= this.elements[position].size;
		this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
	}
	this.elements.splice(position,1);
};

/**
	permet d'afficher un élément de la liste
		position : index de l'élément à afficher
		order : false→ajoute à la fin, true→ajoute au début
**/
PagingElement.prototype.display = function(position,order){
	var elem = this.elements[position];
	if(!elem.element){
		var element = document.createElement("div");
		elem.element = element;
		elem.creation.call(element,position);
		element.style.display = this.config.styleDisplay;
		if(elem.position){
			this.sizeTop -= elem.size;
			this.container.style[this.config.marginTop] = this.sizeTop+"px";
		}else{
			this.sizeBottom -= elem.size;
			this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
		}
		if(order){
			this.container.insertBefore(element,this.container.firstChild);
			if(this.positionTop>position){
				this.positionTop = position;
			}
		}else{
			this.container.appendChild(element);
			if(this.positionBottom<position){
				this.positionBottom = position;
			}
		}
		elem.size = elem.element[this.config.offsetSize];
	}
};

/**
	permet de masquer un élément de la liste
		@position : position de l'élément
		@order : true→à mettre dans la partie supérieur; false→à mettre dans la partie inférieur
**/
PagingElement.prototype.hide = function(position,order){
	var elem = this.elements[position];
	if(elem.element){
		if(order){
			this.sizeTop += elem.size;
			elem.position = true;
			this.container.style[this.config.marginTop] = this.sizeTop+"px";
			this.positionTop++;
		}else{
			this.sizeBottom += elem.size;
			elem.position = false;
			this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
			this.positionBottom--;
		}
		this.container.removeChild(elem.element);
		elem.element = null;
	}else{
		//vérification si l'élément change de zone de masquage sans avoir été affiché
		if(!elem.position && order){
			elem.position = true;
			this.sizeTop += elem.size;
			this.sizeBottom -= elem.size;
			this.container.style[this.config.marginTop] = this.sizeTop+"px";
			this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
		}else if(elem.position && !order){
			elem.position = false;
			this.sizeTop -= elem.size;
			this.sizeBottom += elem.size;
			this.container.style[this.config.marginTop] = this.sizeTop+"px";
			this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
		}
	}
};

/**
	permet de désigner la plage des éléments à afficher
		from: début de la plage
		to: fin de la plage
**/
PagingElement.prototype.range = function(from,to){
	var top = this.positionTop,
		bottom = this.positionBottom;
		
	if(from<0){
		from = 0;
	}
	if(to>=this.elements.length){
		to = this.elements.length -1;
	}
		
	if(from<top){
		//cacher les éléments aprés le to
		while(to<bottom){
			this.hide(bottom--,false);
		}
		
		//afficher les éléments
		while(from<=to){
			this.display(to--,true); //ajout des éléments au début
		}
	}else if(to>bottom){
		//cacher les éléments avant le from
		while(top<from){
			this.hide(top++,true);
		}
		
		//afficher les éléments
		while(from<=to){
			this.display(from++,false); //ajout des éléments à la fin
		}
	}
};

/**
	permet de récupérer la position d'un élément situé à une hauteur donnée
		d1 : distance du premier élément
		d2 : distance du deuxième élément
	(d1<=d2)
**/
PagingElement.prototype.getPosition = function(d1,d2){
	var position = 0,
		dst = 0,
		result = [null,null],
		elements = this.elements,
		max = elements.length;
	
	//position de d1
	while(dst<d1 && position<max){
		dst += elements[position++].size
	}
	result[0] = position;
	
	//position de d2
	while(dst<d2 && position<max){
		dst += elements[position++].size
	}
	result[1] = position;
	
	return result;
};

/**
	permet de raffraichir l'affichage
	DEBUG
**/
PagingElement.prototype.debug = function(){
	var i=0,li=5;
	this.source.onscroll({});
	/*while(i<li){
		this.display(i++);
	}*/
	/*console.log("debug: Debut top/bottom "+this.positionTop+"/"+this.positionBottom+"→size:"+this.sizeTop+"/"+this.sizeBottom);
	this.range(1,5);
	console.log("debug: top/bottom "+this.positionTop+"/"+this.positionBottom+"→size:"+this.sizeTop+"/"+this.sizeBottom);
	this.range(2,6);
	console.log("debug: top/bottom "+this.positionTop+"/"+this.positionBottom+"→size:"+this.sizeTop+"/"+this.sizeBottom);
	this.range(0,4);
	console.log("debug: top/bottom "+this.positionTop+"/"+this.positionBottom+"→size:"+this.sizeTop+"/"+this.sizeBottom);
	this.range(6,8);
	console.log("debug: top/bottom "+this.positionTop+"/"+this.positionBottom+"→size:"+this.sizeTop+"/"+this.sizeBottom);*/
};

