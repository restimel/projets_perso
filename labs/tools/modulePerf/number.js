
var module = new Action("Number","Modulo","Modulo calculation","Calculation of modulo",null,1000000);
module.add(number_modulo,'12345678 % 256',1);
module.add(number_etBinaire,'12345678 & 255',1);
module.add(number_modulo2,'12345678 % 2',1);
module.add(number_etBinaire2,'12345678 & 1',1);

function number_modulo(nbl){
	var rslt,nb=12345678,mod=256;
	while(nbl--){
		rslt = nb % mod;
	}
	console.log(rslt);
	return rslt;
}

function number_modulo2(nbl){
	var rslt,nb=12345678,mod=2;
	while(nbl--){
		rslt = nb % mod;
	}
	console.log(rslt);
	return rslt;
}

function number_etBinaire(nbl){
	var rslt,nb=12345678,mod=255;
	while(nbl--){
		rslt = nb & mod;
	}
	console.log(rslt);
	return rslt;
}

function number_etBinaire2(nbl){
	var rslt,nb=12345678,mod=1;
	while(nbl--){
		rslt = nb & mod;
	}
	console.log(rslt);
	return rslt;
}
