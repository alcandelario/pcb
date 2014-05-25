angular.module("projectTracker")	
	
    /**
     * 
     * overview of all user projects
	 *
	 **/
	.controller('homeController', function($scope,$rootScope,Projects,SharedDataSvc,$cookieStore){
    	    $cookieStore.put("projectName", "");
            $cookieStore.put("projectID", "");

            $scope.projects = Projects.query();

            $scope.projects.$promise.then(function (projects) {
            
              // add a clean url segment for project home links
                for(var count=0; count < projects.length; count++){
                    // extract one record and add to the array
                    var project = projects[count];
                    var name = project['name'];
                    projects[count]['projectUrl'] = $scope.DashUrl.makeUrl(name);
                }
                $scope.projects = projects;
            });  
    })
    
    /**
     * 
     * individual project home
     *
     **/
    .controller('projectHomeController',function($cookieStore,$rootScope,$scope,$stateParams,$location,Projects,Serial_Numbers,SharedDataSvc){
        $scope.hideNestedOne = 'true';
        $scope.hideNestedTwo = 'true';
        $scope.hideProjectHome = 'true';
        
        $scope.projectName = $cookieStore.get("projectName");

    	$scope.serials = Serial_Numbers.query({projectID:$stateParams.projectID});

        $scope.serials.$promise.then(function(serials) {
            $scope.projectName = serials[0].project.name;
            $scope.projectUrl =  $scope.DashUrl.makeUrl($scope.projectName);
            $cookieStore.put("projectName", $scope.projectName);
            $scope.hideProjectHome = "false";
        })

        // $scope.hideProjectHome = "false";
        $scope.projectID = $stateParams.projectID;
        $cookieStore.put("projectID", $scope.projectID);
    })
    
    /**
     * 
     * Unit under test (UUT) history of test attempts
     *
     **/
    .controller('testHistoryController',function($cookieStore,$scope,$rootScope,$stateParams,Serial_Numbers,Test_Attempts,SharedDataSvc){
    	$rootScope.hideNestedOne = 'false';  // make this available to directives that may need it

        $scope.projectName = $cookieStore.get("projectName");
    	$scope.projectID = $cookieStore.get("projectID");
    	
    	$scope.history = Test_Attempts.query({serialID:$stateParams.serialID});
    	
    	$scope.history.$promise.then(function(result){
    		$scope.serialNumber = result[0].serial_number.pcb;
    	});
    	
    	$cookieStore.put("serialID", $stateParams.serialID);
    })
    
    /** 
     * 
     * UUT test attempt results
     *
     **/
    .controller('testResultsController',function($scope,$stateParams,$location,Serial_Numbers,Test_Attempts,Test_Results,SharedDataSvc){
    	$scope.hideTestResults='true';

    	$scope.testData = Test_Results.query({attemptID:$stateParams.resultID});
        $scope.testData.$promise.then(function(result) {
            $scope.hideTestResults='false';
        })
    	    	
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
    
    .controller('fileUploadController', function($cookieStore, $scope,$fileUploader,$location) {
    	// build the route Laravel will respond to for file uploads
    	var $projectID = $cookieStore.get('projectID');
    	var $url = $location.absUrl();
    	var $path = "index.php?/#"+$location.path();
    	var $mode = "0"    //default upload mode
    	$url = $url.replace($path,"/service/upload_data");
    	
    	// create a uploader with options
        var uploader = $scope.uploader = $fileUploader.create({
               scope: $scope,                          // to automatically update the html. Default: $rootScope
                 url: $url,
            formData: [
                       { id: $projectID}
                              
            ],
            filters: [
                function (item) {                     // first user filter
                 
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
        	$scope.upload_status = "Your data was saved successfully!";
            console.info('Success', xhr, item, response);
        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
        	$scope.upload_status = "Uh oh, problem saving your data to the database";
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
    
    
    