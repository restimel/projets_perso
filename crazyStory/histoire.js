	
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
		return '<span class="dialogue">'+message+'</span>';
	}
	var message = str.replace(/§¤([^§¤]*)§?([^§¤]*)§([^§¤]*)§?([^§¤]*)¤([^§¤.]*)[§.]([^§¤.]*)¤§/g,analyseMotif);
	message = message.replace(/¤¤([^.¤]*)\.([^.¤]*)¤¤/g,analyseSimpleMotif);
	message = message.replace(/££([^£.§]*)§([^£§]*)££/g,dialogue);
	return message;
}


function histoire(p1,p2,p3,p4,l1,l2,l3,o1){
	var lstObj={other:null,p1:p1,p2:p2,p3:p3,p4:p4,l1:l1,l2:l2,l3:l3,o1:o1};
	var introduction="<p>";
	introduction+="Il était une fois un";
	if(p1.nomSexe==="F") introduction+="e";
	introduction+=" "+p1.nom+" dans un"+(l1.nomSexe==="F"?"e":"")+" "+l1.nom;
	introduction+=adaptString(p1.introductionCarac,lstObj);//p1.introCarac(p3);
	introduction+=". ";
	introduction+=adaptString(p1.introductionSurnom,lstObj)+"<br>"; //introduction+=p1.introSurnom(p3)+"<br>";
	introduction+=adaptString(p1.introductionMission,lstObj);//p1.introMission(p3)+"</p>";
	introduction+="</p>";
	
	var rencontre="<p>";
	rencontre+=adaptString("§¤Le §L'§La §L'¤p1.surnom¤§¤¤p1.surnom¤¤ partit aussitôt pour aller chez SA ¤¤p3.surnom¤¤, qui demeurait dans §¤un§une¤l3.nom¤§ ¤¤l3.nom¤¤.",lstObj);
	rencontre+=adaptString(" En passant dans §¤un§une¤l2.nom¤§ ¤¤l2.nom¤¤, §¤il§elle¤p1.nom¤§ rencontra §¤le §l'§la §l'¤p2.nom¤§¤¤p2.nom¤¤, %%qui eut bien envie de la manger ; mais il n’osa, à cause de quelques Bûcherons qui étaient dans %%§¤le §l'§la §l'¤l2.surnom¤§¤¤l2.surnom¤¤.",lstObj);
	rencontre+="</p>";
	
	return introduction+rencontre;
}