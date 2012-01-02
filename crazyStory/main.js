/*http://chaperon.rouge.online.fr/versions.htm*/


var listePersonnages=[];
var listeObjets=[];
var listeLieux=[];


var personnage=new Personnage("petite fille","F","Petit Chaperon rouge","M");
personnage.introductionCarac=", la plus jolie qu’on eût su voir ; sa mère en était folle, et §¤son§sa¤§ ¤¤p3¤¤ plus §¤fou§folle¤§ encore";
personnage.introductionDon="§¤Ce§Cette¤§ ¤¤p3¤¤ lui fit faire un petit chaperon rouge, qui lui seyait si bien, que partout on l’appelait le Petit Chaperon rouge.";
personnage.introductionMission="Un jour, sa mère, ayant cuit et fait des galettes, lui dit : Va voir comment se porte §¤ton§ta¤§ ¤¤p3¤¤, car on m’a dit qu’§¤il§elle¤§ était malade. Porte-lui une galette et ce petit pot de beurre.";
listePersonnages.push(personnage);


personnage=new Personnage("loup","M","loup","M");
personnage.introductionCarac=", le plus méchant qu’on eût su voir ; §¤le§la¤§ ¤¤p3¤¤ en avait grand peur";
personnage.introductionDon="Si bien que §¤ce§cette¤§ ¤¤p3¤¤ colportait partout que c'était le Grand Méchant Loup !";
personnage.introductionMission="Un jour, ayant entendu ces rumeurs, se décida d'aller rencontrer §¤le§la¤§ ¤¤p3¤¤, afin de faire taire ces médisances. Il se dit : \"Je vais lui porter une galette et ce petit pot de beurre pour qu'§¤il§elle¤§ me fasse entrer\".";
listePersonnages.push(personnage);


personnage=new Personnage("bonne femme","F","mère-grand","F");
personnage.introductionCarac=", la plus vieille qu’on eût su voir ; sa fille en était folle, et §¤son§sa¤§ ¤¤p3¤¤ plus §¤fou§folle¤§ encore";
personnage.introductionDon="Elle était si bonne avec §¤ce§cette¤§ ¤¤p3¤¤ que partout on l’appelait la bonne femme.";
personnage.introductionMission="Un jour, ayant cuit et fait des galettes, elle se dit : \" Je vais voir comment se porte §¤mon§ma¤§ ¤¤p3¤¤, car on m’a dit qu’§¤il§elle¤§ était malade. Je lui porterai une galette et ce petit pot de beurre, et cela lui fera plaisir\".";
listePersonnages.push(personnage);



document.getElementById("histoire").innerHTML=histoire(listePersonnages[2],listePersonnages[1],listePersonnages[1]);
