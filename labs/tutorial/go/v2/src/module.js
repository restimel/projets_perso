

var tutorialApp = angular.module('tutorialApp', [
		'ngRoute',
		'tutoCtrls',
	]);

tutorialApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.when('/:menuId/:pageId',{
			templateUrl : 'partials/tutoriel.html',
			controller : "tutoCtrl"
		}).when('/',{
			templateUrl : 'partials/accueil.html',
			controller : "tutoCtrl"
		}).otherwise({redirectTo : '/'});
	}]);

tutorialApp.filter('inArray', function(){
	return function(input, list, propertyName){
		
		if(input instanceof Array){
			var out = [],
				i,li=input.length;
			
			for(i=0;i<li;i++){
				if(list.indexOf(input[i][propertyName].toLowerCase()) !== -1){
					out.push(input[i]);
				}
			}

			return out;
		}else{
			return input;
		}
	};
});

tutorialApp.filter('displayMenu',function($sce){
	var mId;
	function displayItem(item){
		if(!item) return "";
		
		var out = '<li>';
		if(item.lien){
			out += '<a href="#/'+mId+'/'+item.lien+'">'+item.titre+'</a>';
		}else{
			out += item.titre;
		}
		if(typeof item.sousMenu === "object"){
			out += "<ul>"+displayItems(item.sousMenu)+"</ul>";
		}
		out += "</li>";
		return out;
	}

	function displayItems(items,menuId){
		if(typeof menuId !== "undefined") mId = menuId;

		var i, item,
			out = "";

		if(items instanceof Array){
			for(i=0; i<items.length;i++){
				out += displayItem(items[i]);
			}
		}else{
			out = displayItem(items);
		}

		return $sce.trustAsHtml(out);
	}

	return displayItems;
});


