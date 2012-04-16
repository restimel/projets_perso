/***
labs.js

Author: Benoit Mariat (b.mariat@gmail.com)
Date: November 2010

License: You are free to use, share, redistribute and modify it if you keep all authors and contributors names. ( http://creativecommons.org/licenses/by/3.0/)

Vous êtes autorisés à utiliser, partager, redistribuer et modifier ce code tant que vous gardez les noms des auteurs et contributeurs. (http://creativecommons.org/licenses/by/3.0/deed.fr)


Content: functions to manage effects in menu and function to call demo scripts
Original file: http://b.mariat.free.fr/javascript/labs/labs.js

	(')_(')
	( °-° )
	(__.__)
	(") (")

***/

(function (){
//gestion du menu

	/*
	*
	*	Fonctions permettant d'assurer la compatibilité entre les navigateurs
	*
	*/
	if(typeof addEvent === "undefined"){
	//pour gérer la compatibilité avec IE (qui ne gère pas addEventListener) pour ajouter des listener
		function addEvent(elem,event,f,capture){
			if(elem.addEventListener){
				elem.addEventListener(event,f,(typeof capture === "boolean")?capture:true);
			}else if(elem.attachEvent){
				elem.attachEvent('on' + event,f);
			}else{}
		}
	}

	if(typeof runEvent === "undefined"){
	//pour gérer la compatibilité avec IE pour exécuter un événements
		function runEvent(elem,event){
			if(document.dispatchEvent){ // W3C
				switch(event){
					case "click":case "mouseover":case "mouseout":case "mousedown":case "mouseup":case "mousemove":case "dblclick":
						//cas événements souris
						var oEvent = document.createEvent( "MouseEvents" );
						oEvent.initMouseEvent("click", true, true,window, 1, 1, 1, 1, 1, false, false, false, false, 0, elem);
						elem.dispatchEvent( oEvent );
						break;
					//TODO more case
					default:
					//on essaie ce qu'on peut
					elem["on"+event]();
				}
			}
			else if(elem.fireEvent){
				//IE
				elem.fireEvent("on"+event);
			}
			else{
				//on essaie ce qu'on peut :)
				elem["on"+event]();
			}
		}
	}

	if(typeof Array.prototype.indexOf === "undefined"){
	//pour gérer la compatibilité avec IE qui ne connait pas indexOf
		Array.prototype.indexOf= function(obj){
			var i=-1,li=this.length;
			while(++i<li && this[i]!==obj){}
			return i==li?-1:i;
		}
	}

	if(typeof Array.prototype.lastIndexOf === "undefined"){
	//pour gérer la compatibilité avec IE qui ne connait pas lastIndexOf
		Array.prototype.lastIndexOf= function(obj){
			var i=this.length;
			while(i-- && this[i]!==obj){}
			return i;
		}
	}

	/**
	*	init(effetMenu,actionLien)
	*
	*		permet d'initialiser les menus en appliquant les fonctions aux éléments
	*
	*		@effetMenu: fonction à appliquer sur les menus lorsqu'on clique sur un élément de menu
	*		@actionLien: fonction à lancer lorsqu'on choisi une option qui possède un lien
	**/
	function init(effetMenu,actionLien){
		var liste_menu=document.getElementsByTagName("menu"),i=liste_menu.length,titre;
		while(--i){
			titre=liste_menu[i].getElementsByTagName("header")[0]; //lien sur le titre de ce menu

			//ajout de l'effet d'affichage de la description
			addEvent(liste_menu[i],"mouseover",descriptionMenu(1));
			addEvent(liste_menu[i],"mouseout",descriptionMenu(0));
			
			//ajout de l'effet de menu
			if(liste_menu[i].getElementsByTagName("menu").length){
				addEvent(titre,"click",effetMenu);
			}
			//ajout de l'effet "lien"
			if(titre.getElementsByTagName("a").length){
				addEvent(titre,"click",actionLien);
			}
		}

		addEvent(window,"resize",resize);
		resize();//replace les objets à la bonne place/taille
		if(document.body.clientHeight===0){
			setTimeout(resize,1000); //au cas où ça n'aurait pas marcher on le retente dans 1s //TODO s'assurer que ce cas ne devrait pas plutôt être tester dans resize
		}
	}

	/**
	*	lien(event)
	*
	*		permet de charger la page correspondant à l'élément déclencheur
	*
	*		@event: évènement déclencheur
	**/
	var lien=function(){
		var oldActif=null;
		return function(event){
			//TODO lorsqu'on charge une page mettre ce lien dans l'url grace au pushURL HTML5 ou le truc dans ce genre (voir diveintoHTML5)
		//charge le lien dans le div central
			event=event||window.event;
			var cible=event.currentTarget||( ((event.target||event.srcElement).nodeName==="A"&&(event.target||event.srcElement).parentNode) || (event.target||event.srcElement) ), // si cette ligne est si compliqué c'est pour gérer les navigateurs qui ne gère pas event.currentTarget comme IE
				contenu=cible.innerHTML.replace(/^.*?(?:<a\s.*?href="([^"]*)".*?>(.*?)<\/a>.*)?$/i,'$1"</$2').split('"</'),
				titre=contenu[1]||cible.textContent||cible.innerText;

			descriptionMenu(titre, cible);
			if(contenu[0]){
				//il y a un lien
			
				if(oldActif && oldActif.classList) oldActif.classList.remove("actif");
				oldActif=cible.parentNode;
				if(oldActif.classList){
					oldActif.classList.add("actif");
				}

				var xhr = null;
				if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				}else if (window.ActiveXObject) {
					try {
						xhr = new ActiveXObject("Msxml2.XMLHTTP");
					} catch(e) {
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					}
				}else{
					// le navigateur ne supporte pas l'AJAX on lance le lien
					if(cible!==(event.target||event.srcElement)){
						return true; //on laisse le lien se lancer normalement
					}else{
						//on change l'url...
						window.location.href=contenu[0];
						return true;
					}
				}

				xhr.onreadystatechange = function() {
					switch(xhr.readyState){
						case 3: //chargement en cours
							document.getElementById("labsChargement").style.display="block";
							break;
						case 4: //chargement fini
							document.getElementById("labsChargement").style.display="none";
							if(xhr.status !== 200 && xhr.status !== 0){
								//une erreur est apparue
								alert("Problem Error "+xhr.status+"...\nThe script could not be loaded there, sorry.");
							}else{
								//chargement réussi
							
								//on change l'adresse dans la barre d'adresse
								if(history.pushState){
									//history.pushState(null, titre, contenu[0]); //TODO uncomment
									//TODO popstate https://developer.mozilla.org/en/DOM/window.onpopstate
									//lecture: https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history
								}
							
								var texte=xhr.responseText;
								document.getElementById("labsDemo").innerHTML=texte; //insertion du HTML

								if(~texte.indexOf("<script")){
									//insertion des scripts javascript
									var jscripts=texte.split(/(<script[\s\S]*?<\/\s?script>)/),
										path=contenu[0], //le chemin pour accéder aux fichiers
										i=-1,
										li,jscript;
									jscripts.pop();
									jscripts.shift();
									li=jscripts.length;

									if(~path.indexOf("/")){
										path=path.substr(0,path.lastIndexOf("/")+1);
									}else{
										path="./";
									}
									
									//exécution du javascript contenu dans la page ou lié à la page
									while(++i<li){
										if(!~jscripts[i].indexOf("<script")){
											//ce morceau ne contient pas de script
											continue;
										}
										jscript=(/src\s?=\s?"(.*?)"|>\s*([\s\S]*)\s*<\/\s?script>$/i).exec(jscripts[i]);
										if(!jscript){
											continue;
										}else if(jscript[1]){
											//Cas d'un fichier javascript lié à la page
											(function(){
												var elem=document.createElement("script");
												elem.type="text/javascript";
												elem.src=path+jscript[1];
												elem.onload=function(){document.body.removeChild(elem);};
												elem.onerror=function(){document.body.removeChild(elem);alert("There is a problem to load the javascript :(");};
												document.body.appendChild(elem);
											})();
										}else if(jscript[2]){
											//Cas d'un code javascript inclus dans la page
											if(texte.match(/<[^>]+\son[a-z]+=["']/i)){
												console.warn("La page "+contenu[0]+" contient un script inline avec des événements sur des balises HTML. Ces événements peuvent ne pas fonctionner !");
											}
											try{
												eval(jscript[2]);
											}catch(e){
												console.error("Du code javascript inline dans la page "+contenu[0]+" n'a pas pu être exécutée correctement:\n"+e);
											}
										}
									}//while
								}
							}
							break;
					}//switch
				};

				xhr.open("GET", contenu[0], true);
				xhr.send(null);

				if(event.stopPropagation) event.stopPropagation();
				if(event.preventDefault) event.preventDefault();
				event.returnValue = false;
				return false;
			}

		}
	}();


	/**
	*	descriptionMenu(a1,a2)
	*
	*		permet de changer le commentaire décrivant le code
	*
	*		@a1:   nouveau titre par défaut (si a2 est défini)
	*			OU 1 → retourne la fonction permettant de changer la description temporairement
	*			OU 0 → retourne la fonction permettant de restaurer la description par défaut
	*		@a2:   nouvelle description (ou élément frère de l'élément contenant la nouvelle description)
	**/
	var descriptionMenu=function(){
	//change la description dans le menu de description
		var titre=document.getElementById("labsDefaultTitreDescription").value, //la valeur du titre par défaut
			desc=document.getElementById("labsDefaultDescription").value, //la valeur de la description par défaut
			elemTitre=document.getElementById("labsTitreDescription"), //l'élément contenant le titre qui doit être changé
			elemDescription=document.getElementById("labsDescription"), //l'élément contenant la description qui doit être changé
			timer=-1; //timer pour savoir si une action est en cours de changement

		function restore(){
		//restaure les descriptions par défaut
			clearTimeout(timer);
			timer=setTimeout(function(){
				elemTitre.innerHTML=titre;
				elemDescription.innerHTML=desc;
				},300);
		}
		function change(event){
		//change les descriptions
			clearTimeout(timer);
			timer=setTimeout(function(){
				var cible=event.currentTarget||( ((event.target||event.srcElement).nodeName==="A"&&(event.target||event.srcElement).parentNode) || (event.target||event.srcElement) ); // si cette ligne est si compliqué c'est pour gérer les navigateurs qui ne gère pas event.currentTarget comme IE
				var details=cible.parentNode.getElementsByTagName("details")[0]||{}; //élément contenant les descriptions (le {} sert à ne pas faire d'erreur lorsqu'on cherche à lire le contenu alors qu'aucun élément n'a été trouvé)
				elemTitre.innerHTML=cible.textContent||cible.innerText;
				elemDescription.innerHTML=details.textContent||details.innerText||"";
				//elemDescription.innerHTML=cible.getAttribute("description")||"";
			},300);
		}

		restore();
		return function(a1,a2){
		//gère l'appel à la fonction
			if(typeof a2 !== "undefined"){
			//changement des valeurs par défaut
				if(typeof a2 === "object"){
					//on a sans doute passé en argument un élément HTML
					//on va essayer de trouver le contenu de la description
					var details=a2.parentNode&&a2.parentNode.getElementsByTagName("details")[0]||{}; //élément contenant les descriptions (le {} sert à ne pas faire d'erreur lorsqu'on cherche à lire le contenu alors qu'aucun élément n'a été trouvé)
					a2=details.textContent||details.innerText||"";
				}
				titre=a1;
				desc=a2;
				restore();
			}else{
			//le but est d'affecter une fonction à un événement de l'élément
				if(a1===1){
					return change;
				}else{
					return restore;
				}
			}
		};
	}();

	/**
	*	resize(event)
	*
	*		permet de rétablir la position des éléments lorsqu'il y a un redimensionnement de la fenêtre
	*
	*		@event: évènement déclencheur
	**/
	var resize=function(){
	//gere le redimensionnement de la fenetre pour assurer que les menus restent au centre
		if(!document.querySelectorAll){
			//pour assurer le fonctionnement avec IE, on ne réalise pas cet effet
			return function(){};
		}
		var menus=document.querySelectorAll(".menu"),
			zoneMenus=document.querySelectorAll(".labsZoneMenu>div");
		return function(event){
			var i=menus.length;
			while(i--){
				//menus[i].style.maxHeight=document.body.clientHeight-40;
				menus[i].style.maxHeight=(window.innerHeight-40)+"px";
				//zoneMenus[i].style.height=document.body.clientHeight;
				zoneMenus[i].style.height=window.innerHeight+"px";
			}
		};
	}();


	/**
	*	menu(event)
	*
	*		permet de créer un effet d'accordéons sur les menus en agrandissant ou rapetissant les menus
	*
	*		@event: évènement déclencheur
	**/
	var menu=function(){
	//gere le menu avec ses transitions
		var old=null, //dernier element ouvert
			liste=[], //liste des elements subissant un effet
			timer=[]; //timer des effets
		
		var hMin=16; //valeur minimum de la hauteur afin de ne pas (trop) masquer le header

		function transition(elem,cible){
		//realise un effet de transition
			if(liste.indexOf(elem)!==-1){
				stop();
			}
			var y=parseInt(elem.style.height),
				dy=(cible-y)/9;
			liste.push(elem);
			timer.push(setInterval(effet,45));

			function effet(){
			//effectue l'effet de glissement
				y+=dy;
				if((dy>0 && y<cible) || (dy<0 && y>cible)){
					elem.style.height=y+"px";
				}else{
					//l'élément a atteint la cible
					elem.style.height=cible+"px";
					stop();
					if(dy<0){
						//elem.style.display="none";
						elem.className="";
						elem.style.height="";
					}else{
						elem.style.height="";
					}
				}
			}

			function stop(){
			//permet d'arreter une transition
				var i=liste.indexOf(elem);
				if(i!== -1){
					clearInterval(timer[i]);
					liste.splice(i,1);
					timer.splice(i,1);
				}
			}

		}

		function change(event){
		//lorsqu'on demande un changement d'etat sur un element
			event=event||window.event;
			var cible=(event.target||event.srcElement).parentNode; //on cible le menu
			if(cible.className==="open"){
				if(liste.indexOf(cible)===-1){
					//cet element ne subit pas actuellement de transition. C'est donc que l'element est "ouvert"
					cible.style.height=cible.scrollHeight+"px";
					transition(cible,hMin);
					old=null;
				}else{
					if(old===cible){
						//l'element est en cours d'ouverture
						cible.style.height=cible.scrollHeight+"px";
						transition(cible,hMin);
						old=null;
					}else{
						//l'element est en cours de fermeture
						transition(cible,cible.scrollHeight);
						old=cible;
					}
				}
			}else{
				//l'élément est actuellement fermée et doit donc être ouvert
				hMin=parseInt(window.getComputedStyle(cible,null).getPropertyValue("height"),10);
				cible.className="open";
				cible.style.height=hMin+"px";
				transition(cible,cible.scrollHeight);
				old=cible;
			}
		}
		return change;
	}();
	
	/**
	 * createMenu()
	 * 		Permet de mettre en place le menu
	 */
	function createMenu(){
		var xhr = null;
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		}else if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}else{
			// le navigateur ne supporte pas l'AJAX on lance le lien
			//problème...
			//TODO alternatif
		}
		
		xhr.onreadystatechange = function() {
			switch(xhr.readyState){
				case 3: //chargement en cours
					document.getElementById("mainMenu").innerHTML="<progress>chargement du menu</progress>";
					break;
				case 4: //chargement fini
					if(xhr.status !== 200 && xhr.status !== 0){
						//une erreur est apparue
						document.getElementById("mainMenu").innerHTML="Problem Error "+xhr.status+"...<br>The menu could not be loaded, sorry.";
					}else{
						//chargement réussi
						
						var json=xhr.responseText;
						try{
							json=JSON.parse(json);
						}catch(e){
							document.getElementById("mainMenu").innerHTML="JSON Error <br>"+e.message+"<br>The menu could not be loaded, sorry.";
							return;
						}
						var txt='<menu class="open">';
						txt+=generateMenu(json.menu);
						txt+='</menu>';
						document.getElementById("mainMenu").innerHTML=txt;
						init(menu,lien);
					}
					break;
			}
		};
		
		xhr.open("GET", "./menu.json", true);
		xhr.send(null);
		
		function generateMenu(liste){
			var i=0,li=liste.length,txt="",tmp;
			while(i<li){
				txt+="<menu";
				if(liste[i].label){
					txt+=' label="'+liste[i].label+'"';
				}
				txt+=">"
				if(tmp=(liste[i].nom || liste[i].url)){
					txt+="<header>";
					if(liste[i].url){
						txt+='<a href="'+liste[i].url+'">'+tmp+'</a>';
					}else{
						txt+=tmp;
					}
					txt+="</header>";
				}
				if(liste[i].info){
					txt+='<details>'+liste[i].info+'</details>';
				}
				if(liste[i].menu){
					txt+=generateMenu(liste[i].menu);
				}
				txt+="</menu>";
				i++;
			}
			return txt;
		}
	}

	//remplacement du HTML par le code du menu
	//init(menu,lien);
	createMenu();
})();
