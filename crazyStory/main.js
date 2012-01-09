/*http://chaperon.rouge.online.fr/versions.htm*/


var listePersonnages=[];
var listeObjets=[];
var listeLieux=[];


var personnage=new Personnage("petite fille","F","petit chaperon rouge","M");
personnage.relationnel0="mon enfant";
personnage.introductionCarac=", la plus jolie qu'on eût su voir ; sa mère en était folle, et §¤son §son §sa §sa ¤p3.surnom¤§¤¤p3.surnom¤¤ plus §¤fou§folle¤p3.surnom¤§ encore";
personnage.introductionSurnom="§¤Ce§Cet§Cette¤p3.nom¤§ ¤¤p3.nom¤¤ lui fit faire un petit chaperon rouge, qui lui seyait si bien, que partout on l'appelait le Petit Chaperon rouge.";
personnage.introductionMission="Un jour, sa mère, ¤¤o1.preparation¤¤, lui dit : ££other§Va voir comment se porte §¤ton§ta¤p3.surnom¤§ ¤¤p3.surnom¤¤, car on m'a dit qu'§¤il§elle¤p3.surnom¤§ était malade. Porte-lui ¤¤o1.nom¤¤.££";
personnage.rencontreVolonte=", qui avait été privée de son argent de poche par sa mère, eut bien envie de §¤le§la¤p1.nom¤§ voler";
personnage.rencontreDialogue1=", que ma mère lui envoie";
personnage.attaque1Dialogue1=", que ma mère vous envoie";
personnage.attaque1Raison="se trouvait un peu mal";
personnage.attaque1attaque="Elle se jeta sur §¤le §l'§la §l'¤p3.nom¤§¤¤p3.nom¤¤, §¤le§la¤p3.nom¤§ bâillonna et §¤le§la¤p3.nom¤§ cacha en moins de rien. Elle §¤le§la¤p3.nom¤§ dépouilla de tout ce qu'elle trouva.";
personnage.attaque1voix="la petite voix de la fille hésita d'abord";
personnage.attaque1Visite="était §¤enrhumé§enrhumée¤p3.surnom¤§";
personnage.attaque1voixAmeliore="augmentant un peu sa voix";
personnage.questions=[["une jolie chevelure","te séduire"],["une petite bouche","te sourire"],["une petite taille","t'échapper"],["de petites mains","te dépouiller"]];
personnage.attaque2attaque="se jeta sur §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, et §¤le§la¤p1.nom¤§ dépouilla";
listePersonnages.push(personnage);


personnage=new Personnage("loup","M","méchant loup","M");
personnage.relationnel0="le loup";
personnage.relationnel1="§¤le §l'§la §l'¤p3.surnom¤§";
personnage.relationnel2="§¤le §l'§la §l'¤p1.nom¤§";
personnage.relationnel3="§¤le §l'§la §l'¤p3.surnom¤§";
personnage.introductionCarac=", le plus méchant qu'on eût su voir ; §¤le §l'§la §l'¤p3.surnom¤§¤¤p3.surnom¤¤ en avait grand peur";
personnage.introductionSurnom="Si bien que §¤ce§cet§cette¤p3.nom¤§ ¤¤p3.nom¤¤ colportait partout que c'était le grand méchant loup !";
personnage.introductionMission="Un jour, ayant entendu ces rumeurs, il se décida d'aller rencontrer §¤le §l'§la §l'¤p3.surnom¤§ ¤¤p3.surnom¤¤, afin de faire taire ces médisances. Il se dit : ££p1§Je vais lui porter ¤¤o1.nom¤¤ pour qu'§¤il§elle¤p3.surnom¤§ me fasse entrer. Et je §¤le§la¤p3.surnom¤§ mangerai pour qu'§¤il§elle¤p3.surnom¤§ se taise££.";
personnage.rencontreVolonte=", qui eut bien envie de §¤le§la¤p1.nom¤§ manger";
personnage.rencontreDialogue1=", que j'ai ¤¤o1.fabrication¤¤ pour §¤lui§elle¤p3.nom¤§";
personnage.attaque1Dialogue1=", que j'ai ¤¤o1.fabrication¤¤ pour vous";
personnage.attaque1Raison="se trouvait §¤terrifié§terrifiée¤p3.nom¤§";
personnage.attaque1attaque="Il se jeta sur §¤le §l'§la §l'¤p3.nom¤§¤¤p3.nom¤¤, et §¤le§la¤p3.nom¤§ dévora en moins de rien ; car il y avait plus de trois jours qu'il n'avait mangé.";
personnage.attaque1voix="la grosse voix du Loup";
personnage.attaque1Visite="avait sa voix déformée par la peur";
personnage.attaque1voixAmeliore="adoucissant un peu sa voix";
personnage.questions=[["de grands bras","t'embrasser"],["de grandes jambes","courir"],["de grandes oreilles","écouter"],["de grands yeux","voir"],["de grandes dents","te manger"]];
personnage.attaque2attaque="se jeta sur §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, et §¤le§la¤p1.nom¤§ mangea";
listePersonnages.push(personnage);


personnage=new Personnage("bonne femme","F","mère-grand","F");
personnage.relationnel0="mère-grand";
personnage.relationnel2="ta ";
personnage.introductionCarac=", la plus vieille qu'on eût su voir ; sa fille l'aimait beaucoup, et §¤son§sa¤p3.surnom¤§ ¤¤p3.surnom¤¤ plus encore";
personnage.introductionSurnom="Elle était si bonne avec §¤ce§cet§cette¤p3.nom¤§ ¤¤p3.nom¤¤ que partout on l'appelait la Mère-grand.";
personnage.introductionMission="Un jour, ¤¤o1.preparation¤¤, elle se dit : ££p1§Je vais voir comment se porte §¤mon§mon§ma§mon¤p3.surnom¤§ ¤¤p3.surnom¤¤, car on m'a dit qu'§¤il§elle¤p3.surnom¤§ était malade. Je lui porterai ¤¤o1.nom¤¤, et cela lui fera plaisir££.";
personnage.rencontreVolonte=", qui eut bien envie de §¤le§la¤p1.nom¤§ transformer en tourte";
personnage.rencontreDialogue1=", que j'ai ¤¤o1.fabrication¤¤ pour §¤lui§elle¤p3.nom¤§";
personnage.attaque1Dialogue1=", que j'ai ¤¤o1.fabrication¤¤ pour toi";
personnage.attaque1Raison="se trouvait un peu §¤souffrant§souffrante¤p3.nom¤§";
personnage.attaque1attaque="Elle se jeta sur §¤le §l'§la §l'¤p3.nom¤§¤¤p3.nom¤¤, et §¤le§la¤p3.nom¤§ transforma tourte en moins de rien ; car elle avait la main.";
personnage.attaque1voix="la voix bégayante de la mère-grand s'interrogea d’abord";
personnage.attaque1Visite="était trop §¤ému§émue¤p3.surnom¤§";
personnage.attaque1voixAmeliore="contrôlant un peu sa voix";
personnage.questions=[["de vieux yeux","supporter ce monde"],["de vielles dents","prendre le temps de manger"],["de vielles mains","pétrir mes plats"],["de vielles recettes","te transformer en tourte"]];
personnage.attaque2attaque="se jeta sur §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, et §¤le§la¤p1.nom¤§ transforma en tourte";
listePersonnages.push(personnage);


personnage=new Personnage("boucher","M","gros boucher","M");
personnage.relationnel0="mon gros";
//personnage.relationnel1="§¤le §l'§la §l'¤p3.surnom¤§";
//personnage.relationnel2="§¤le §l'§la §l'¤p1.nom¤§";
//personnage.relationnel3="§¤le §l'§la §l'¤p3.surnom¤§";
personnage.introductionCarac=", le meilleur boucher qu'on eût su voir ; §¤le §l'§la §l'¤p3.surnom¤§¤¤p3.surnom¤¤ l'admirait beaucoup";
personnage.introductionSurnom="Malgrès ses rondeurs, il était aimé dans §¤tout le §tout l'§toute la §toute l'¤l1.nom¤§¤¤l1.nom¤¤.";
personnage.introductionMission="Un jour, ¤¤o1.preparation¤¤, il se décida d'aller voir §¤son meilleur client§sa meilleure cliente¤p3.nom¤§ : §¤le §l'§la §l'¤p3.surnom¤§ ¤¤p3.surnom¤¤. ££p1§Pour lui faire plaisir, je vais lui porter ¤¤o1.nom¤¤££.";
personnage.rencontreVolonte=", qui eut bien envie de §¤le§la¤p1.nom¤§ charcuter";
personnage.rencontreDialogue1=", que j'ai ¤¤o1.fabrication¤¤ pour §¤lui§elle¤p3.nom¤§";
personnage.attaque1Dialogue1=", que j'ai ¤¤o1.fabrication¤¤ pour vous";
personnage.attaque1Raison="se trouvait un peu mal";
personnage.attaque1attaque="Il se jeta sur §¤le §l'§la §l'¤p3.nom¤§¤¤p3.nom¤¤, et §¤le§la¤p3.nom¤§ charcuta en moins de rien.";
personnage.attaque1voix="la grosse voix du boucher";
personnage.attaque1Visite="avait sa voix déformée par l'émotion";
personnage.attaque1voixAmeliore="adoucissant un peu sa voix";
personnage.questions=[["un gros ventre","manger"],["une grosse bouche","te parler"],["de gros yeux","te voir"],["de gros bras","te tenir"],["un gros couteau","te charcuter"]];
personnage.attaque2attaque="se jeta sur §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, et §¤le§la¤p1.nom¤§ charcuta";
listePersonnages.push(personnage);




var lieu=new Lieu("village","M","maison","F","du boucher",1);
lieu.repere="le moulin";
lieu.distance=", à la première maison du village";
lieu.perturbation=", s'amusant à compter les ronds de fumée sortant des cheminées, et à courir après des chiens qu'§¤il§elle¤p1.nom¤§ rencontrait";
lieu.action="££t1§Tire la chevillette, la bobinette cherra.££ §¤Le §L'§La §L'¤t2.nom¤§¤¤t2.nom¤¤ tira la chevillette et la porte s’ouvrit.";
lieu.repare="§¤il§elle¤p2.nom¤§ ferma la porte, et s'alla coucher dans le lit §¤du §de l'§de la §de l'¤p3.surnom¤§¤¤p3.surnom¤¤";
lieu.arriver="entrer";
lieu.cacher="dans le lit sous la couverture";
lieu.objetEmplacement="sur la huche";
lieu.demandeVenir="te coucher avec moi";
lieu.approche="se déshabille, et va se mettre dans le lit";
lieu.decouverte="en son déshabillé";
listeLieux.push(lieu);

lieu=new Lieu("bois","M","forêt","F","de quelques Bûcherons",4);
lieu.repere="le grand chêne";
lieu.distance=", à la hutte perchée dans l'arbre";
lieu.perturbation=", s'amusant à cueillir des noisettes, à courir après des papillons, et à faire des bouquets des petites fleurs qu'§¤il§elle¤p1.nom¤§ rencontrait";
lieu.entree1=" §¤il§elle¤p2.nom¤§ hurle : ££p2§¤¤p3.nom¤¤ où es-tu ? M'entends-tu  ?££";
lieu.emplacement="dans sa hutte";
lieu.action="££t1§Tire la ficelle, l'échelle de corde cherra.££ §¤Le §L'§La §L'¤t2.nom¤§¤¤t2.nom¤¤ tira la ficelle et grimpa à l'échelle.";
lieu.repare="§¤il§elle¤p2.nom¤§ remonta l'échelle, et s'alla se réfugier dans la hutte §¤du §de l'§de la §de l'¤p3.surnom¤§¤¤p3.surnom¤¤";
lieu.entree1="hurler en bas : ££p1§¤¤p3.nom¤¤ où es-tu ? M'entends-tu  ?££";
lieu.arriver="monter";
lieu.cacher="dans la hutte derrière la porte";
lieu.objetEmplacement="sur la branche";
lieu.demandeVenir="dans la hutte avec moi";
lieu.approche="dépose ¤¤o1.le¤¤ sur une branche et va dans la hutte";
lieu.decouverte="dans la pénombre";
listeLieux.push(lieu);





var objet=new Objet("rien du tout","M",0,"sorti du néant");
objet.le="ton cadeau";
objet.preparation="n'ayant rien fait";
listeObjets.push(objet);

objet=new Objet("une galette et un petit pot de beurre","M",2,"préparés");
objet.le="la galette et le petit pot de beurre";
objet.preparation="ayant cuit et fait des galettes";
listeObjets.push(objet);




var unique=(function(){
	var v=[0,1,2],
		id=["heros","rencontre","visite"];
	return function(init){
		var elem;
		if(init===true){
			elem=document.getElementById(id[0]);
			elem.childNodes[v[0]].className=elem.childNodes[v[1]].className=elem.childNodes[v[2]].className="selected";
			elem=document.getElementById(id[1]);
			elem.childNodes[v[0]].className=elem.childNodes[v[1]].className=elem.childNodes[v[2]].className="selected";
			elem=document.getElementById(id[2]);
			elem.childNodes[v[0]].className=elem.childNodes[v[1]].className=elem.childNodes[v[2]].className="selected";
			return false;
		}
		
		var p=v.indexOf(this.selectedIndex),
			p2=id.indexOf(this.id);
		if(p!==-1){
			if(p!==p2){
				document.getElementById(id[p]).selectedIndex=v[p2];
				v[p]=v[p2];
				v[p2]=this.selectedIndex;
			}
		}else{
			elem=document.getElementById(id[0]);
			elem.childNodes[this.selectedIndex].className="selected";
			elem.childNodes[v[p2]].className="";
			elem=document.getElementById(id[1]);
			elem.childNodes[this.selectedIndex].className="selected";
			elem.childNodes[v[p2]].className="";
			elem=document.getElementById(id[2]);
			elem.childNodes[this.selectedIndex].className="selected";
			elem.childNodes[v[p2]].className="";
			v[p2]=this.selectedIndex;
		}
		//this.childNodes[this.selectedIndex].style.color="gray";
		//document.getElementById("heros").value
	}
})();

function generateFieldset(titre,liste,id,selected,f){
	var zone=document.createElement("fieldset"),
		elem=document.createElement("legend");
	elem.textContent=titre;
	zone.appendChild(elem);
	var i=0,li=liste.length,option;
	elem=document.createElement("select");
	if(f) elem.onchange=f;
	elem.id=id;
	do{
		option=document.createElement("option");
		option.value=i;
		option.textContent=liste[i].surnom||liste[i].nom;
		if(selected===i){
			option.selected=true;
		}
		elem.appendChild(option);
	}while(++i<li);
	zone.appendChild(elem);
	return zone;
}

var controle=document.getElementById("controle");
controle.appendChild(generateFieldset("Le héros",listePersonnages,"heros",0,unique));
controle.appendChild(generateFieldset("Le héros rencontre",listePersonnages,"rencontre",1,unique));
controle.appendChild(generateFieldset("Le héros va rendre visite à",listePersonnages,"visite",2,unique));
unique(true);

controle.appendChild(generateFieldset("Le lieu de départ",listeLieux,"lieu1",0));
controle.appendChild(generateFieldset("Le lieu de rencontre",listeLieux,"lieu2",1));
controle.appendChild(generateFieldset("Le lieu d'arrivée",listeLieux,"lieu3",2));

controle.appendChild(generateFieldset("Le cadeau",listeObjets,"cadeau",1));

var btn=document.createElement("button");
btn.textContent="Générer l'histoire";
btn.onclick=runStory;
controle.appendChild(btn);

function runStory(){
	var p1=listePersonnages[document.getElementById("heros").value],
		p2=listePersonnages[document.getElementById("rencontre").value],
		p3=listePersonnages[document.getElementById("visite").value],
		p4=listePersonnages[document.getElementById("visite").value],//TODO le sauveur
		l1=listeLieux[document.getElementById("lieu1").value],
		l2=listeLieux[document.getElementById("lieu2").value],
		l3=listeLieux[document.getElementById("lieu3").value],
		o1=listeObjets[document.getElementById("cadeau").value];
	var message=histoire(p1,p2,p3,p4,l1,l2,l3,o1);
	document.getElementById("histoire").innerHTML=message;
	var rslt="";
	if(p1.etat==="" && p2.etat==="" && p3.etat==="" && p4.etat==="" && p1.surnom==="Petit Chaperon rouge" && p2.nom==="loup" && p3.surnom==="mère-grand" && l1.nom==="village" && l2.nom==="bois" && l3.nom==="village" && o1.nom==="une galette et un petit pot de beurre"){
		rslt+="Ceci est la version proche de celle de Perrault<br />";
	}
	document.getElementById("resultat").innerHTML=rslt;
	p1.etat=p2.etat=p3.etat=p4.etat="";
}
//p3.etat="enrhumé";
