function Personnage(nom,sexe,surnom,surnomSexe){
	this.nom=nom;
	this.nomSexe=sexe || "M";
	this.surnom=surnom || nom;
	this.surnomSexe=surnomSexe || sexe;
	this.etat="";
}
Personnage.prototype.relationnel0="mon enfant";
Personnage.prototype.relationnel1="§¤mon §mon §ma §mon ¤p3.surnom¤§";
Personnage.prototype.relationnel2="votre ";
Personnage.prototype.relationnel3="§¤son §son §sa §son ¤p3.surnom¤§";

Personnage.prototype.introductionCarac="";
/*Personnage.prototype.introCarac=function(p3){
	return this.introductionCarac.replace(/§¤([^§¤]*)§([^§¤]*)¤§/g,function(m,masculin,feminin){if(p3.surnomSexe==="F") return feminin; else return masculin;}).replace(/¤¤p3¤¤/g,p3.surnom);
};*/

Personnage.prototype.introductionSurnom="";
/*Personnage.prototype.introSurnom=function(p3){
	return this.introductionSurnom.replace(/§¤([^§¤]*)§([^§¤]*)¤§/g,function(m,masculin,feminin){if(p3.sexe==="F") return feminin; else return masculin;}).replace(/¤¤p3¤¤/g,p3.nom);
};*/

Personnage.prototype.introductionMission="";
/*Personnage.prototype.introMission=function(p3){
	return this.introductionMission.replace(/§¤([^§¤]*)§([^§¤]*)¤§/g,function(m,masculin,feminin){if(p3.surnomSexe==="F") return feminin; else return masculin;}).replace(/¤¤p3¤¤/g,p3.surnom);
};*/

Personnage.prototype.rencontreVolonte='<span class="notDone">, qui eut bien envie de §¤le§la¤p1.nom¤§ manger</span>';
Personnage.prototype.rencontreDialogue1='<span class="notDone">, que ma mère lui envoie</span>';

Personnage.prototype.attaque1Dialogue1='<span class="notDone">, que ma mère vous envoie</span>';
Personnage.prototype.attaque1Raison='<span class="notDone">se trouvait un peu mal</span>';
Personnage.prototype.attaque1attaque='<span class="notDone">Il se jeta sur la bonne femme, et la dévora en moins de rien ; car il y avait plus de trois jours qu’il n’avait mangé.</span>';
Personnage.prototype.attaque1voix='<span class="notDone">la grosse voix du Loup eut peur d’abord</span>';
Personnage.prototype.attaque1Visite="était §¤enrhumé§enrhumée¤p3.surnom¤§";
Personnage.prototype.attaque1voixAmeliore='<span class="notDone">adoucissant un peu sa voix</span>';

Personnage.prototype.questions=[['<span class="notDone">de grandes questions</span>','<span class="notDone">te répondre</span>']];
Personnage.prototype.attaque2attaque='<span class="notDone">se jeta sur le Petit Chaperon rouge, et la mangea.</span>';