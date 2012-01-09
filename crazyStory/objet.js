function Objet(nom,sexe,nb,fabrication){
	this.nom=nom||"un objet";
	this.nomSexe=sexe || "M";
	if(!nb && nb!==0) nb=1;
	this.nb = nb;
	this.fabrication=fabrication||"fabriqué"+(nb>1?"s":"");
}
Objet.prototype.le="l'objet";
Objet.prototype.preparation='<span class="notDone">ayant cuit et fait des galettes</span>';