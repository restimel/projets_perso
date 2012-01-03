function Objet(nom,sexe,nb){
	this.nom=nom||"objet";
	this.nomSexe=sexe || "M";
	if(!nb && nb!==0) nb=1;
	this.nb = nb;
}