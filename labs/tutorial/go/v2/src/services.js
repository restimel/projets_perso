var tutoSrv = angular.module('tutoSrvs', []);

tutoSrv.factory("info",function($http){
	var service = {};

	service.getPath = function(pageId){
		if(service.pages[pageId]){
			return service.pages[pageId].url;
		}else{
			return "";
		}
	};

	service.getLexique = function(pageId){
		if(service.pages[pageId]){
			return service.pages[pageId].lexique;
		}else{
			return [];
		}
	};

	service.getTitle = function(pageId){
		if(service.pages[pageId]){
			return service.pages[pageId].title;
		}else{
			return "";
		}
	};

	service.getMenu = function(menuId){
		if(service.menu[menuId]){
			return service.menu[menuId];
		}else{
			return {};
		}
	};

	service.isMenu = function(menuId){
		return service.menu[menuId]?true:false;
	}

	service.isPage = function(pageId){
		return service.pages[pageId]?true:false;
	}

	//Load files

	$http.get('./data/lexique.json').success(function(data,status) {
		service.lexique = data;
		callback();
	});

	$http.get('./data/pages.json').success(function(data,status) {
		service.pages = data;
		callback();
	});

	$http.get('./data/menu.json').success(function(data,status) {
		service.menu = data;
		callback();
	});

	//ready is a call back function to execute when a file is loaded
	service.ready = null;

	function callback(){
		if(
			typeof service.lexique !== "undefined" &&
			typeof service.pages !== "undefined" &&
			typeof service.menu !== "undefined"
		){
			
			if(typeof service.ready === "function"){
				service.ready();
			}

			service.ready = true;
		}
	}

	return service;
});