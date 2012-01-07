function Lieu(nom,sexe,surnom,surnomSexe,protecteurs,protecteursNb){
	this.nom=nom||"village";
	this.nomSexe=sexe || "M";
	this.surnom=surnom || this.nom;
	this.surnomSexe=surnomSexe || this.nomSexe;
	this.protecteurs=protecteurs||"de passants";
	this.protecteursNb=protecteursNb||2;
}

Lieu.prototype.repere="le moulin";
Lieu.prototype.distance='<span class="notDone">, à la première maison du Village</span>';
Lieu.prototype.perturbation='<span class="notDone">, s’amusant à cueillir des noisettes, à courir après des papillons, et à faire des bouquets des petites fleurs qu’elle rencontrait</span>';
Lieu.prototype.entree1="§¤il§elle¤p2.nom¤§ heurte : ££other§Toc, toc££";
Lieu.prototype.emplacement="dans son lit";
Lieu.prototype.action='<span class="notDone">Tire la chevillette, la bobinette cherra. Le Loup tira la chevillette et la porte s’ouvrit.</span>';
Lieu.prototype.repare='<span class="notDone">il ferma la porte, et s’alla coucher dans le lit de la Mère-grand</span>';
Lieu.prototype.entree2="heurter à la porte. ££other§Toc, toc££";
Lieu.prototype.arriver="entrer";
Lieu.prototype.cacher="dans le lit sous la couverture";
Lieu.prototype.objetEmplacement="sur la huche";
Lieu.prototype.demandeVenir="te coucher avec moi";
Lieu.prototype.approche='<span class="notDone">se déshabille, et va se mettre dans le lit</span>';
Lieu.prototype.decouverte='<span class="notDone">en son déshabillé</span>';