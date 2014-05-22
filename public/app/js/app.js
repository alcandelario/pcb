var app = angular.module("projectTracker",[
                                           'http-auth-interceptor',
                                           'content',
                                           'ngResource',
                                           'ngSanitize',
                                           'ngRoute',
                                           'ui.router',
                                           'ngCookies',
                                           'angularFileUpload'
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
		    	 				  controller: "fileUploadController"},
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
				 'leftColumn@projects.home': {templateUrl: "app/partials/data_upload_form.html",
					 						   controller: 'fileUploadController'},
				'rightColumn@projects.home': {templateUrl: "app/partials/serial_numbers.html"}
			}
		})
		
		.state('test_history', {
				   url: '/test_history'
		})
		
		.state('test_history.serial', {
			url: '/:serialID',
			views: {
				'content': {templateUrl: 'app/partials/home.html',
				   	 	     controller: 'testHistoryController'},
				'leftColumn@test_history.serial':  {templateUrl: "app/partials/data_upload_form.html",
													controller: 'fileUploadController'},
				'rightColumn@test_history.serial': {templateUrl: "app/partials/test_attempts.html"}
			}
		})
		
		.state('test_history.serial.awt_data', {
			url: '/awt/:resultID',
			views: {
				'results@test_history.serial' : {templateUrl: 'app/partials/test_results.html',
												  controller: 'testResultsController'}
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
