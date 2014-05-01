var app = angular.module("projectTracker",[
                                           'http-auth-interceptor',
                                           'content',
                                           'ngResource',
                                           'ngSanitize',
                                           'ngRoute',
                                           'ui.router'
                                           ]);

//app.config(['$routeProvider',function($routeProvider){
//        $routeProvider
//        
//        	.when('/',{templateUrl:'app/partials/login.html', controller: 'loginController'})
//        	
//        	.when('/home',{templateUrl:'app/partials/home.html', controller: 'homeController'})
//
//        	.when('/serial_numbers',{templateUrl: 'app/partials/serials.html', controller: 'serialNumbersController'})
//        	
//        	.otherwise({redirectTo :'/'});
//        
//    }]);

app.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/login");
	
	$stateProvider
		.state('login', {
			url: '/login',
			controller: 'loginController',
			views: {
				"content": {templateUrl: "app/partials/login.html"}
			}
		})
	
		.state('home', {
			url: "/home",
			views: { 
				      "header":	{templateUrl: "app/partials/header.html"},
			         'content':	{templateUrl: "app/partials/home.html",
								  controller:  "homeController"
								},
		     'dataUpload@home':	{templateUrl: "app/partials/data_upload_form.html"},
		       'projects@home': {templateUrl: "app/partials/projects.html"}
			}
		})
		
//		.state('home.dataUpload', {
//			views: {
//				"dataUpload@home.dataUpload": {templateUrl: "app/partials/data_upload_form.html"}
//			}
//		})
//		
//		.state('home.projects', {
//			views: {
//				"projects@home.projects":  {templateUrl: "app/partials/projects.html",
//								    		 controller: "projectsController"
//				}
//			}
//		})
//		
//		.state('project_home', {
//			       url: "/project_home",
//			controller: 'projectHomeController',
//			     views: {
//			    	 "content": {templateUrl: "app/partials/serial_numbers.html"}
//			     }
//		})
//		
//		.state('test_history', {
//			url: "/test_history",
//			controller: 'testHistoryController',
//			views: {
//				"test_history": {templateUrl: "app/partials/test_attempts.html"},
//				"test_results": {templateUrl: "app/partials/test_results.html"}
//			}
//		})
		
});


app.run(function($http,CSRF_TOKEN){
            $http.defaults.headers.common['csrf_token'] = CSRF_TOKEN;
        });

app.run(function($rootScope) {
	$rootScope.rsrc_path = '/pcbtracker/public/service/';
});

//app.run(['$rootScope','$state','$stateParams', function($rootScope, $state, $stateParams) {
//	$rootScope.$state = $state;
//	$rootScope.$stateParams = $stateParams;
//}]);

app.directive('authMessages', function() {
    return {
        restrict: 'C',
        link: function($scope) {
          
          $scope.$on('event:auth-loginRequired', function() {
        	  $rootScope.flash = "Login Failed";
          });
          
          $scope.$on('event:auth-loginConfirmed', function() {
          
          });
        }
      }
    });