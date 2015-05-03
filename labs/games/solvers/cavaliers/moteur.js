/*
 * Ce code est loin d'être optimisé car il se base sur un code précédent
 * Il est donc possible d'améliorer ses performances
 */

onmessage=function(e){
	var data=e.data;
	switch(data.cmd){
		case "creation": creation(data.size); break;
		case "actionCase": actionCase(data.x,data.y); break;
		case "solution": foundSolution();break;
		default: postMessage({cmd:"error",content:data.cmd +" unknown"});
	}
};

function creation(l){
	jeu=new game(l);
}

function actionCase(x,y){
	jeu.tab[x][y]=(jeu.tab[x][y]+2)%3-1;
	postMessage({cmd:"update",x:x,y:y,value:jeu.tab[x][y]});
}

function foundSolution(){
	var s=jeu.snapshot();
	s.parent=s;
	var suite=s.Aetoile()||{display:function(){return "<div>No solution... :'(</div>";},distanceC:"pas de solution... :'(",parent:s};
	
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
	this.position = [0,0]; //position courante
	
	taille=this.size;
	for(var i=0;i<taille;i++){
		this.tab[i]=[];
		for(var j=0;j<taille;j++){
			this.tab[i][j]=0;
		}
	}
}
game.prototype.del=function(x,y){
	this.tab[x][y]=0;
}

game.prototype.snapshot=function(){
	var tab=this.tab.copy();
	Game_shot.prototype.target=0;
	//postMessage({cmd:"solutionUpdate",done:done.length,tocompute:todo.length,distance:current.distanceC+"/"+current.distanceE});
	return new Game_shot(tab,this.position,0);
}

var jeu=new game();


/*
	Objet game_shot
*/
function Game_shot(tab,position,distanceC,parent){
	this.tab=tab||[]; //tableau représentant les pions
	this.position = position || [0,0];
	this.distanceC=distanceC||0; //cout actuel
	this.distanceE=this.estimate(); //distance total estimée pour atteindre la fin (cout actuel + estimation pour atteindre la fin)
	this.parent=parent||null; //objet parent

	// for cavalier optimisation
	this.tab.cost = this.distanceC;

	this.tab[position[0]][position[1]] = 1;
}
Game_shot.prototype.target=0; //position de l'arrivée

Game_shot.prototype.estimate=function(){
	var li=this.tab.length,lj,cmpt=0, dst = li * this.tab[0].length;
	while(li--){
		lj=this.tab[li].length;
		while(lj--){
			if(this.tab[li][lj]!==0) cmpt++;
		}
	}

	return this.distanceE= dst - cmpt +1;
}

Game_shot.prototype.verify_move=function(i,j){
	var li=this.tab.length,lj=this.tab[0].length;
	
	if (i<0 || i>= li) {
		return false;
	}
	if (j<0 || j>= lj) {
		return false;
	}

	if(this.tab[i][j] === 1){
		return false;
	}

	var n_grille=this.tab.copy();
	n_grille[i][j]=1;
	return new Game_shot(n_grille,[i,j],this.distanceC+1,this);
}

Game_shot.prototype.get_next=function(){
	var result=[],i,j,t,k;
	
	i = this.position[0]-2;
	j = this.position[1]-1;
	if(t=this.verify_move(i,j)){
		result.push(t);
	}

	i = this.position[0]-2;
	j = this.position[1]+1;
	if(t=this.verify_move(i,j)){
		result.push(t);
	}

	i = this.position[0]+2;
	j = this.position[1]-1;
	if(t=this.verify_move(i,j)){
		result.push(t);
	}

	i = this.position[0]+2;
	j = this.position[1]+1;
	if(t=this.verify_move(i,j)){
		result.push(t);
	}

	i = this.position[0]-1;
	j = this.position[1]-2;
	if(t=this.verify_move(i,j)){
		result.push(t);
	}

	i = this.position[0]-1;
	j = this.position[1]+2;
	if(t=this.verify_move(i,j)){
		result.push(t);
	}

	i = this.position[0]+1;
	j = this.position[1]-2;
	if(t=this.verify_move(i,j)){
		result.push(t);
	}

	i = this.position[0]+1;
	j = this.position[1]+2;
	if(t=this.verify_move(i,j)){
		result.push(t);
	}

	return result;
}


Game_shot.prototype.compare=function(tab){
	if (tab.cost !== this.tab.cost) {// one way game
		return false;
	}

	var lx=this.tab.length,ly=this.tab[0].length,x=-1,y;
	while(++x<lx){
		y=0;
		while(y<ly){
			if(this.tab[x][y]!==tab[x][y++]) return false;
		}
	}
	return true;
}


Game_shot.prototype.display=function(mode){
	var text='<table class="snapshot">',lx=this.tab.length,ly=this.tab[0].length,y=-1,x;
	var lst=["dehors2","vide2","plein2"];
	while(++y<ly){
		text+="<tr>";
		x=0;
		while(x<lx){
			text+="<td class=\""+lst[this.tab[x][y]+1]+"\">"+this.tab[x++][y]+"</td>";
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
}

Game_shot.prototype.Aetoile=function(){
	var todo=[],done=[],current=this,x=current.target[0],y=current.target[1],fils,i,trouver;
	var information=0,nbInformation=1000;
	while(current.distanceE>1 ){
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
}
