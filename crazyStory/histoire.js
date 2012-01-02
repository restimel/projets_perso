
function histoire(p1,p2,p3){
	var introduction="";
	introduction+="Il était une fois un";
	if(p1.sexe==="F") introduction+="e";
	introduction+=" "+p1.nom+" dans un village";
	introduction+=p1.introCarac(p3);
	introduction+=". ";
	introduction+=p1.introDon(p3)+" ";
	introduction+=p1.introMission(p3)+" ";
	return introduction+"<br>";
}