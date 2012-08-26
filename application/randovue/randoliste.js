//objet principal permettant de gérer la liste des actions
var randoListe={
	zone:document.getElementById("affichage"),//zone d'affichage
	scrollList:null,
	defineZone:function(elem){
		if(typeof elem === "string"){
			elem = document.getElementById(elem);
		}
		this.zone=elem;
		this.scrollList=new PagingElement(elem,"v",300,2);
	},
	liste:[], //liste des objets
	add:function(obj,position){
	//ajoute un nouvel objet à la liste
		position = position || this.liste.length;
		this.liste.push(obj);
		//this.zone.appendChild(obj.element);
		this.changePosition(this.liste.length-1,position,true);
		this.scrollList.add(this.display(),position);
		this.view(position);
	},
	delete:function(position){
	//supprime un objet de la liste
		this.changePosition(position,this.liste.length-1);
		//this.zone.removeChild(this.liste.splice(this.liste.length-1,1)[0].element);
		this.scrollList.remove(position);
		this.view(position);
	},
	display:function(all){
	//gère l'affichage des objets
		if(all){
			//TODO A revoir
console.warn('code to review (display)');
			var aff=this.zone;
			aff.innerHTML="";
			var i=0,li=this.liste.length;
			while(i<li){
				aff.appendChild(this.liste[i++].element);
			}
		}else{
			var that=this;
			return function(position){
				that.liste[position].display(this,"editor_view");
			}
		}
	},
	view:function(index){
		this.scrollList.scrollTo(index);
//		this.scrollList.refresh();
	},
	changePosition:function(oldPosition,newPosition,notExistInScrollList){
		//permet de modifier la position d'un objet
		if(oldPosition<newPosition){
			//mise à jour DOM
			if(newPosition>=this.liste.length-1){
				newPosition=this.liste.length-1;
//				this.zone.appendChild(this.liste[oldPosition].element);
			}else{
//				this.zone.insertBefore(this.liste[oldPosition].element,this.liste[newPosition+1].element);
			}

			//mise à jour des n° de position
			var i=newPosition;
			while(i>oldPosition){
				this.liste[i].position=--i;
			}
			this.liste[i].position=newPosition;
			//mise à jour de la liste
			this.liste.splice(newPosition,0,this.liste.splice(oldPosition,1)[0]);
		}else{
			if(newPosition<0) newPosition=0;
			//mise à jour DOM
//			this.zone.insertBefore(this.liste[oldPosition].element,this.liste[newPosition].element);
			//mise à jour des n° de position
			var i=newPosition;
			while(i<oldPosition){
				this.liste[i].position=++i;
			}
			this.liste[i].position=newPosition;
			//mise à jour de la liste
			this.liste.splice(newPosition,0,this.liste.splice(oldPosition,1)[0]);
		}
		if(!notExistInScrollList){
			this.scrollList.move(oldPosition,newPosition);
		}
		this.view(newPosition);
	},
	getInfo:function(){
		//permet d'obtenir un objet en incluant les actions dans les sections
		var i=0,li=this.liste.length,rslt={actions:[],type:"body"},section=rslt,obj;
		while(i<li){
			obj=this.liste[i++].getInfo();
			if(obj.type==="section"){
				if(section!==rslt) rslt.actions.push(section);
				section={
					actions:[],
					type:"section",
					titre:obj.titre,
					date:obj.date,
					parcours:obj.parcours,
					distance:obj.distance,
					color:obj.color
				};
			}else{
				section.actions.push(obj);
			}
		}
		if(section!==rslt) rslt.actions.push(section);
		return rslt;
	},
	toString:function(){
		//permet d'obtenir une chaine de caractères de l'ensemble
		return JSON.stringify(this.getInfo(),function(key,value){
			if(key === "zoom") return;
			return value;
		});
	}
};