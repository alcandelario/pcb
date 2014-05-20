angular.module("projectTracker")	
	
    /**
     * 
     * overview of all user projects
	 *
	 **/
	.controller('homeController', function($scope,$rootScope,Projects,SharedDataSvc){
		    var shared = SharedDataSvc.getShared();
		    
    	    var projects = Projects.query();
    	    $scope.projects = projects;   
    })
    
    /**
     * 
     * individual project home
     *
     **/
    .controller('projectHomeController',function($scope,$stateParams,$location,Projects,Serial_Numbers,SharedDataSvc){
    	
    	$scope.serials = Serial_Numbers.query({projectID:$stateParams.projectID});
 
    	SharedDataSvc.setShared("projectName", $stateParams.projectName);
    	SharedDataSvc.setShared("projectID", $stateParams.projectID);
    })
    
    /**
     * 
     * Unit under test (UUT) history of test attempts
     *
     **/
    .controller('testHistoryController',function($scope,$stateParams,Serial_Numbers,Test_Attempts,SharedDataSvc){
    	var $userdata = SharedDataSvc.getShared();
    	
    	$history = Test_Attempts.query({serialID:$stateParams.serialID});
    	
//    	$history.$promise.then(function(result){
//    		$scope.pcb = $history[0].serial_number.pcb;
//    		$scope.projectID = $history[0].projectID;
//    	}
    	SharedDataSvc.setShared("curSerialId", $stateParams.id);
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
    .controller('MainController', function($scope,$rootScope,$state,$sanitize,$location,Authenticate,SharedDataSvc,authService,Flash) {
    	//$rootScope.sessionExpired = false;  // if it is a new login, technically session hasn't expired
       	$defaultState = 'home';				// where to go after logging in
       	$rootScope.isLoggedIn = false;      // default button visibility 
       	
    	$scope.logout = function (){
    		Authenticate.get({});  			// our index() server endpoint will logout the user
    		$rootScope.userLoggedIn = false;
    		$rootScope.$broadcast('event:auth-loginRequired', {data: {flash: 'userLogout'}});
    		$state.go("login");
    	}
    	
        $scope.login = function(){
	
         	Authenticate.save({
                 'email': $sanitize($scope.email),
                 'password': $sanitize($scope.password)
             },
             
             function(data,$rootScope) {
    
            	// broadcast a successful login event
             	authService.loginConfirmed();
             	$rootScope.userLoggedIn = true;
             	$rootScope.username = data.user.username;
             	$rootScope.email = data.user.email;
             	
                // go to a default state if its a fresh login o
                if($rootScope.sessionExpired == false || typeof $rootScope.sessionExpired === 'undefined'){
                	$state.go($defaultState);
                }
                // otherwise just reset the session flag and stay in current state
                else{
                	$rootScope.sessionExpired = false;
                }
             },
             
             function(response){
                // Auth Failed
             	authService.loginCancelled();

                SharedDataSvc.setShared("flash","Sorry but your login credentials aren't working. Try again.");
             	
             	Flash.show("Login Failed");
             })
         }
    })
    

    
    