//gère la transformation du code JS dans la page en code HTML
function codeColorisation(){
	var liste = document.querySelectorAll("code.JavaScript"),
		i,
		li=liste.length,
		elem;
	
	for(i=0;i<li;i++){
		elem = liste[i];
		elem.innerHTML = color(elem.innerHTML.replace(/^\s+|\s+$/g,"").replace(/&(?:[gl]t|amp);/g,function(m){
			//sert à afficher correctement les <, > et & (pbl lié au innerHTML)
			switch(m){
				case "&amp;": return "&";
				case "&gt;": return ">";
				case "&lt;": return "<";
			}
		}),false);
		elem.className = "codeJS";
	}
	
	liste = document.querySelectorAll("samp.JavaScript");
	li=liste.length;
	for(i=0;i<li;i++){
		elem = liste[i];
		elem.innerHTML = color(elem.innerHTML,false);
		elem.className = "miniCodeJS";
	}
}

/**
	écrit la syntaxe permettant de colorier la source
	Script original : http://b.mariat.free.fr/tools/jsColor.htm
	author : Benoit Mariat
**/
function color(source,inline){
	"use strict";
	var rslt="",
		i=0,
		li=source.length,
		part="",
		car="",
		special="",
		mode="";
	
	var classes={ //not used here
		notFound : ""
	};
	
	var liste_classes = {};
	
	//permet d'enlever le dernier caractère à la partie étudiée
	function pop(){
		if(part.length === 0) return;
		part = part.substring(0,part.length-1);
	}
	
	//ajoute une classe autour de la partie éctuellement étudiée
	function add(cl,noClear){
		if(part === "") return;
		var r = '<span ';
		if(inline){
			r += 'style="'+(classes[cl]||'')+'">';
		}else{
			r += 'class="'+cl+'">';
			liste_classes[cl]=true;
		}
		r += safeHTML(part)+'</span>';
		if(!noClear){
			rslt+=r;
			part = "";
		}else{
			return r;
		}
	}
	
	//vérifie si la partie étudiée est particulière
	function verify(flush,noClear){
		if(part.length === 1) return;
		pop();
		switch(part){ //recherche de mot clef
			case "break":
			case "case":
			case "catch":
			case "continue":
			case "debugger":
			case "default":
			case "delete":
			case "do":
			case "else":
			case "finally":
			case "for":
			case "function":
			case "if":
			case "in":
			case "instanceof":
			case "new":
			case "return":
			case "switch":
			case "this":
			case "throw":
			case "try":
			case "typeof":
			case "var":
			case "void":
			case "while":
			case "with":
				add("reservedWord",noClear);
				break;
			case "class":
			case "const":
			case "enum":
			case "export":
			case "extends":
			case "import":
			case "super":
			case "implements":
			case "interface":
			case "let":
			case "package":
			case "private":
			case "protected":
			case "public":
			case "static":
			case "yield":
				add("futureReservedWord",noClear);
				break;
			case "true":
			case "false":
				add("boolean",noClear);
				break;
			case "undefined":
			case "null":
				add("null",noClear);
				break;
			case "setTimeout":
			case "setTinterval":
			case "alert":
			case "parseInt":
			case "parseFloat":
				add("commonMethod",noClear);
				break;
			case "window":
			case "document":
			case "console":
			case "self":
			case "Math":
			case "Date":
				add("commonObject",noClear);
				break;
			case "Infinity":
			case "NaN":
				add("number",noClear);
				break;
			default:
				if(/^[+-]?(?:[0-9]*?\.)?[0-9]+(?:[eE][+-]?[0-9]+)?$|^0[xX][0-9a-fA-F]+?$/.test(part)){
					add("number",noClear);
				}
		}
		if(flush && part){
			rslt += part;
			part = "";
		}
		part += car;
	}
	
	
	for(i=0;i<li;i++){
		car = source.charAt(i);
		part+=car;
		
		if(special === "\\"){
			special=""; //TODO \u0000
			continue;
		}
		
		switch(mode){
			case '"': //dans une chaine de caractère (commençant par ")
				switch(car){
					case "\\":
						special = car;
						break;
					case '"':
						if(part === '"use strict"' && /(?:^|[;\r\n])\s*?$/.test(source.substring(0,i-part.length+1)) && /(^\s*?[;\r\n])/.test(source.substring(i+1))){
							add("useStrict");
						}else{
							add("string1");
						}
						mode = "";
						break;
					default:
				}
				break;
			case "'": //dans une chaine de caractère (commençant par ')
				switch(car){
					case "\\":
						special = car;
						break;
					case "'":
						if(part === "'use strict'" && /(?:^|[;\r\n])\s*?$/.test(source.substring(0,i-part.length+1)) && /(^\s*?[;\r\n])/.test(source.substring(i+1))){
							add("useStrict");
						}else{
							add("string2");
						}
						mode = "";
						break;
					default:
				}
				break;
			case "//":
				if(/[\r\n\0]/.test(car)){
					add("comment1");
					mode="";
				}
				break;
			case "/*":
				if(car === "/" && /^\/\*[\s\S]*?\*\/$/.test(part)){
					add("comment2");
					mode="";
				}
				break;
			case "/**":
				if(car === "/"){
					if(/^\/\*\*[\s\S]*?[^*][\s\S]*?\*\*\/$/.test(part)){
						add("comment3");
						mode="";
					}else if(/\*\/$/.test(part)){
						add("comment2");
						mode="";
					}//sinon c'est qu'il s'agit d'un / perdu au milieu d'un commentaire
				}
				break;
			case "regexp":
				switch(car){
					case "\\":
						special=car;
						break;
					case "[":
						mode="r[";
						break;
					case "/":
						add("regexp");
						mode="rflag";
						break;
				}
				break;
			case "r[":
				switch(car){
					case "\\":
						special=car;
						break;
					case "]":
						mode="regexp";
						break;
				}
				break;
			case "rflag":
				if(/[^a-z]/i.test(car)){
					pop();
					add("regexpFlag");
					i--; //afin de reparser ce caractère
					mode="";
				}
				break;
			default:
				switch(car){
					case "\\":
						special=car;
						break;
					case " ": //espace
					case "	": //tabulation
					case "\n": //saut de ligne
					case "\r": //saut de ligne
					case "(":
					case ")":
					case "[":
					case "]":
					case "{":
					case "}":
					case ",":
					case ";":
						verify(true); //vérifie la partie précédente s'il s'agit d'un mot clef
						rslt += part;
						part="";
						break;
					case '"':
						mode = '"';
						special="";
						break;
					case "'":
						mode = "'";
						special="";
						break;
					case "+":
					case "-":
					case "*":
					case "<":
					case ">":
					case "=":
					case "!":
					case "%":
					case "&":
					case "|":
					case "^":
					case "~":
					case "?":
					case ":":
						verify(true);
						add("operator");
						break;
					case ".":
						if(/[\d\s]/.test(source.charAt(i+1)) && /[\s([{<>=!%|?:;,/+*-]/.test(source.charAt(i-1))){
						//nombre
						}else{
							verify(true);
							add("operator");
						}
						break;
					case "/":
						switch(source.charAt(i+1)){ //vérification du caractère suivant
							case "/":
								verify(true);
								mode="//";
								break;
							case "*":
								verify(true);
								if(source.charAt(i+2) === "*"){
									mode="/**";
								}else{
									mode="/*";
								}
								break;
							default:
								verify(true);
								if(/^.+\//.test(source.substring(i+1))){
									mode="regexp";
								}else{
									add("operator");
								}
						}
						break;
				}
		}
	}
	
	part+=" ";
	verify();
	pop();
	rslt += part;
	
	return btfyHTML(rslt);
	
	function safeHTML(src){
		src = src.replace(/&/g,"&amp;");
		src = src.replace(/</g,"&lt;");
		return src;
	}
	function btfyHTML(src){
		src = src.replace(/\r\n|[\r\n]/g,"<br>\n");
		src = src.replace(/\t/g,"&emsp;&emsp;&emsp;&emsp;");
		src = src.replace(/  /g," &nbsp;")
		return src;
	}
}

//initialisation pour la colorisation des codes
window.addEventListener("load",codeColorisation,false);


//initialisation pour le fallback de navigateurs ne supportant pas les balises details/summary
window.addEventListener("load",function(){
	var liste,i,li;
	
	if(typeof document.querySelector("details").open === "undefined"){
		//la balise HTML5 details n'est pas connue
		liste = document.querySelectorAll("summary");
		i=0;
		li=liste.length;
		while(i<li){
			liste[i].onclick=openSwitch;
			liste[i++].className="detailsClosed";
		}
	}
	
	//fonction permettant d'afficher ou de cacher le details
	function openSwitch(){
		if(this.className==="detailsClosed"){
			this.className="detailsOpen";
		}else{
			this.className="detailsClosed";
		}
	}
},false);


//initialisation pour identifier le tutoriel et proposer les chapitres suivant/précédent
window.addEventListener("load",function(){
	var page = window.location.pathname.replace(/^.*\/([^/?#]+\.html).*/,"$1"),
		lien = document.querySelector('a[href="./'+page+'"]'),
		liens = Array.prototype.slice.call(document.querySelectorAll("nav>ol>li>a,nav>ol>li>ol>li>a")),
		suivant = liens[liens.indexOf(lien)+1],
		precedent = liens[liens.indexOf(lien)-1],
		footer = document.querySelector("body>footer"),
		elem;
	lien.className="current";
	
	//précédent
	elem = document.createElement("a");
	if(precedent){
		elem.textContent = "Chapitre précédent : "+precedent.textContent;
		elem.href = precedent.href;
	}else{
		elem.textContent = "Chapitre précédent : aucun";
		elem.disabled = true;
	}
	elem.className = "lienPrecedent";
	footer.appendChild(elem);
	
	//suivant
	elem = document.createElement("a");
	if(suivant){
		elem.textContent = "Chapitre suivant : "+suivant.textContent;
		elem.href = suivant.href;
	}else{
		elem.textContent = "Chapitre suivant : aucun";
		elem.disabled = true;
	}
	elem.className = "lienSuivant";
	footer.appendChild(elem);

},"false");
