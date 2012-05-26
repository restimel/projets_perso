
var module = new Action("DOM","domAddEnd","Element creation at the end","Add a new HTML element at the end",initZoneTest,10000);
module.add(domCreate_appendChild_simple,'span=document.createElement("span");el.appendChild(span);',1);
module.add(domCreate_appendChild2_simple,'el.appendChild(document.createElement("span"));',1);
module.add(domCreate_innerHTML1_simple,'el.innerHTML+="&lt;span>&lt;/span>";',0.02);
module.add(domCreate_innerHTML2_simple,'txt+="&lt;span>&lt;/span>";el.innerHTML=txt;',1);
module.add(domCreate_appendChild_complexe,'createElement(); el.id; el.className; el.name; el.textContent; appendChild()',0.5);
module.add(domCreate_innerHTML2_complexe,'txt+="&lt;span id="test" class="testElement" name="nameTest" >content&lt;/span>"; innerHTML=txt;',0.5);

module = new Action("DOM","domAddStart","Element creation at the begining","Add a new HTML element at the beginning",initZoneTest,10000);
module.add(domCreate_inserBefore_simple,'span=document.createElement("span");el.insertbefore(span,prevSpan);',1);
module.add(domCreate_innerHTML3_simple,'txt="&lt;span>&lt;/span>"+txt;el.innerHTML=txt;',0.1);
module.add(domCreate_innerHTML4_simple,'el.innerHTML="&lt;span>&lt;/span>"+el.innerHTML',0.02);
module.add(domCreate_inserBefore_complexe,'createElement(); el.id; el.className; el.name; el.textContent; insertBefore()',0.5);
module.add(domCreate_innerHTML3_complexe,'txt="&lt;span id="test" class="testElement" name="nameTest" >content&lt;/span>" +text; el.innerHTML=txt;',0.5);
	
module = new Action("DOM","domSelector","Element reading","Access to an HTML element",addZoneTest,100000);
module.add(domRead_getElementById,'getElementById("id")',1);
module.add(domRead_querySelector_id,'querySelector("#id")',0.5);
module.add(domRead_getElementsByName,'getElementsByName("name")',1);
module.add(domRead_querySelector_name,'querySelector("*[name="name"]")',0.1);
module.add(domRead_getElementsByTagName,'getElementsByTagName("name")',1);
module.add(domRead_querySelectors_tagName,'querySelectorAll("tagName")',0.1);
module.add(domRead_getElementsByClassName,'getElementsByClassName("className")',1);
module.add(domRead_querySelectors_className,'querySelectorAll(".className")',0.1);
	
module = new Action("DOM","domRemove","Element destruction","Remove HTML elements",addFullZoneTest,10000);
module.add(domRemove_innerHTML,'innerHTML=""',1);
module.add(domRemove_removeChild1,'removeChild(firstChild)',1);
module.add(domRemove_removeChild2,'removeChild(lastChild)',1);

module = new Action("DOM","domText","Text modification","Modification of content",null,10000);

function domCreate_innerHTML1_simple(nbl,zone){
	while(nbl--){
		zone.innerHTML+="<span></span>";
	}
	return zone;
}

function domCreate_innerHTML2_simple(nbl,zone){
	var text="";
	while(nbl--){
		text+="<span></span>";
	}
	zone.innerHTML=text;
	return zone;
}

function domCreate_appendChild_simple(nbl,zone){
	var elem;
	while(nbl--){
		elem = document.createElement("span");
		zone.appendChild(elem);
	}
	return zone;
}

function domCreate_appendChild2_simple(nbl,zone){
	while(nbl--){
		zone.appendChild(document.createElement("span"));
	}
	return zone;
}

function domCreate_innerHTML2_complexe(nbl,zone){
	var text="";
	while(nbl--){
		text+='<button id="test'+nbl+'" class="testElement" name="nameTest'+nbl+'">un peu de contenu</button>';
	}
	zone.innerHTML=text;
	return zone;
}

function domCreate_appendChild_complexe(nbl,zone){
	var elem;
	while(nbl--){
		elem = document.createElement("button");
		elem.id='test'+nbl;
		elem.className='testElement';
		elem.name='nameTest'+nbl;
		elem.textContent='un peu de contenu';
		zone.appendChild(elem);
	}
	return zone;
}

function domCreate_innerHTML3_simple(nbl,zone){
	var text="";
	while(nbl--){
		text='<span></span>'+text;
	}
	zone.innerHTML=text;
	return zone;
}

function domCreate_innerHTML4_simple(nbl,zone){
	var text="";
	while(nbl--){
		zone.innerHTML='<span></span>'+zone.innerHTML;
	}
	return zone;
}

function domCreate_innerHTML3_complexe(nbl,zone){
	var text="";
	while(nbl--){
		text='<span id="test'+nbl+'" class="testElement" name="nameTest'+nbl+'">un peu de contenu</span>'+text;
	}
	zone.innerHTML=text;
	return zone;
}

function domCreate_inserBefore_simple(nbl,zone){
	var elem,oldElem=document.createElement("span");
	zone.appendChild(oldElem);
	while(nbl--){
		elem = document.createElement("span");
		zone.insertBefore(elem,oldElem);
		oldElem=elem;
	}
	return zone;
}

function domCreate_inserBefore_complexe(nbl,zone){
	var elem,oldElem=document.createElement("span");
	zone.appendChild(oldElem);
	while(nbl--){
		elem = document.createElement("span");
		elem.id='test'+nbl;
		elem.className='testElement';
		elem.name='nameTest'+nbl;
		elem.textContent='un peu de contenu';
		zone.insertBefore(elem,oldElem);
		oldElem=elem;
	}
	return zone;
}

function domRead_getElementById(nbl,element){
	var elem,id=element.id;
	while(nbl--){
		elem = document.getElementById(id);
	}
	return elem;
}

function domRead_getElementsByTagName(nbl,element){
	var elem,tagName=element.tagName;
	while(nbl--){
		elem = document.getElementsByTagName(tagName);
	}
	return elem;
}

function domRead_getElementsByName(nbl,element){
	var elem,name=element.name;
	while(nbl--){
		elem = document.getElementsByName(name);
	}
	return elem[0];
}

function domRead_getElementsByClassName(nbl,element){
	var elem,clName=element.className;
	while(nbl--){
		elem = document.getElementsByClassName(clName);
	}
	return elem;
}

function domRead_querySelector_id(nbl,element){
	var elem,id="#"+element.id;
	while(nbl--){
		elem = document.querySelector(id);
	}
	return elem;
}

function domRead_querySelector_name(nbl,element){
	var elem,name='*[name="'+element.name+'"]';
	while(nbl--){
		elem = document.querySelector(name);
	}
	return elem;
}

function domRead_querySelectors_tagName(nbl,element){
	var elem,name=element.tagName;
	while(nbl--){
		elem = document.querySelectorAll(name);
	}
	return elem;
}

function domRead_querySelectors_className(nbl,element){
	var elem,clName='.'+element.className;
	while(nbl--){
		elem = document.querySelectorAll(clName);
	}
	return elem;
}

function domRemove_removeChild1(nbl,element){
	while(nbl--){
		element.removeChild(element.firstChild);
	}
	return element;
}

function domRemove_removeChild2(nbl,element){
	while(nbl--){
		element.removeChild(element.lastChild);
	}
	return element;
}

function domRemove_innerHTML(nbl,element){
	element.innerHTML="";
	return element;
}

