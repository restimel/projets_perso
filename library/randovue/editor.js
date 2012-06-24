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
	randoListe.add(new Parcours(0,{titre:"le titre",color:"#00FF00",comment:"un commentaire pour voir qui ne sert pour l'instant qu'à tester les commentaires... à voir donc!"}));
	randoListe.add(new Parcours(1,{titre:"un deuxième titre",color:"#00FFFF"}));
	randoListe.add(new Parcours(2,{titre:"un troisième titre",color:"#FFFF00"}),2);
	randoListe.add(new Parcours(1,{date:"25/02/1981",titre:"un intrus",color:"#FF0000"}),1);
	randoListe.add(new Parcours(0,{date:"toto est en vacances",titre:"Hé ho ! Hé ho !, On rentre du boulot",color:"#FFF"}));
	randoListe.add(new Parcours(0,{date:"3012-06-21",titre:"La fête de la musique dans l'avenir",color:"#0C0"}));
	randoListe.add(new Parcours(0,{date:"3012-06-21",color:"#0CF"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	randoListe.add(new Parcours(0,{date:"2012-06-21",titre:"quelques éléments en plus pour cacher les premiers",color:"#000"}));
	var test=new Parcours(0,{});
	randoListe.add(test);
	randoListe.view(0);

}
window.onload = test;