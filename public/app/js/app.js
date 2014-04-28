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
	$urlRouterProvider.otherwise("/");
	
	$stateProvider
		.state('/', {
			url: "/",
			templateUrl: 'partials/login.html',
			controller: 'loginController'
		})
	
		.state('home', {
			url: "/home",
			templateUrl: "partials/home.html",
			controller: 'homeController'
		})	
		
		.state('project_home', {
			url: "/project_home",
			templateUrl: "partials/project_home.html"
		})
		
});


app.run(function($http,CSRF_TOKEN){
            $http.defaults.headers.common['csrf_token'] = CSRF_TOKEN;
        });

app.run(function($rootScope) {
	$rootScope.rsrc_path = '/pcbtracker/public/service/';
});

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