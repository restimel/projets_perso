(function(){
	var mode = 1,
		src1 = "",
		src2 = "";
	
	self = self || window;
	self.onmessage=function(e){
		mode = e.data.mode;
		src1 = e.data.src1.replace(/\r\n|\r/g,"\n");
		src2 = e.data.src2.replace(/\r\n|\r/g,"\n");
		self.postMessage(compareSources());
	};

	function toCompare(index1,index2,history){
		this.s1 = index1;
		this.s2 = index2;
		this.history = history;
	}

	toCompare.liste = [];

	toCompare.prototype.search=function(){
		var s1 = src1.substr(this.s1);
		var s2 = src2.substr(this.s2);
		var nb=0;
		switch(mode){
			case "1": //comparaison par caractère
				//TODO
				console.warn("La comparaison par caractère n'est pas encore disponible");
				break;
			case "2": //comparaison par ligne
				var l1 = s1.split(/\r\n|\n|\r/);
				var l2 = s2.split(/\r\n|\n|\r/);
				var i=0,li=l1.length;
				do{
					if(l1[i] === l2[i]){
						//nb+=l1[i].length+1;
						continue;
					}
					var txt1 = l1.filter(function(v,ind){return ind>i;}).join("\n");
					var txt2 = l2.filter(function(v,ind){return ind>i;}).join("\n");
					if(typeof l2[i] === "undefined") l2[i]="";
				
					//analyse supression
					history=this.history.concat([{type:"-",position:i,old:l1[i],modif:""}]);
					if(txt1 == l2[i]+"\n"+txt2){
						return history;
					}
					toCompare.liste.push(new toCompare(this.s1+nb+l1[i].length+1,this.s2+nb,history));
					//analyse addition
					history=this.history.concat([{type:"+",position:i,old:"",modif:l2[i]}]);
					if(l1[i]+"\n"+txt1 == txt2){
						return history;
					}
					toCompare.liste.push(new toCompare(this.s1+nb,this.s2+nb+l2[i].length+1,history));
					//analyse modification
					var history=this.history.concat([{type:"~",position:i,old:l1[i],modif:l2[i]}]);
					if(txt1 == txt2){
						return history;
					}
					toCompare.liste.push(new toCompare(this.s1+nb+l1[i].length+1,this.s2+nb+l2[i].length+1,history));
				
					return false;
				}while(++i<li);
				history=this.history.concat([{type:"+",position:i,old:"",modif:l2.filter(function(v,ind){return ind>=i;}).join("\n")}]);
				return history;
				break;
			default:
				console.warn("not done yet :'(");
		}
		return null;
	};


	function compareSources(){
		var cas,reponse=[];
		if(src1 !== src2){
			toCompare.liste = [new toCompare(0,0,[])];
			do{
				cas = toCompare.liste.shift();
			}while(!(reponse=cas.search()));
		}
		return reponse;
	}

})();

