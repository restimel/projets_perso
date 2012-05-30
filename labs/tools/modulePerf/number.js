var module = new Action("Number","Floor","Round number : Floor","Round number to the less integer (floor method)",null,10000000);
module.add(number_floor1,'Math.floor(12.34)',1);
module.add(number_floor2,'floor(12.34)',1);
module.add(number_notnot,'~~12.34',1);
module.add(number_or0,'12.34|0',1);
module.add(number_round1,'Math.round(12.34)',1);
module.add(number_round2,'round(12.34)',1);
module.add(number_parseInt1,'parseInt(12.34)',1);

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
	return rslt;
}

function number_modulo2(nbl){
	var rslt,nb=12345678,mod=2;
	while(nbl--){
		rslt = nb % mod;
	}
	return rslt;
}

function number_etBinaire(nbl){
	var rslt,nb=12345678,mod=255;
	while(nbl--){
		rslt = nb & mod;
	}
	return rslt;
}

function number_etBinaire2(nbl){
	var rslt,nb=12345678,mod=1;
	while(nbl--){
		rslt = nb & mod;
	}
	return rslt;
}

function number_floor1(nbl){
	var rslt,nb=12.34;
	while(nbl--){
		rslt = Math.floor(nb);
	}
	return rslt;
}

function number_floor2(nbl){
	var rslt,nb=12.34,floor=Math.floor;
	while(nbl--){
		rslt = floor(nb);
	}
	return rslt;
}

function number_notnot(nbl){
	var rslt,nb=12.34;
	while(nbl--){
		rslt = ~~nb;
	}
	return rslt;
}

function number_or0(nbl){
	var rslt,nb=12.34;
	while(nbl--){
		rslt = nb|0;
	}
	return rslt;
}

function number_parseInt1(nbl){
	var rslt,nb=12.34;
	while(nbl--){
		rslt = parseInt(nb);
	}
	return rslt;
}

function number_round1(nbl){
	var rslt,nb=12.34;
	while(nbl--){
		rslt = Math.round(nb);
	}
	return rslt;
}

function number_round2(nbl){
	var rslt,nb=12.34,round=Math.round;
	while(nbl--){
		rslt = round(nb);
	}
	return rslt;
}