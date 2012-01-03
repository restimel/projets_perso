function Lieu(nom,sexe,surnom,surnomSexe){
	this.nom=nom||"village";
	this.nomSexe=sexe || "M";
	this.surnom=surnom || this.nom;
	this.surnomSexe=surnomSexe || this.nomSexe;
}