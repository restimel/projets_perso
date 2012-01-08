	
function adaptString(str,listeObj){
	function analyseMotif(m,masculin,masculin2,feminin,feminin2,obj,ref){
		var message="";
		if(listeObj[obj][ref+"Sexe"]==="F"){
			if("aeiouy".indexOf(listeObj[obj][ref].charAt(0))===-1){
				message = feminin;
			}else{
				message = feminin2;
			}
		}else{
			if("aeiouy".indexOf(listeObj[obj][ref].charAt(0))===-1){
				message = masculin;
			}else{
				message = masculin2;
			}
		}
		return message;
	}
	function analyseSimpleMotif(m,obj,ref){
		return listeObj[obj][ref];
	}
	function dialogue(m,interlocuteur,dialogue){
		var interlocuteur=listeObj[interlocuteur];
		var message = dialogue;
		if(interlocuteur){
			switch(interlocuteur.etat){
				case "enrhumé":
					message=message.replace(/m/g,"b").replace(/j/g,"z").replace(/c(?![^eih'])/g,"g").replace(/k/g,"g").replace(/q/g,"g").replace(/t(?![ s.,])/g,"d");
					message=message.replace(/M/g,"B").replace(/J/g,"Z").replace(/C(?![^eih'])/g,"G").replace(/K/g,"G").replace(/Q/g,"G").replace(/T(?![ s.,])/g,"D");
					break;
			}
		}
		return '<span class="dialogue">'+message+'</span>';
	}
	var message = str.replace(/§¤([^§¤]*)§?([^§¤]*)§([^§¤]*)§?([^§¤]*)¤([^§¤.]*)[§.]([^§¤.]*)¤§/g,analyseMotif);
	message = message.replace(/¤¤([^.¤]*)\.([^.¤]*)¤¤/g,analyseSimpleMotif);
	message = message.replace(/££([^£.§]*)§([^£]*)££/g,dialogue);
	return message;
}


function histoire(p1,p2,p3,p4,l1,l2,l3,o1){
	var lstObj={other:null,p1:p1,p2:p2,p3:p3,p4:p4,l1:l1,l2:l2,l3:l3,o1:o1,t1:p1,t2:p2};//t1 et t2 sont des objetse temporaire (pour les actions identiques avec des persos différents)
	var introduction="<p>";
	introduction+="Il était une fois un";
	if(p1.nomSexe==="F") introduction+="e";
	introduction+=" "+p1.nom+" dans un"+(l1.nomSexe==="F"?"e":"")+" "+l1.nom;
	introduction+=adaptString(p1.introductionCarac+". ",lstObj);//p1.introCarac(p3);
	introduction+=adaptString(p1.introductionSurnom,lstObj)+"<br/>"; //introduction+=p1.introSurnom(p3)+"<br>";
	introduction+=adaptString(p1.introductionMission,lstObj);//p1.introMission(p3)+"</p>";
	introduction+="</p>";
	
	var rencontre="<p>";
	rencontre+=adaptString("§¤Le §L'§La §L'¤p1.surnom¤§¤¤p1.surnom¤¤ partit aussitôt pour aller chez "+p1.relationnel3+"¤¤p3.surnom¤¤, qui demeurait dans §¤un§une¤l3.nom¤§ ¤¤l3.nom¤¤.",lstObj);
	rencontre+=adaptString(" En passant dans §¤un§une¤l2.nom¤§ ¤¤l2.nom¤¤, §¤il§elle¤p1.nom¤§ rencontra §¤le §l'§la §l'¤p2.nom¤§¤¤p2.nom¤¤"+p2.rencontreVolonte+" ; mais §¤il§elle¤p2.nom¤§ n'osa, à cause ¤¤l2.protecteurs¤¤ qui étai"+(l2.protecteursNb>1?"ent":"t")+" dans §¤le §l'§la §l'¤l2.surnom¤§¤¤l2.surnom¤¤.",lstObj);
	rencontre+=adaptString(" §¤Il§Elle¤p2.nom¤§ lui demanda où §¤il§elle¤p1.nom¤§ allait ; §¤le §l'§la §l'¤p1.nom¤§¤¤p1.nom¤¤, qui ne savait pas qu'il est dangereux de s'arrêter à écouter §¤un§une¤p2.nom¤§ ¤¤p2.nom¤¤, lui répondit : ",lstObj)+"<br/>";
	rencontre+=adaptString(" — ££p1§Je vais voir "+p1.relationnel1+"¤¤p3.surnom¤¤, et lui porter ¤¤o1.nom¤¤"+p1.rencontreDialogue1+".££",lstObj)+"<br/>";
	rencontre+=adaptString(" — ££p2§Demeure-t-§¤il§elle¤p3.surnom¤§ bien loin ?££ lui dit §¤le §l'§la §l'¤p2.nom¤§¤¤p2.nom¤¤.",lstObj)+"<br/>";
	rencontre+=adaptString(" — ££p1§Oh ! oui££, dit §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, ££p1§c'est par-delà ¤¤l3.repere¤¤ que vous voyez tout là-bas¤¤l3.distance¤¤.££",lstObj)+"<br/>";
	rencontre+=adaptString(" — ££p2§Eh bien££, dit §¤le §l'§la §l'¤p2.nom¤§¤¤p2.nom¤¤, ££p2§je veux l'aller voir aussi ; je m'y en vais par ce chemin-ci, et toi par ce chemin-là, et nous verrons qui plus tôt y sera.££",lstObj)+"<br/>";
	rencontre+=adaptString("§¤Le §L'§La §L'¤p2.nom¤§¤¤p2.nom¤¤ se mit à courir de toute sa force par le chemin qui était le plus court, et §¤le §l'§la §l'¤p1.nom¤§¤¤p1.nom¤¤ s'en alla par le chemin le plus long"+l2.perturbation+".",lstObj)+"<br/>";
	rencontre+="</p>";
	
	var attaque1="<p>";
	attaque1+=adaptString("§¤Le §L'§La §L'¤p2.nom¤§¤¤p2.nom¤¤ ne fut pas longtemps à arriver à §¤le §l'§la §l'¤l3.surnom¤§¤¤l3.surnom¤¤ de §¤le §l'§la §l'¤p3.surnom¤§¤¤p3.surnom¤¤ ; "+l3.entree1+".",lstObj)+"<br/>";
	attaque1+=adaptString(" — ££p3§Qui est là ?££",lstObj)+"<br/>";
	attaque1+=adaptString(" — ££p2§C'est "+p1.relationnel2+"¤¤p1.nom¤¤ §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤££, dit §¤le §l'§la §l'¤p2.nom¤§¤¤p2.nom¤¤ en contrefaisant sa voix, ££p2§qui vous apporte ¤¤o1.nom¤¤"+p1.attaque1Dialogue1+"££",lstObj)+"<br/>";
	attaque1+=adaptString("§¤Le §L'§La §L'¤p3.surnom¤§¤¤p3.surnom¤¤, qui était "+l3.emplacement+" à cause qu'§¤il§elle¤p3.nom¤§ "+p1.attaque1Raison+", lui cria :",lstObj);
	lstObj.t1=p3;
	lstObj.t2=p2;
	attaque1+=adaptString(l3.action,lstObj);
	attaque1+=adaptString(" "+p2.attaque1attaque,lstObj);
	attaque1+=adaptString(" Ensuite "+l3.repare+", en attendant §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤, qui quelque temps après vint "+l3.entree2,lstObj)+"<br/>";
	attaque1+=adaptString(" — ££p2§Qui est là ?££",lstObj)+"<br/>";
	attaque1+=adaptString("§¤Le §L'§La §L'¤p1.surnom¤§¤¤p1.surnom¤¤, qui entendit "+p2.attaque1voix+" eut peur d'abord, mais croyant que "+p1.relationnel3+" ¤¤p3.surnom¤¤ "+p1.attaque1Visite+", répondit :",lstObj)+"<br/>";
	attaque1+=adaptString(" — ££p1§C'est "+p1.relationnel2+"¤¤p1.nom¤¤ §¤le §l'§la §l'¤p1.surnom¤§¤¤p1.surnom¤¤ qui vous apporte ¤¤o1.nom¤¤"+p1.attaque1Dialogue1+"££",lstObj)+"<br/>";
	attaque1+=adaptString("§¤Le §L'§La §L'¤p2.nom¤§¤¤p2.nom¤¤ lui cria en "+p2.attaque1voixAmeliore+" : ",lstObj);
	lstObj.t1=p2;
	lstObj.t2=p1;
	attaque1+=adaptString(l3.action,lstObj);
	attaque1+="</p>";
	
	var attaque2="<p>";
	attaque2+=adaptString("§¤Le §L'§La §L'¤p2.nom¤§¤¤p2.nom¤¤ §¤le§la¤p1.nom¤§ voyant ¤¤l3.arriver¤¤, lui dit en se cachant "+l2.cacher+" :",lstObj)+"<br/>";
	attaque2+=adaptString(" — ££p2§Mets ¤¤o1.le¤¤ "+l3.objetEmplacement+", et viens "+l3.demandeVenir+".££",lstObj)+"<br/>";
	attaque2+=adaptString("§¤Le §L'§La §L'¤p1.surnom¤§¤¤p1.surnom¤¤ "+l3.approche+", où §¤il§elle¤p1.nom¤§ fut bien §¤étonné§étonnée¤p1.nom¤§ de voir comment "+p1.relationnel3+"¤¤p3.surnom¤¤ était §¤fait§faite¤p3.surnom¤§ "+l3.decouverte+". §¤Il§Elle¤p1.nom¤§ lui dit : ",lstObj)+"<br/>";
	var i=0,li=p2.questions.length;
	do{
		attaque2+=adaptString(" — ££p1§"+p1.relationnel1+" ¤¤p3.surnom¤¤, que vous avez "+p2.questions[i][0]+" ?££",lstObj)+"<br/>";
		attaque2+=adaptString(" — ££p2§C'est pour mieux "+p2.questions[i][1]+", ¤¤p1.relationnel0¤¤.££",lstObj)+"<br/>";
	}while(++i<li);
	attaque2+=adaptString("Et en disant ces mots, §¤ce§cet§cette§cette¤p2.surnom¤§ ¤¤p2.surnom¤¤ "+p2.attaque2attaque+".",lstObj);
	attaque2+="</p>";
	
	return introduction+rencontre+attaque1+attaque2;
}