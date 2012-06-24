/**
 * affiche le bloc permettant d'ajouter de nouvelles actions
 */
function displayFooter(elem){
	if(typeof elem === "string"){
		elem=document.getElementById(elem);
	}
	elem.innerHTML="";
	
	var position = document.createElement("input");
	position.type="number";
	position.title="Position de l'étape";
}

/**
 * Tests
 */
function test(){
	var liste = document.createElement("div");
	liste.style.height = "400px";
	liste.style.overflow = "auto";
	liste.style.backgroundColor = "#CCCCFF";
	
	document.body.appendChild(liste);
	randoListe.defineZone(liste);
	randoListe.add(new Parcours(0,null,null,"le titre","#00FF00","un commentaire pour voir qui ne sert pour l'instant qu'à tester les commentaires... à voir donc!"));
	randoListe.add(new Parcours(1,null,null,"un deuxième titre","#00FFFF"));
	randoListe.add(new Parcours(2,null,null,"un troisième titre","#FFFF00"),2);
	randoListe.add(new Parcours(1,null,"25/02/1981","un intrus","#FF0000"),1);
	randoListe.add(new Parcours(0,null,"toto est en vacances","Hé ho ! Hé ho !, On rentre du boulot","#FFF"));
	randoListe.add(new Parcours(0,null,"3012-06-21","La fête de la musique dans l'avenir","#0C0"));
	randoListe.add(new Parcours(0,null,"2012-06-21","quelques éléments en plus pour cacher les premiers","#000"));
	randoListe.add(new Parcours(0,null,"2012-06-21","quelques éléments en plus pour cacher les premiers","#000"));
	randoListe.add(new Parcours(0,null,"2012-06-21","quelques éléments en plus pour cacher les premiers","#000"));
	randoListe.add(new Parcours(0,null,"2012-06-21","quelques éléments en plus pour cacher les premiers","#000"));
	randoListe.add(new Parcours(0,null,"2012-06-21","quelques éléments en plus pour cacher les premiers","#000"));
	randoListe.add(new Parcours(0,null,"2012-06-21","quelques éléments en plus pour cacher les premiers","#000"));
	randoListe.add(new Parcours(0,null,"2012-06-21","quelques éléments en plus pour cacher les premiers","#000"));
}
window.onload = test;