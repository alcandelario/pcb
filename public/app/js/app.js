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
	$rootScope.showFlash = false;
	$rootScope.showLoginFlash = false;
});


app.run(
		[        '$rootScope', '$state', '$stateParams',
		 function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;			
		}])

		
app.directive('ifLoginRequired', ['$compile','$http','$templateCache','Flash','authService', function($compile,$http,$templateCache,Flash,authService) {
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
			
				scope.$on('event:auth-loginRequired', function(event,message) {
					/*
					 * Display the 'login' partial and flash a "session expired" alert.
					 * Do not display partial if a new page load, failed login, or
					 * if user manually logs out
					 */
					
				  
					if(message.data.flash != 'userLogout' && message.data.flash != "Authentication failed"){
						
						// session must have expired so show a login partial
						var loader = getTemplate();
					
						var promise = loader.success(function(html) {
							element.html(html);
						})
						.then(function(response) {
						
							var compiled = $compile(element.html())(scope);
							element.replaceWith(compiled);
							element = compiled;
						})
						Flash.show("login_flash", "Your session expired. Please log the fuck back in");
					}
					else if(message.data.flash == 'Authentication failed'){
						
						// failed login attempt
						authService.loginCancelled();  // dump any buffered http requests
						Flash.show("login_flash","Sorry but your email/password combo did not work. Try again");
					}
				})
			
		        
				scope.$on('event:auth-loginConfirmed', function($rootScope) {
					scope.sessionExpired = false;
					
					// remove the login partial
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

app.directive('loggedInNav', ['$compile','$http','$templateCache','Flash','$rootScope', function($compile,$http,$templateCache,Flash,$rootScope) {
	/**
	 * Directive: To handle nav bar display
	 * 
	 * 
     **/

	var getTemplate = function(){
		return $http.get("app/partials/header.html", {cache: $templateCache});
	}


	var linker = function(scope,element,attrs) {
		
		var template = function () {
			var loader = getTemplate();
		
			var promise = loader.success(function(html) {
				element.html(html);
			})
			.then(function(response) {
		
				var compiled = $compile(element.html())(scope);
				element.replaceWith(compiled);
				element = compiled;
			})
		}
		
		
			if($rootScope.userLoggedIn === true){
				template();
			}
			
			scope.$on('event:auth-loginConfirmed', function() {
				/*
				 * Display the 'header' partial
				 */
				
				template();
			})
		
	        
			scope.$on('event:auth-loginRequired', function(event,message) {
			
				// remove the header partial if the user logged out
				if(message.data.flash == 'userLogout'){
					scope.sessionExpired = true;
					var compiled = $compile('<div></div>')(scope);
					element.replaceWith(compiled);
					element = compiled;
				}
			});
		}

return {
	restrict: 'A',
	    link: linker,
     replace: true
}		
}]);


//app.directive('loggedInNav', ['$compile','$http','$templateCache','$rootScope', function($compile,$http,$templateCache,$rootScope) {
//	/**
//	 * Directive: For logout button visibility
//	 * 
//	 * Either default to invisible or make "logout" button invisible,
//	 * based on user's auth status
//	 *
//	 **/
//	
//	var linker = function(scope,element,attrs) {
//		// default state of this button
//	//	$rootScope.isLoggedIn = true;
//
//		
//		scope.$on('event:auth-loginConfirmed', function() {
//			$rootScope.isLoggedIn = true; 
//		});
//		scope.$on('event:auth-loginRequired', function() {
//			$rootScope.isLoggedIn = false; 
//		})
//	}
//
//return {
//	restrict: 'A',
//	    link: linker,
//	 replace: true,
//}		
//}]);