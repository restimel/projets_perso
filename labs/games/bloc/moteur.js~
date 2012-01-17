function debug(message){
	try{
		postMessage({cmd:"debug",message:message});
	}catch(e){
		try{
			message=JSON.stringify(message);
		}catch(e){
			message="#~"+message.toString()+"~#";
		}
		postMessage({cmd:"debug",message:"~~"+message+"~~ "+e.message});
	}
}

onmessage=function(e){
	var data=e.data;
	switch(data.cmd){
		case "creation": creation(data.size); break;
		case "getCase": getInfo(data.x,data.y); break;
		case "getGroupe": getGroupe(); break;
		case "setGroupe": setGroupe(data.x,data.y,data.groupe); break;
		case "setTarget": setTarget(data.x,data.y,data.tx,data.ty); break;
		case "solution": findSolution();break;
		default: postMessage({cmd:"error",content:data.cmd +" unknown"});
	}
};

function creation(l){
	for(var i=0,li=jeu.size;i<li;i++){
		for(var j=0,lj=jeu.size;j<lj;j++){
			jeu.del(i,j);
		}
	}
	jeu=new game(l);
	var i=l,j;
	while(i--){
		jeu.tab[i]=[];
		j=l;
		while(j--){
			jeu.tab[i][j]=null;
		}
	}
}

function getInfo(x,y){
	var reponse={groupe:"empty",goto:"",from:"",x:x,y:y},
		bloc=jeu.tab[x][y],
		pst;
	if(bloc){
		reponse.groupe=Groupe.liste[bloc.groupe].nom;
	}
	if((pst=jeu.position.getIndexOf([x,y]))!==-1){
		reponse.goto=jeu.finish[pst][0]+"-"+jeu.finish[pst][1];
	}
	postMessage({cmd:"giveInfo",rsp:reponse});
}

function getGroupe(){
	var liste=[],i=0,li=Groupe.liste.length;
	while(i<li){
		liste.push({nom:Groupe.liste[i].nom,color:Groupe.liste[i].color});
		i++;
	}
	postMessage({cmd:"giveGroupe",liste:liste});
}

function setGroupe(x,y,groupe){
	if(groupe==="empty"){
		jeu.del(x,y);
	}else{
		if(jeu.tab[x][y]){
			var blc=jeu.tab[x][y];
			Groupe.liste[blc.groupe].remove(jeu.tab[x][y]);
			Groupe.add(groupe,jeu.tab[x][y]);
		}else{
			jeu.tab[x][y]=new bloc(groupe,x,y);
		}
	}
	postMessage({cmd:"update",x:x,y:y,color:Groupe.search(groupe).color});
}

function setTarget(x,y,tx,ty){
	var pst=jeu.position.getIndexOf([x,y]);
	if(pst===-1){
		if(!isNaN(tx) && !isNaN(ty)){
			jeu.position.push([x,y]);
			jeu.finish.push([tx,ty]);
		}
	}else{
		if(!isNaN(tx) && !isNaN(ty)){
			jeu.finish[pst]=[tx,ty];
		}else{
			jeu.position.splice(pst,1);
			jeu.finish.splice(pst,1);
		}
	}
}

function findSolution(){
	var s=jeu.snapshot(),
		suite;
	s.parent=s;
	if(!jeu.finish.length){
		suite = {display:function(){return "<div>Targets are not specified... :'(</div>";},distanceC:"No target known... :'(",parent:s}; 
	}else{
		suite=s.Aetoile()||{display:function(){return "<div>No solution has been found... :'(</div>";},distanceC:"There is no solution... :'(",parent:s};
	}
	
	var t="";
	var nbC=suite.distanceC,i=suite.distanceC;
	while(suite!=s && suite!=null){
		t+=i--;
		t+=suite.display();
		suite=suite.parent;
	}
	t+=0;
	t+=s.display();
	postMessage({cmd:"solutionFound",nbMove:nbC,message:t});
}

/*
	Objet game
*/

function game(taille){
	this.size=taille||0;
	this.tab=[];
	this.position=[];
	this.finish=[];
	for(var i=0,li=this.size;i<li;i++){
		this.tab[i]=[];
	}
}
game.prototype.del=function(x,y){
	if(this.tab[x][y]) this.tab[x][y].del();
	this.tab[x][y]=null;
}

game.prototype.snapshot=function(){
	var tab=[],lx=this.size,x=lx,ly=this.size,y,z,groupe=0;
	while(x--){
		tab[x]=[];
		y=ly;
		while(y--){
			tab[x][y]=-1;
		}
	}
	
	x=lx;
	while(x--){
		y=ly;
		while(y--){
			if(tab[x][y]==-1){
				if(this.tab[x][y]==null){
					tab[x][y]=0;
				}else{
					groupe=this.tab[x][y].groupe;
					tab[x][y]=this.tab[x][y].groupe;//++groupe;
					z=this.tab[x][y].lien.length;
					while(z--){
						tab[this.tab[x][y].lien[z].x][this.tab[x][y].lien[z].y]=groupe;
					}
				}
			}
		}
	}
	Game_shot.prototype.target=this.finish;
	//var gs=new Game_shot(tab,this.position,0);
	return new Game_shot(tab,this.position,0);
}

var jeu=new game();


/*
	Objet game_shot
*/
function Game_shot(tab,position,distanceC,parent){
	this.tab=tab||[]; //tableau représentant les blocs
	this.position=position||[[0,0]]; // position du bloc devant arriver à la cible
	this.distanceC=distanceC||0; //cout actuel
	this.distanceE=this.estimate(); //distance total estimée pour atteindre la fin (cout actuel + estimation pour atteindre la fin)
	this.parent=parent||null; //objet parent
}
Game_shot.prototype.target=[[0,0]]; //position de l'arrivée

Game_shot.prototype.estimate=function(){
	var i=this.target.length,
		dst=this.distanceC;
	while(i--){
		dst+=Math.abs(this.target[i][0]-this.position[i][0]);
		dst+=Math.abs(this.target[i][1]-this.position[i][1]);
		tmp=this.tab[this.target[i][0]][this.target[i][1]];
		if(tmp!==0 && tmp!==this.tab[this.position[i][0]][this.position[i][1]]) dst++;
	}
	return dst;
}

Game_shot.prototype.verify_move=function(id,direction){
	var n_grille=this.tab.copy();
	
	var i=-1,li=this.tab.length,j,lj,pst;
	var thisPosition=this.position,position=thisPosition.copy();
	while(++i<li){
		j=-1;
		lj=this.tab[i].length;
		while(++j<lj){
			if(this.tab[i][j]===id){
				switch(direction){
					case 1: //à droite
						if(i===li-1 || (this.tab[i+1][j]!==0 && this.tab[i+1][j]!==id)){
							return false;
						}
						if(i===0 || this.tab[i-1][j]!==id){
							n_grille[i][j]=0;
						}
						n_grille[i+1][j]=id;
						if((pst=thisPosition.getIndexOf([i,j]))!==-1){
							position[pst][0]++;
						}
					break;
					case 2: //à gauche
						if(i===0 || (this.tab[i-1][j]!==0 && this.tab[i-1][j]!==id)){
							return false;
						}
						if(i===li-1 || this.tab[i+1][j]!==id){
							n_grille[i][j]=0;
						}
						n_grille[i-1][j]=id;
						if((pst=thisPosition.getIndexOf([i,j]))!==-1){
							position[pst][0]--;
						}
					break;
					case 3: //en bas
						if(j===lj-1 || (this.tab[i][j+1]!==0 && this.tab[i][j+1]!==id)){
							return false;
						}
						if(j===0 || this.tab[i][j-1]!==id){
							n_grille[i][j]=0;
						}
						n_grille[i][j+1]=id;
						if((pst=thisPosition.getIndexOf([i,j]))!==-1){
							position[pst][1]++;
						}
					break;
					case 4: //en haut
						if(j===0 || (this.tab[i][j-1]!==0 && this.tab[i][j-1]!==id)){
							return false;
						}
						if(j===lj-1 || this.tab[i][j+1]!==id){
							n_grille[i][j]=0;
						}
						n_grille[i][j-1]=id;
						if((pst=thisPosition.getIndexOf([i,j]))!==-1){
							position[pst][1]--;
						}
					break;
					default: return false;
				}
			}
		}
	}
	return new Game_shot(n_grille,position,this.distanceC+1,this);
};

Game_shot.prototype.get_next=function(){
	var result=[],i=-1,li=this.tab.length,j,lj,k,t,id,done=[0,1];
	while(++i<li){
		j=-1;
		lj=this.tab[i].length;
		while(++j<lj){
			if(done.indexOf(id=this.tab[i][j])===-1){
				k=1;
				do{
					if(t=this.verify_move(id,k)){
						result.push(t);
					}
				}while(k++<4);
				done.push(id);
			}
		}
	}
	return result;
};


Game_shot.prototype.compare=function(tab){
	var lx=this.tab.length,ly=this.tab[0].length,x=-1,y;
	while(++x<lx){
		y=0;
		while(y<ly){
			if(this.tab[x][y]!==tab[x][y++]) return false;
		}
	}
	return true;
};
/*
Game_shot.prototype.compare=function(tab){
	var x=this.tab.length,ly=this.tab[0].length,y;
	while(x--){
		y=ly;
		while(y--){
			if(this.tab[x][y]!==tab[x][y]) return false;
		}
	}
	return true;
}
*/

Game_shot.prototype.display=function(mode){
	var text='<table class="snapshot">',lx=this.tab.length,ly=this.tab[0].length,y=-1,x;
	while(++y<ly){
		text+="<tr>";
		x=0;
		while(x<lx){
			text+="<td style=\"background:"+Groupe.liste[this.tab[x][y]].color+"\">"+this.tab[x++][y]+"</td>";
		}
		text+="</tr>";
	}
	text+="</table>";
	switch(mode){
		case 1:
			text+="<br>Distance: "+this.distanceC+"<br>Estimation: "+this.distanceE;
			break;
		default:
	}
	return text;
};
/*
 * return false quand il a trouvé la cible
 */
Game_shot.prototype.verifEnd=function(){
	var i=this.target.length;
	while(i--){
		if(this.target[i][0]!=this.position[i][0] || this.target[i][1]!=this.position[i][1]){
			return true;
		}
	}
	return false;
};

Game_shot.prototype.Aetoile=function(){
	var todo=[],done=[],current=this,fils,i,trouver;
	var information=0,nbInformation=150;
	while(current.verifEnd() ){
		if(++information>nbInformation){
			postMessage({cmd:"solutionUpdate",done:done.length,tocompute:todo.length,distance:current.distanceC+"/"+current.distanceE});
			information=0;
		}
		//recupere les fils
		i=(fils=current.get_next()).length;
		while(i--){
			if(fils[i].compare(current.parent.tab)){
				continue;
			}
			//verifie que fils n'est pas deja dans done
			if((trouver=search_A(done,fils[i]))!=null){
				if(trouver.distanceC>fils[i].distanceC){
					trouver.distanceC=fils[i].distanceC;
					trouver.parent=fils[i].parent;
					trouver.estimate();
				}
				continue;
			}
			//verifie que fils n'est pas deja dans todo
			if((trouver=search_A(todo,fils[i]))!=null){
				if(trouver.distanceC>fils[i].distanceC){
					trouver.distanceC=fils[i].distanceC;
					trouver.parent=fils[i].parent;
					trouver.estimate();
				}
				continue;
			}
			//ajoute fils à todo
			todo.push(fils[i]);
		}
		if(todo.length){
			//trie todo
			todo.sort(sort_A);
			//ajoute current à done
			done.push(current);
			//current devient le premier element de todo
			current=todo.shift();
		}else{
			return null;
		}
	}
	//alert(debug);
	postMessage({cmd:"solutionUpdate",done:done.length,tocompute:todo.length,distance:current.distanceC+"/"+current.distanceE+" (done)"});
	return current;
}

function search_A(tab,GS){
	var i=tab.length;
	while(i--){
		if(GS.compare(tab[i].tab)) return tab[i];
	}
	return null;
}
function search_B(tab,GS){
	var i=-1,li=tab.length;
	while(++i<li){
		if(GS.compare(tab[i].tab)) return tab[i];
	}
	return null;
}

function sort_A(a,b){
	if(a.distanceE>b.distanceE) return 1;
	if(a.distanceE<b.distanceE) return -1;
	if(a.distanceC<b.distanceC) return 1;
	return -1;
}

/*
  Objet Groupe
 */
function Groupe(nom,couleur){
	this.nom=nom;
	this.color=couleur;
	this.liste=[];
	this.id=Groupe.liste.push(this)-1;
}
Groupe.prototype.add=function(blc){
	blc.groupe=this.id;
	if(this.liste[0]) this.liste[0].add_link([blc]);
	this.liste.push(blc);
}
Groupe.prototype.remove=function(blc){
	var i=this.liste.indexOf(blc);
	if(i!==-1) this.liste.splice(i,1);
	
	i=this.liste.length;
	while(i--){
		this.liste[i].remove_link(blc);
	}
	blc.lien=[];
	blc.groupe=0;
}

Groupe.liste=[];
Groupe.search=function(nom){
	var i=0,li=Groupe.liste.length;
	while(i<li){
		if(Groupe.liste[i].nom===nom){
			return Groupe.liste[i];
		}
		i++;
	}
	return null;
}
Groupe.add=function(grp,blc){
	var g=Groupe.search(grp);
	g.add(blc);
}

new Groupe("empty","");
new Groupe("Non movable","#000000");
new Groupe("groupe 1","#0033CC");
new Groupe("groupe 2","#CC1100");
new Groupe("groupe 3","#00CC22");
new Groupe("groupe 4","#CCCC22");
new Groupe("groupe 5","#AAAAAB");
new Groupe("groupe 6","#00CCCC");
new Groupe("groupe 7","#CC00CC");
new Groupe("groupe 8","#000066");
new Groupe("groupe 9","#660000");
new Groupe("groupe 10","#006600");
new Groupe("groupe 11","#660066");
new Groupe("groupe 12","#006666");
new Groupe("groupe 13","#666600");
new Groupe("groupe 14","#336633");
new Groupe("groupe 15","#3366FF");


/*
	Objet bloc
*/

function bloc(groupe,x,y){
	this.x=x;
	this.y=y;
	this.lien=[];
	this.sid=1;
	//this.groupe=groupe;
	Groupe.add(groupe,this);
}
bloc.prototype.add_link=function(copains,sid){
	var id=sid||this.sid+Math.random();
	if(this.sid===id){
		id=0;
	}else{
		this.sid=id;
	}
	var li=copains.length,copain;
	while(li--){
		copain=copains[li];
		if(copain!==this && this.lien.indexOf(copain)===-1){
			this.lien.push(copain);
			if(id){ //on ne recommence pas la recherche
				copain.add_link([this],id);
				var l=this.lien.length-1;
				while(l--){
					this.lien[l].add_link(this.lien,id);
				}
			}
		}
	}
	//if(!sid) message("cet ensemble contient "+this.lien.length+" blocs");
}
bloc.prototype.remove_link=function(copain){
	var i=this.lien.indexOf(copain);
	if(i!==-1) this.lien.splice(i,1);
}
bloc.prototype.del=function(){
	/*var copain;
	while(this.lien.length){
		copain=this.lien.pop();
		copain.remove_link(this);
	}*/
	Groupe.liste[this.groupe].remove(this);
	//this.element.parentNode.removeChild(this.element);
}

/*
 * GENERIC
 */
Array.prototype.copy=function(){
	var ntab=[],i=0,li=this.length;
	while(i<li){
		if(this[i] instanceof Array){
			ntab[i]=this[i++].copy();
		}else{
			ntab[i]=this[i++];
		}
	}
	return ntab;
};

Array.prototype.getIndexOf=function(tab){
	var i=0,li=this.length,str=tab.toString();
	while(i<li){
		if(this[i].toString()===str) return i;
		i++
	}
	return -1;
}

getGroupe();