var app = angular.module("projectTracker",[
                                           'http-auth-interceptor',
                                           'content',
                                           'ngResource',
                                           'ngSanitize',
                                           'ngRoute',
                                           'ui.router'
                                           ]
);


app.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/login");
	
	$stateProvider
		.state('login', {
				   url: '/login',
			controller: 'MainController',
				 views: {"content": {templateUrl: "app/partials/login.html"}}
		})
		
		
		.state('home', {
			url: "/home",
			views: { 
			        'content@': {templateUrl: "app/partials/home.html",
			             		  controller: "homeController"},
			 'leftColumn@home': {templateUrl: "app/partials/data_upload_form.html",
		    	 				  controller: "homeController"},
		    'rightColumn@home': {templateUrl: "app/partials/projects.html",
		    					  controller: "homeController"}
			}
		})
		
		
		.state('projects', {
			url: "/projects/:projectID",
		})
		
		.state('projects.home', {
			  url: '/:projectName',
			views: {
				'content': {templateUrl: 'app/partials/home.html',
							 controller: 'projectHomeController'
				},
				 'leftColumn@projects.home': {templateUrl: "app/partials/data_upload_form.html"},
				'rightColumn@projects.home': {templateUrl: "app/partials/serial_numbers.html"}
			}
		})
		
		.state('test_history', {
			url: '/test_history/:projectID',
		})
		
		.state('test_history.serial', {
			url: '/:serialID',
			views: {
				'content': {templateUrl: 'app/partials/home.html',
				   	 	     controller: 'testHistoryController'
				},
		 'leftColumn@test_history.serial': {templateUrl: "app/partials/data_upload_form.html"},
		'rightColumn@test_history.serial': {templateUrl: "app/partials/test_attempts.html"}
			}
		})
		
		.state('test_history.serial.awt_data', {
			url: '/awt_data/:resultID',
			views: {
				'results@test_history.serial.awt_data': {templateUrl: "app/partials/test_results.html",
														  controller: "testResultsController" }
			}
		})

		
		.state('login-needed', {
			url: '/login-needed',
			views: {
				'login@': 
				 {templateUrl: "app/partials/login.html",
				   controller: "MainController"
			     }
			}
		})

});


app.run(function($http,CSRF_TOKEN){
            $http.defaults.headers.common['csrf_token'] = CSRF_TOKEN;
        });


app.run(function($rootScope) {
	$rootScope.rsrc_path = '/pcbtracker/public/service/';
});


app.run(
		[        '$rootScope', '$state', '$stateParams',
		 function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;			
		}])

		
app.directive('ifLoginRequired', ['$compile','$http','$templateCache','$rootScope','Flash', function($rootScope,Flash,$compile,$http,$templateCache) {
		/**
		 * Directive: To handle session expiration
		 * 
		 * Use http-auth-interceptor to look for any 401 (unauthorized) events
		 * and prompt user to login
		 * 
	     **/
	
		var getTemplate = function(){
			return $http.get("app/partials/login.html", {cache: $templateCache});
		}
	
	
		var linker = function(scope,element,attrs) {
				scope.$on('event:auth-loginRequired', function($rootScope,Flash) {
					/*
					 * Flash a static alert message inside the 'login' partial 
					 *   &&&&& A "dynamic messages" service is likely needed &&&&&
					 */
					
					// don't do this for a fresh login that failed, though
					$rootScope.sessionExpired = true;
					
					if($rootScope.freshLogin == false){		
						var template = getTemplate();
						
						var promise = template.success(function(html) {
							element.html(html);
						}).then(function (response) {
							var compiled = $compile(element.html())(scope);
							element.replaceWith(compiled);
							element = compiled;
						})
					}
					else {
						Flash.show('Login Failed bud...try again');
					}
				});
			
		        
				scope.$on('event:auth-loginConfirmed', function($rootScope) {
					// remove the login partial
					Flash.clear();
					
					var compiled = $compile('<div></div>')(scope);
					element.replaceWith(compiled);
					element = compiled;
				});
			}
	
	return {
		restrict: 'E',
		    link: linker,
  	     replace: true
	}		
}]);


app.directive('showLogoutBtn', ['$compile','$templateCache','$state','$rootScope', function($rootScope,$state,$compile,$http,$templateCache) {
	/**
	 * Directive: For logout button visibility
	 * 
	 * Either default to invisible or make "logout" button invisible,
	 * based on user's auth status
	 *
	 **/
	
//	var linker = function(scope,element,attrs) {
//		// default state of this button
//		$rootScope.showLogoutBtn = true;
//
//		
//		scope.$on('event:auth-loginConfirmed', function() {
//			$rootScope.showLogoutBtn = true; 
//		});
//		scope.$on('event:auth-loginRequired', function() {
//			$rootScope.showLogoutBtn = false;
//		})
//	}

return {
	restrict: 'A',
//	    link: linker,
	 replace: true,
	 controller: function($rootScope,$scope) {
		 $rootScope.showLogoutBtn = true;
		 
		 $scope.$on('event:auth-loginConfirmed', function() {
				$rootScope.showLogoutBtn = true; 
		});
		
		 $scope.$on('event:auth-loginRequired', function() {
				$rootScope.showLogoutBtn = false;
		});
	 }
}		
}]);