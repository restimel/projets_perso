(function(){
	var mode = 1,
		src1 = "",
		src2 = "",
		compteur = 0,
		info = 1;
	
	self = self || window;
	self.onmessage=function(e){
		mode = e.data.mode;
		src1 = e.data.src1.replace(/\r\n|\r/g,"\n");
		src2 = e.data.src2.replace(/\r\n|\r/g,"\n");
		compteur = 0;
		
		var rslt=compareSources();
		rslt.progress=100;
		self.postMessage(rslt);
		
		//effacement des données
		src1 = "";
		src2 = "";
		toCompare.liste=[];
	};

	function toCompare(index1,index2,history){
		this.s1 = index1;
		this.s2 = index2;
		this.history = history;
	}

	toCompare.liste = [];

	toCompare.prototype.search=function(){
		//var s1 = src1.substr(this.s1);
		//var s2 = src2.substr(this.s2);
		switch(mode){
			case "1": //comparaison par caractère
				//TODO
				console.warn("La comparaison par caractère n'est pas encore disponible");
				break;
			case "2": //comparaison par ligne
				var l1 = src1.split(/\n/).slice(this.s1);
				var l2 = src2.split(/\n/).slice(this.s2);
				var i=0,li=l1.length;
				if(compteur++%100 === 0){
						self.postMessage({
							progress:100-((l1.length+l2.length)*100/info),
							debug:"maj",
							compteur:compteur,
							thiss1:this.s1,
							thiss2:this.s2,
							l1:l1,
							//s1:s1,
							history:this.history
						});
					}
				do{
					if(l1[i] === l2[i]){
						//nb+=l1[i].length+1;
						continue;
					}
		//self.postMessage({debug:compteur+": "+this.s1+"|"+this.s2+" → "+l1.length+"/"+info+" → "+(l1.length/info),l1:l1,s1:s1});
					var txt1 = l1.filter(function(v,ind){return ind>i;}).join("\n");
					var txt2 = l2.filter(function(v,ind){return ind>i;}).join("\n");
					if(typeof l2[i] === "undefined") l2[i]="";
				
					//analyse supression
					history=this.history.concat([{type:"-",position:this.s1+i,old:l1[i],modif:""}]);
					if(txt1 == l2[i]+"\n"+txt2){
						return history;
					}
					toCompare.liste.push(new toCompare(this.s1+i+1,this.s2+i,history));
					//analyse addition
					history=this.history.concat([{type:"+",position:this.s1+i,old:"",modif:l2[i]}]);
					if(l1[i]+"\n"+txt1 == txt2){
						return history;
					}
					toCompare.liste.push(new toCompare(this.s1+i,this.s2+i+1,history));
					//analyse modification
					var history=this.history.concat([{type:"~",position:this.s1+i,old:l1[i],modif:l2[i]}]);
					if(txt1 == txt2){
						return history;
					}
					toCompare.liste.push(new toCompare(this.s1+i+1,this.s2+i+1,history));
				
					return false;
				}while(++i<li);
				if(li>l2.length){
					history=this.history.concat([{type:"+",position:this.s1+i,old:"",modif:l2.filter(function(v,ind){return ind>=i;}).join("\n")}]);
					return history;
				}
				break;
			default:
				console.warn("not done yet :'(");
		}
		return null;
	};


	function compareSources(){
		var cas,reponse=[];
		if(src1 !== src2){
			switch(mode){
				case "2":
					info=(src1.match(/\n/g)||"").length+(src2.match(/\n/g)||"").length+2;
					break;
			}
			
			toCompare.liste = [new toCompare(0,0,[])];
			do{
				cas = toCompare.liste.shift();
			}while(!(reponse=cas.search()));
		}
		return reponse;
	}

})();

