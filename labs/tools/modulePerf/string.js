var module = new Action("String","Concatenate","Concatenation","Concatenate Strings",null,200000);
module.add(string_concatenateOperator,'+ operator',1);
module.add(string_concatenateArray,'Array.join("")',1);


function string_concatenateOperator(nbl){
	var rslt = "",text="12345678";
	while(nbl--){
		rslt += text;
	}
	return rslt;
}

function string_concatenateArray(nbl){
	var rslt = new Array(nbl),i=0,text="12345678";
	while(nbl--){
		rslt[i++] = text;
	}
	return rslt.join("");
}
