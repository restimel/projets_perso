<?php

$text = '<!DOCTYPE html>
<html>
<head>
<!--
Labs.html

Author: Benoit Mariat (b.mariat@gmail.com)
Date: November 2010

License: You are free to use, share, redistribute and modify it if you keep all authors and contributors names. ( http://creativecommons.org/licenses/by/3.0/)

Vous êtes autorisés à utiliser, partager, redistribuer et modifier ce code tant que vous gardez les noms des auteurs et contributeurs. (http://creativecommons.org/licenses/by/3.0/deed.fr)


Content: Lots of fun stuff ;)
Original file: http://b.mariat.free.fr/javascript/labs/

	(\')_(\')
	( °-° )
	(__.__)
	(") (")

-->
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<title>
My Labs
</title>
<link rel="stylesheet" href="./labs.css" type="text/css" >
</head>
<body id="labsBody">

<div class="labsZoneMenu labsZoneGauche"><div>
<div class="menu labsMenuGauche"><ul>
';
//TODO la liste

$text .= '<li>javascript</li><li><ul><li description="Une animation représentant une allumette.<br>Le <i>dessin</i> n\'a été réalisé qu\'avec du CSS. Le javascript est utilisé pour réalisé les animations."><a href="./scripts/flamme.html">Allumette</a></li></ul></li>
';

//TODO jusqu'ici
$text .= '
</ul></div>
</div></div>

<div id="labsDemo"></div>

<div class="labsZoneMenu labsZoneDroite">
<div><div class="menu labsMenuDroite">
<input type="hidden" id="labsDefaultTitreDescription" value="';
$text .='Le Titre'; //TODO a localiser
$text .= '">
<div id="labsTitreDescription"></div>
<div id="labsDescription"></div>
<input type="hidden" id="labsDefaultDescription" value="';
$text .= 'Description de ce qu\'on peut voir soit dans le menu soit dans la zone centrale où il doit y avoir un code.<br>Bon là c\'est juste un test.'; //TODO à localiser
$text .= '">
</div></div></div>

<div id="labsChargement">En cours de chargement...</div>

<script type="text/javascript" src="./labs.js"></script>
</body>
</html>';


$fileLabs = fopen("./test.html","w");
if($fileLabs!=""){
	fputs($fileLabs,$text);
	fclose($fileLabs);
}

?>

<a href="./test.html">done...</a>
