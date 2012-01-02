function Personnage(nom,sexe,surnom,surnomSexe){
	this.nom=nom;
	this.sexe=sexe || "M";
	this.surnom=surnom || nom;
	this.surnomSexe=surnomSexe || sexe;
}

Personnage.prototype.introductionCarac="";
Personnage.prototype.introCarac=function(p3){
	return this.introductionCarac.replace(/§¤([^§¤]*)§([^§¤]*)¤§/g,function(m,masculin,feminin){if(p3.surnomSexe==="F") return feminin; else return masculin;}).replace(/¤¤p3¤¤/g,p3.surnom);
};

Personnage.prototype.introductionDon="";
Personnage.prototype.introDon=function(p3){
	return this.introductionDon.replace(/§¤([^§¤]*)§([^§¤]*)¤§/g,function(m,masculin,feminin){if(p3.sexe==="F") return feminin; else return masculin;}).replace(/¤¤p3¤¤/g,p3.nom);
};

Personnage.prototype.introductionMission="";
Personnage.prototype.introMission=function(p3){
	return this.introductionMission.replace(/§¤([^§¤]*)§([^§¤]*)¤§/g,function(m,masculin,feminin){if(p3.surnomSexe==="F") return feminin; else return masculin;}).replace(/¤¤p3¤¤/g,p3.surnom);
};