
var module = new Action("regexpCreation","Creation of a new RegExp",null,200000);
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
