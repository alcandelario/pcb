var app = angular.module("projectTracker",[
                                           'http-auth-interceptor',
                                           'content',
                                           'ngResource',
                                           'ngSanitize',
                                           'ngRoute',
                                           'ui.router',
                                           'ngCookies',
                                           'angularFileUpload',
                                           'ui.bootstrap',
                                           'googlechart',
                                           'ui.bootstrap'
                                           ]
);


app.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/login");
	
	$stateProvider
		.state('login', {
				   url: '/login',
			controller: 'MainController',
				 views: {"viewContent": {templateUrl: "app/partials/login.html"}}
		})		
		
		.state('home', {
			url: "/home",
			views: { 
				    'viewContent@': {templateUrl: "app/partials/all-projects.html",
			             		      controller: "homeController"},
		    'viewAllProjects@home': {templateUrl: "app/partials/projects.html",
		    						  controller: "homeController"},
		 'viewProjectToolbar@home': {templateUrl: "app/partials/project-toolbar.html",
		 							  controller: "homeController"}
			}
		})
		
		
		.state('project', {
			url: "/project/:projectID"
	  
		})
		
		.state('project.home', {
			  url: '/:projectName',
			views: {
				'viewContent': {templateUrl: 'app/partials/project-home.html',
					    		 controller: 'projectHomeController'},
				'serialNums@project.home': {templateUrl: "app/partials/serial-numbers.html"}
			}
		})
		
		.state('history', {
				   url: '/history'
		})
		
		.state('history.serial', {
			url: '/serial/:serialID',
			views: {
				'viewContent': {templateUrl: 'app/partials/project-home.html',
				   	 	         controller: 'testHistoryController'},
				'nestedOne@history.serial': {templateUrl: "app/partials/serial-history.html"}
			}
		})
		
		.state('history.serial.awt-data', {
			url: '/awt/:resultID',
			views: {
				'results@history.serial' : {templateUrl: 'app/partials/test-results.html',
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

		.state('charts', {
			url: '/analyis/:projectID'
		})

		.state('charts.test-data', {
			url:'/test-data/:serialID',
			views: {
				'viewContent': {templateUrl: 'app/partials/project-home.html',
								 controller: 'googleChartsController'},
				'nestedOne@charts.test-data': {templateUrl: "app/partials/serial-history.html"},
				'nestedTwo@charts.test-data': {templateUrl: "app/partials/google-charts.html"}
			   									
			}
		})

});


app.run(function($http,CSRF_TOKEN){
            $http.defaults.headers.common['csrf_token'] = CSRF_TOKEN;
});

// application config
app.run(function($rootScope) {
	$rootScope.rsrc_path = '/pcbtracker/public/service/';
	$rootScope.showFlash = false;
	$rootScope.showLoginFlash = false;
});

// app-wide accessible services 
app.run(
		[        '$rootScope', '$state', '$stateParams','DashUrl',
		 function($rootScope, $state, $stateParams,DashUrl) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;		
			$rootScope.DashUrl = DashUrl;	
		}])
// convert pgSQL dates into js Date() objects
app.filter('DT_filter', function() {
	return function(input){
		var date = new Date(input);
		return date
	}
})