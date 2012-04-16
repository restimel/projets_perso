function updateCSS(event,elemOrig){
	var elem=document.getElementById("BSoutputModify");
	elemOrig=elemOrig||this;
	elem.value=elemOrig.value;
	elem.onblur=function(){
		var vl=elem.value,v;
		elemOrig.style.display="inline";
		elem.style.display="none";
		vl=vl.split(/(^[^,]+),?/);
		v=vl[1];
		document.getElementById("BScss").value=vl[2]||"";
		v=v.split(/\s+/);
		if(v.length===5 || (v.length===6 && v[0]==="inset")){
			var i=0;
			if(v.length===6){
				document.getElementById("BSinside").checked=true;
				i++;
			}else{
				document.getElementById("BSinside").checked=false;
			}

			document.getElementById("BSoffsetX").value=parseFloat(v[i]);
			document.getElementById("BSoffsetXUnit").value=v[i].split(/([%a-z]+)/)[1];
			i++;
			document.getElementById("BSoffsetY").value=parseFloat(v[i]);
			document.getElementById("BSoffsetYUnit").value=v[i].split(/([%a-z]+)/)[1];
			i++;
			document.getElementById("BSblur").value=parseFloat(v[i]);
			document.getElementById("BSblurUnit").value=v[i].split(/([%a-z]+)/)[1];
			i++;
			document.getElementById("BSspread").value=parseFloat(v[i]);
			document.getElementById("BSspreadUnit").value=v[i].split(/([%a-z]+)/)[1];
			i++;
			document.getElementById("BScolor").value=v[i];
		}
		changeCSS();
	}
	elem.style.display="inline";
	elemOrig.style.display="none";
	elem.focus();
	event.preventDefault();
	return false;
}

function changeCSS(slider){
	var element=document.getElementById("test"),
		origCSS=document.getElementById("BScss").value,
		inside=document.getElementById("BSinside").checked?"inset ":"",
		offsetX=parseFloat(document.getElementById("BSoffsetX").value),
		offsetY=parseFloat(document.getElementById("BSoffsetY").value),
		blur=parseFloat(document.getElementById("BSblur").value),
		spread=parseFloat(document.getElementById("BSspread").value),
		color=document.getElementById("BScolor").value,
		result="";

	//traitement d'une ou de valeur(s) déjà définie(s) pour box-shadow
	origCSS=origCSS.replace(/^\s+|box-shadow| ?: ?|\s+$/g,""); //trim + suppression d'un éventuel "box-shadow :"
	if(origCSS){
		origCSS=","+origCSS;
	}else{
		origCSS="";
	}

	//création du code CSS
	result=inside+offsetX+document.getElementById("BSoffsetXUnit").value+" "+offsetY+document.getElementById("BSoffsetYUnit").value+" "+blur+document.getElementById("BSblurUnit").value+" "+spread+document.getElementById("BSspreadUnit").value+" "+color+origCSS;

	//affichage du résultat
	document.getElementById("BSoutput").value=result;
	element.style.boxShadow=result;
}

function changeTest(){
//permet de changer l'environnement
	var element = document.getElementById("test");
	var global = document.getElementById("global");
	element.style.cssText=document.getElementById("BxCSS").value;
	element.style.backgroundColor=document.getElementById("BGboxColor").value;
	element.style.borderColor=document.getElementById("BGboxBorder").value;
	global.style.backgroundColor=document.getElementById("BGbgColor").value;
	global.style.color=document.getElementById("BGcolor").value;
	element.innerHTML=document.getElementById("BxText").value.replace(/\r\n|\n|\r/g,"<br>");
	changeCSS();
}
changeCSS();
