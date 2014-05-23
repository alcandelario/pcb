angular.module("projectTracker")	
	
    /**
     * 
     * overview of all user projects
	 *
	 **/
	.controller('homeController', function($scope,$rootScope,Projects,SharedDataSvc){
    	    var projects = Projects.query();
    	    $scope.projects = projects;   
    })
    
    /**
     * 
     * individual project home
     *
     **/
    .controller('projectHomeController',function($cookieStore,$scope,$stateParams,$location,Projects,Serial_Numbers,SharedDataSvc){
    	
    	$scope.serials = Serial_Numbers.query({projectID:$stateParams.projectID});
    	$scope.projectName = $stateParams.projectName;
 
    	$cookieStore.put("projectName", $stateParams.projectName);
    	$cookieStore.put("projectID", $stateParams.projectID);
    })
    
    /**
     * 
     * Unit under test (UUT) history of test attempts
     *
     **/
    .controller('testHistoryController',function($cookieStore,$scope,$stateParams,Serial_Numbers,Test_Attempts,SharedDataSvc){
    	$scope.projectName = $cookieStore.get("projectName");
    	$scope.projectID = $cookieStore.get("projectID");
    	
    	$scope.history = Test_Attempts.query({serialID:$stateParams.serialID});
    	
    	$scope.history.$promise.then(function(result){
    		$scope.serialNumber = result[0].serial_number.pcb;
    	});
    	
    	$cookieStore.put("serialD", $stateParams.serialID);
    })
    
    /** 
     * 
     * UUT test attempt results
     *
     **/
    .controller('testResultsController',function($scope,$stateParams,$location,Serial_Numbers,Test_Attempts,Test_Results,SharedDataSvc){
    	
    	$scope.testData = Test_Results.query({attemptID:$stateParams.resultID});
    	    	
    })
    
    /**
     * 
     * Control app wide functions (i.e. Authentication)
     *
     **/
    .controller('MainController', function($scope,$rootScope,$state,$sanitize,$location,Authenticate,SharedDataSvc,authService,Flash,$cookieStore) {
       	$defaultState = 'home';				// where to go after logging in
       	
    	$scope.logout = function (){
    		Authenticate.get({});  			// our index() server endpoint will logout the user
    		$cookieStore.put('user_logged_in','false');
    		$cookieStore.put('username', '');
         	$cookieStore.put('email', '');
    		
    		$rootScope.$broadcast('event:auth-loginRequired', {data: {flash: 'userLogout'}});
    		$state.go("login");
    	}
    	
        $scope.login = function(){
	
         	Authenticate.save({
                 'email': $sanitize($scope.email),
                 'password': $sanitize($scope.password)
             },
             
             function(data) {
    
            	// broadcast a successful login event
             	authService.loginConfirmed();
             	
             	// store user profile data
             	$cookieStore.put('user_logged_in', 'true');
             	$cookieStore.put('username', data.user.username);
             	$cookieStore.put('email', data.user.email);
                $rootScope.username = data.user.username;  // to populate header 
        		
               // go to our default state if its NOT an expired session
                if($rootScope.sessionExpired == false || typeof $rootScope.sessionExpired === 'undefined'){
                	$state.go($defaultState);
                }
                // otherwise just reset the session flag and stay in current state
                else{
                	$cookieStore.put('sessionExpired', 'false');
                }
             },
             
             function(response){
                // this "auth failed" block won't execute if
            	// the "http-auth-interceptor" module is running. In that case,
            	// use $scope.$on(event:loginRequired) to catch failed logins
             	authService.loginCancelled();
                Flash.show("Sorry but your login credentials aren't working. Try again.");
             })
         }
    })
    
    .controller('fileUploadController', function($cookieStore,$scope,$fileUploader,$location) {
    	// build the route Laravel will respond to for file uploads
    	var $projectID = $cookieStore.get('projectID');
    	var $url = $location.absUrl();
    	var $path = "#"+$location.path();
    	var $mode = "0"    //default upload mode
    	$url = $url.replace($path,"/upload_data/"+$mode);
    	
    	// create a uploader with options
        var uploader = $scope.uploader = $fileUploader.create({
               scope: $scope,                          // to automatically update the html. Default: $rootScope
                 url: $url,
            formData: [
                       { id: $projectID }
            ],
            filters: [
                function (item) {                    // first user filter
                 
                	return true;
                }
            ]
        });
        
        
     // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            console.info('After adding a file', item);
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
        });

        uploader.bind('afteraddingall', function (event, items) {
            console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            console.info('Success', xhr, item, response);
        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.info('Error', xhr, item, response);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            console.info('Complete all', items);
        });

    
    })
    
    
    