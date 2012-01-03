/*http://chaperon.rouge.online.fr/versions.htm*/


var listePersonnages=[];
var listeObjets=[];
var listeLieux=[];


var personnage=new Personnage("petite fille","F","Petit Chaperon rouge","M");
personnage.introductionCarac=", la plus jolie qu’on eût su voir ; sa mère en était folle, et §¤son §son §sa §sa ¤p3.surnom¤§¤¤p3.surnom¤¤ plus §¤fou§folle¤p3.surnom¤§ encore";
personnage.introductionSurnom="§¤Ce§Cet§Cette¤p3.nom¤§ ¤¤p3.nom¤¤ lui fit faire un petit chaperon rouge, qui lui seyait si bien, que partout on l’appelait le Petit Chaperon rouge.";
personnage.introductionMission="Un jour, sa mère, ayant cuit et fait des galettes, lui dit : \"££other§Va voir comment se porte §¤ton§ta¤p3.surnom¤§ ¤¤p3.surnom¤¤, car on m’a dit qu’§¤il§elle¤p3.surnom¤§ était malade. Porte-lui ¤¤o1.nom¤¤.££\"";
listePersonnages.push(personnage);


personnage=new Personnage("loup","M","grand méchant loup","M");
personnage.introductionCarac=", le plus méchant qu’on eût su voir ; §¤le §l'§la §l'¤p3.surnom¤§¤¤p3.surnom¤¤ en avait grand peur";
personnage.introductionSurnom="Si bien que §¤ce§cet§cette¤p3.nom¤§ ¤¤p3.nom¤¤ colportait partout que c'était le Grand Méchant Loup !";
personnage.introductionMission="Un jour, ayant entendu ces rumeurs, il se décida d'aller rencontrer §¤le §l'§la §l'¤p3.surnom¤§ ¤¤p3.surnom¤¤, afin de faire taire ces médisances. Il se dit : \"££p1§Je vais lui porter ¤¤o1.nom¤¤ pour qu'§¤il§elle¤p3.surnom¤§ me fasse entrer. Et je §¤le§la¤p3.surnom¤§ mangerai pour qu'§¤il§elle¤p3.surnom¤§ se taise££\".";
listePersonnages.push(personnage);


personnage=new Personnage("bonne femme","F","mère-grand","F");
personnage.introductionCarac=", la plus vieille qu’on eût su voir ; sa fille l'aimait beaucoup, et §¤son§sa¤p3.surnom¤§ ¤¤p3.surnom¤¤ plus encore";
personnage.introductionSurnom="Elle était si bonne avec §¤ce§cet§cette¤p3.nom¤§ ¤¤p3.nom¤¤ que partout on l’appelait la bonne femme.";
personnage.introductionMission="Un jour, ayant cuit et fait des galettes, elle se dit : \"££p1§Je vais voir comment se porte §¤mon§mon§ma§mon¤p3.surnom¤§ ¤¤p3.surnom¤¤, car on m’a dit qu’§¤il§elle¤p3.surnom¤§ était malade. Je lui porterai ¤¤o1.nom¤¤, et cela lui fera plaisir££\".";
listePersonnages.push(personnage);

var lieu=new Lieu("village","M","maison","F");
listeLieux.push(lieu);

lieu=new Lieu("bois","M","forêt","F");
listeLieux.push(lieu);

var objet=new Objet("rien du tout","M",0);
listeObjets.push(objet);

objet=new Objet("une galette et un petit pot de beurre","M",2);
listeObjets.push(objet);




function generateFieldset(titre,liste,id,selected){
	var zone=document.createElement("fieldset"),
		elem=document.createElement("legend");
	elem.textContent=titre;
	zone.appendChild(elem);
	var i=0,li=liste.length,option;
	elem=document.createElement("select");
	elem.id=id;
	do{
		option=document.createElement("option");
		option.value=i;
		option.textContent=liste[i].surnom||liste[i].nom;
		if(selected===i) option.selected=true;
		elem.appendChild(option);
	}while(++i<li);
	zone.appendChild(elem);
	return zone;
}

var controle=document.getElementById("controle");
controle.appendChild(generateFieldset("Le héros",listePersonnages,"heros",0));
controle.appendChild(generateFieldset("Le héros rencontre",listePersonnages,"rencontre",1));
controle.appendChild(generateFieldset("Le héros va rendre visite à",listePersonnages,"visite",2));

controle.appendChild(generateFieldset("Le lieu de départ",listeLieux,"lieu1",0));
controle.appendChild(generateFieldset("Le lieu de rencontre",listeLieux,"lieu2",1));
controle.appendChild(generateFieldset("Le lieu d'arrivé",listeLieux,"lieu3",2));

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
