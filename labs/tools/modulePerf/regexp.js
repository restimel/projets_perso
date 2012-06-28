(function(){
	var module = new Action("RegExp","regexpCreation","RegExp creation","Creation of a new RegExp",null,200000);
	module.add(regexp_literal,'/toto/g',1);
	module.add(regexp_string,'new RegExp("toto","g")',1);
	
	function regexp_literal(nbl){
		var reg;
		while(nbl--){
			reg = /toto/g;
		}
		return reg;
	}
	
	function regexp_string(nbl){
		var reg;
		while(nbl--){
			reg = new RegExp("toto","g");
		}
		return reg;
	}

})()

//TODO mettre dans un autre fichier
(function(){	
	var module = new Action("Date","get Date","get current Date","Get a timestamp of the current time",null,100000);
	module.add(date_now,'Date.now()',1);
	module.add(date_new_getTime,'new Date().getTime()',1);
	module.add(date_valueof,'new Date().valueOf()',1);
	module.add(date_new_getTime2,'d=new Date();d.getTime()',10);
	module.add(date_valueof2,'d=new Date();d.valueOf()',10);
	
	
	function date_new_getTime(nbl){
		var rslt;
		while(nbl--){
			rslt = new Date().getTime();
		}
		return rslt;
	}
	
	function date_new_getTime2(nbl){
		var rslt,d=new Date();
		while(nbl--){
			rslt = d.getTime();
		}
		return rslt;
	}
	
	function date_now(nbl){
		var rslt;
		while(nbl--){
			rslt = Date.now();
		}
		return rslt;
	}
	
	function date_valueof(nbl){
		var rslt;
		while(nbl--){
			rslt = new Date().valueOf();
		}
		return rslt;
	}
	
	function date_valueof2(nbl){
		var rslt,d=new Date();
		while(nbl--){
			rslt = d.valueOf();
		}
		return rslt;
	}
})()
	
