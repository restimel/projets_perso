/*http://chaperon.rouge.online.fr/versions.htm*/


var listePersonnages=[];
var listeObjets=[];
var listeLieux=[];


var personnage=new Personnage("petite fille","F","Petit Chaperon rouge","M");
personnage.relationnel0="mon enfant";
personnage.introductionCarac=", la plus jolie qu'on eût su voir ; sa mère en était folle, et §¤son §son §sa §sa ¤p3.surnom¤§¤¤p3.surnom¤¤ plus §¤fou§folle¤p3.surnom¤§ encore";
personnage.introductionSurnom="§¤Ce§Cet§Cette¤p3.nom¤§ ¤¤p3.nom¤¤ lui fit faire un petit chaperon rouge, qui lui seyait si bien, que partout on l'appelait le Petit Chaperon rouge.";
personnage.introductionMission="Un jour, sa mère, ayant cuit et fait des galettes, lui dit : ££other§Va voir comment se porte §¤ton§ta¤p3.surnom¤§ ¤¤p3.surnom¤¤, car on m'a dit qu'§¤il§elle¤p3.surnom¤§ était malade. Porte-lui ¤¤o1.nom¤¤.££";
personnage.rencontreVolonte="<span class=\"notDone\">, qui eut bien envie de ???</span>";
personnage.rencontreDialogue1=", que ma mère lui envoie";
personnage.attaque1Dialogue1=", que ma mère vous envoie";
personnage.attaque1Raison="se trouvait un peu mal";
//personnage.attaque1attaque="Il se jeta sur §¤le §l'§la §l'¤p3.nom¤§¤¤p3.nom¤¤, et §¤le§la¤p3.nom¤§ dévora en moins de rien ; car il y avait plus de trois jours qu'il n'avait mangé.";
personnage.attaque1voix="la petite voix de la fille hésita d'abord";
personnage.attaque1Visite="était §¤enrhumé§enrhumée¤p3.surnom¤§";
personnage.attaque1voixAmeliore="augmentant un peu sa voix";
//personnage.questions=[["",""],["",""]];
//personnage.attaque2attaque="se jeta sur §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, et §¤le§la¤p3.nom¤§ mangea";
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
personnage.attaque2attaque="se jeta sur §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, et §¤le§la¤p3.nom¤§ mangea";
listePersonnages.push(personnage);


personnage=new Personnage("bonne femme","F","mère-grand","F");
personnage.relationnel0="mamie";
personnage.relationnel2="ta ";
personnage.introductionCarac=", la plus vieille qu'on eût su voir ; sa fille l'aimait beaucoup, et §¤son§sa¤p3.surnom¤§ ¤¤p3.surnom¤¤ plus encore";
personnage.introductionSurnom="Elle était si bonne avec §¤ce§cet§cette¤p3.nom¤§ ¤¤p3.nom¤¤ que partout on l'appelait la Mère-grand.";
personnage.introductionMission="Un jour, ayant cuit et fait des galettes, elle se dit : ££p1§Je vais voir comment se porte §¤mon§mon§ma§mon¤p3.surnom¤§ ¤¤p3.surnom¤¤, car on m'a dit qu'§¤il§elle¤p3.surnom¤§ était malade. Je lui porterai ¤¤o1.nom¤¤, et cela lui fera plaisir££.";
personnage.rencontreVolonte="<span class=\"notDone\">, qui eut bien envie de ???</span>";
personnage.rencontreDialogue1=", que j'ai ¤¤o1.fabrication¤¤ pour §¤lui§elle¤p3.nom¤§";
personnage.attaque1Dialogue1=", que j'ai ¤¤o1.fabrication¤¤ pour toi";
//personnage.attaque1Raison="se trouvait un peu mal";
//personnage.attaque1attaque="Il se jeta sur §¤le §l'§la §l'¤p3.nom¤§¤¤p3.nom¤¤, et §¤le§la¤p3.nom¤§ dévora en moins de rien ; car il y avait plus de trois jours qu'il n'avait mangé.";
personnage.attaque1voix="la voix bégayante de la mère-grand s'interrogea d’abord";
personnage.attaque1Visite="était trop §¤ému§émue¤p3.surnom¤§";
personnage.attaque1voixAmeliore="contrôlant un peu sa voix";
//personnage.questions=[["",""],["",""]];
//personnage.attaque2attaque="se jeta sur §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, et §¤le§la¤p3.nom¤§ mangea";
listePersonnages.push(personnage);

personnage=new Personnage("test","M","testeur","M");
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
listeObjets.push(objet);

objet=new Objet("une galette et un petit pot de beurre","M",2,"préparés");
objet.le="la galette et le petit pot de beurre";
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
}
