
var tutoCtrl = angular.module('tutoCtrls', ['tutoSrvs']);

tutoCtrl.controller('tutoCtrl',[ '$scope', '$http', '$routeParams', '$filter', 'info',
	function tutoCtrl($scope,$http, $routeParams, $filter, info){
		$scope.menuId = $routeParams.menuId;
		$scope.pageId = $routeParams.pageId;

		$scope.menu = {};
		$scope.lexique = [];
		$scope.vocabulary = [];
		$scope.page = "";

		if(info.ready === true){
			setContext();
		}else{
			info.ready = function(){
				setContext();
			};
		}

		function setContext(){
			if(!info.isMenu($scope.menuId)){$scope.menuId = "menu";}
			if(!info.isPage($scope.pageId)){$scope.pageId = "accueil";}

			$scope.menu = info.getMenu($scope.menuId);
			$scope.lexique = info.lexique;
			$scope.vocabulary = info.getLexique($scope.pageId);
			$scope.page = info.getPath($scope.pageId);

			$scope.menuHTML = $filter('displayMenu')($scope.menu,$scope.menuId);
		}

}]);

