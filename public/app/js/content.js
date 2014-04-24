angular.module('content',[])

	.controller('ContentController',function($scope,$location,Authenticate,SharedDataSvc){
		
		$scope.logout = function (){
	        Authenticate.get({},function(){
	        	SharedDataSvc.setShared("flash","You've logged out, "+$scope.username);
	            $location.path('/')
	        })
	    }
		
	});