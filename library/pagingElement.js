/**
 * PagingElement API
 *
 * This work is licensed under a Creative Commons Attribution 3.0 Unported License
 * http://creativecommons.org/licenses/by/3.0/
 *
 * This object creates a list of elements inside another element.
 * These elements can be accessed by scrolling.
 * 
 * The goal of this library is to display DOM element only when
 * elements should be displayed. By doing this, it increases performance
 * when there are many elements in the list or when big objects should be
 * displayed like images (in this case these images are loaded only when
 * they should be displayed).
 * 
 * To use this library you should first create a PagingElement object
 * and then add elements to it.
 * 
 * Example:
 * var scrollList = new PagingElement(containerElement);
 * var i = 100;
 * while(i--)
 *     scrollList.add(function(nb){this.textContent = "Element #"+nb;});
 * scrollList.refresh();
 * 
 * 
 * Comments are in french
 **/

/**
	Constructeur permettant la mise en place des éléments nécessaires à l'illusion
	de scrolling
		@sourceElement : élément HTML contenant la liste des éléments
		@mode : définit si le scolling est vertical ou horizontal {false:vertical | true:horizontal} (default: vertical)
		@defaultSize : estimation de la taille d'un élément, cette valeur prendra la vraie taille au moment de l'affichage de l'élément (default: 20)
		@marge : nombre d'éléments non visible à afficher afin de garantir la fluidité (default : 0)
 **/ 
function PagingElement(sourceElement,mode,defaultSize,marge){
	//définition du type de scrolling
	switch(mode){
		case 1: //paging horizontal
		case true:
		case "h":
		case "H":
		case "horizontal":
		case "Horizontal":
		case "HORIZONTAL":
			this.config = this.configH;
			break;
		case 0: //paging vertical
		case false:
		case "v":
		case "V":
		case "vertical":
		case "Vertical":
		case "VERTICAL":
		default:
			this.config = this.configV;
	}
	this.source = sourceElement; //élément source contenant l'ensemble des éléments
	this.container = document.createElement("div"); //élément contenant tous les éléments de la liste
	this.elements = []; //éléments de la liste
	this.innerSize = this.source[this.config.clientSize]; //taille de l'espace affichable
	this.positionTop = 0; //index du premier élément affichable
	this.positionBottom = 0; //index du dernier élément affichable
	this.defaultSize = defaultSize || 20; //taille d'un élément par défaut
	this.sizeTop = 0; //taille des éléments cachés au début
	this.sizeBottom = 0; //taille des éléments cachés à la fin
	this.margin = marge || 0; //marge d'affichage. Correspond au nombre d'élément afficher en plus au-delà de l'espace d'affichage
	
	//accessors
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
		configurable:false,
		enumerable:true
	};
	Object.defineProperties(this,{scrollTop:attribut,scrollLeft:attribut});
	
	//gestion du scroll
	var that = this;
	this.source.onscroll = function(event){
		//lors d'un scroll on récupère la nouvelle position
		var pos = that.source.scrollTop;
		//on cherche la position des éléments correspondant au nouvel affichage
		var range = that.getPosition(pos,pos+that.innerSize);
		//gestion de l'affichage
		that.range(range[0]-that.margin,range[1]+that.margin);
	};
	this.source.appendChild(this.container);
	this.source.scrollTop = 0;
	this.source.style.overflow="auto";
	
	//pour les navigateur comme Opera il faut qu'il y ait un élément après le margin-bottom pour que le scroll existe
	var fin = document.createElement("hr");
	fin.style.margin = "0px";
	this.source.appendChild(fin);
}

//configuration à adopter selon les modes
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
		@fCreation : fonction appelée lors de l'affichage de l'élément permettant de remplir le contenu de l'élément
			Cette fonction st appelée dans le contexte de l'élément affiché (le this fait référence à cet élément), et sa position est donnée en paramètre.
		@position : position de l'élément dans la liste (default: mis à la fin de la liste)
**/
PagingElement.prototype.add = function(fCreation,position){
	if(typeof position !== "number" || isNaN(position)){
		position = this.elements.length;
	}
	
	var element = {
		size : this.defaultSize,
		element : null,
		creation : fCreation,
		position : false //true→est considéré comme avant l'affichage, false→ est considéré comme après l'affichage
	};
	
	//ajout de l'élément à la liste
	this.elements.splice(position,0,element);
	
	//mise à jour des paramètres du container
	if(position<this.positionTop){
		//ajout de l'élément avant la zone d'affichage
		this.sizeTop += element.size;
		element.position = true;
		this.container.style[this.config.marginTop] = this.sizeTop+"px";
	}else{
		//ajout de l'élément après la zone d'affichage
		this.sizeBottom += element.size;
		this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
		if(position<=this.positionBottom){
			this.display(position);
		}
	}
};

/**
	permet de supprimer un élément de la liste
		@position : position de l'élément à supprimer
**/
PagingElement.prototype.remove = function(position){
	var elem = this.elements[position];
	if(!elem){
		return false;
	}
	
	//mise à jour des paramètres du container
	var element = elem.element;
	if(element){
		//l'élément est actuellement affiché
		this.container.removeChild(element);
	}else if(elem.position){
		this.sizeTop -= this.elements[position].size;
		this.container.style[this.config.marginTop] = this.sizeTop+"px";
	}else{
		this.sizeBottom -= this.elements[position].size;
		this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
	}
	
	//suppression de l'élément de la liste
	return this.elements.splice(position,1);
};

/**
	permet d'afficher un élément de la liste
		@position : position de l'élément à afficher
		@order : indique si l'élément doit être affiché au début ou la fin de la zone d'affichage (false: fin | true: début)
		
		TODO optim possible en mettant à jour this.container.style[this.config.marginTop/Bottom] plus tard
**/
PagingElement.prototype.display = function(position,order){
	var elem = this.elements[position];
	if(!elem.element){ //l'élément est bien actuellement affiché

		//création de l'élément
		var element = document.createElement("div");
		elem.element = element;
		elem.creation.call(element,position); //appel de la fonction de création
		element.style.display = this.config.styleDisplay;
		
		//mise à jour des paramètres du container
		if(elem.position){ //l'élément était situé avant la zone d'affichage
			this.sizeTop -= elem.size;
			this.container.style[this.config.marginTop] = this.sizeTop+"px";
		}else{ //l'élément était situé après la zone d'affichage
			this.sizeBottom -= elem.size;
			this.container.style[this.config.marginBottom] = this.sizeBottom+"px";
		}
		
		//ajout de l'élément au DOM
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
		
		//mise à jour de la taille de l'élément
		elem.size = elem.element[this.config.offsetSize];
	}
};

/**
	permet de masquer un élément de la liste
		@position : position de l'élément
		@order : true→à mettre dans la partie supérieur; false→à mettre dans la partie inférieur
		@position : position de l'élément à cacher
		@order : indique si l'élément doit être placé avant ou après de la zone d'affichage (false: après | true: avant)
**/
PagingElement.prototype.hide = function(position,order){
	var elem = this.elements[position];
	if(elem.element){ //l'élément est bien actuellement affiché
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
		
		//suppression des éléments DOM
		this.container.removeChild(elem.element);
		elem.element = null;
	}else{ //l'élément n'est pas actuellement affiché
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
		@from: début de la plage
		@to: fin de la plage
**/
PagingElement.prototype.range = function(from,to){
	var top = this.positionTop,
		bottom = this.positionBottom;
	
	//Vérification si les paramètres ne sortent pas des valeurs acceptables
	if(from<0){
		from = 0;
	}
	if(to>=this.elements.length){
		to = this.elements.length - 1;
	}
		
	if(from<top){
		//cacher les éléments après le to
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
		@d1 : distance en px du premier élément
		@d2 : distance en px du deuxième élément
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
**/
PagingElement.prototype.refresh = function(){
	this.source.onscroll({});
};

/**
	permet de remettre à jour la taille de l'élément conteneur 
**/
PagingElement.prototype.resize = function(){
	this.innerSize = this.source[this.config.clientSize]; //taille de l'espace affichable
	this.refresh();
};

/**
	permet de déplacer un élément
**/
PagingElement.prototype.move = function(oldPosition,newPosition){
	if(oldPosition===newPosition) return;
	var obj = this.remove(oldPosition);
	if(oldPosition<newPosition){
		newPosition--;
	}
	this.add(obj,newPosition);
	this.refresh();
};
