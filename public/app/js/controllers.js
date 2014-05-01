angular.module("projectTracker")	
	
	// Login
	.controller('loginController',function($scope,$sanitize,$location,Authenticate,SharedDataSvc,authService,Flash){
        $data = SharedDataSvc.getShared();
        if($data !== null){
            $scope.flash = $data.flash;
        }
        
		$scope.login = function(){
        	Authenticate.save({
                'email': $sanitize($scope.email),
                'password': $sanitize($scope.password)
            },function(data) {
            	authService.loginConfirmed();
            	$scope.flash = '';
                SharedDataSvc.setShared("username", data.user.username);
                SharedDataSvc.setShared("email", data.user.email);
                $test = SharedDataSvc.getShared();
                $location.path('/home');
                Flash.clear()
           //     sessionStorage.authenticated = true;
            },function(response){
               // Auth Failed
            	Flash.show("Login Failed");
            })
        }
	})
        
    // Controller for Homepage. For now, show all project names but
    // eventually just show projects user is a team member on
    .controller('homeController',function($scope,$location,Projects,SharedDataSvc,$stateParams){
    	    $data = SharedDataSvc.getShared();
    	    $scope.username = $data.username;
    	    $scope.email = $data.email;
    	    
    	    var projects = Projects.query();
    	    $scope.projects = projects;   
    	    

    })
    
    .controller('projectHomeController',function($scope,$stateParams,$location,Projects,Serial_Numbers,SharedDataSvc){
    	
    	$scope.serials = Serial_Numbers.query({projectID:$stateParams.projectID});
 
    	SharedDataSvc.setShared("projectName", $stateParams.projectName);
    	SharedDataSvc.setShared("projectID", $stateParams.projectID);
    })
    
    .controller('testHistoryController',function($scope,$stateParams,$location,Serial_Numbers,Test_Attempts,SharedDataSvc){
    	$userdata = SharedDataSvc.getShared();
    	$scope.testAttempts = Test_Attempts.query({serialID:$stateParams.serialID});
    	$scope.serialNum = $stateParams.pcb;
    	$scope.projectID = $stateParams.projectID
    	    	
    	SharedDataSvc.setShared("curSerialId", $stateParams.id);
    })
    
    .controller('testResultsController',function($scope,$stateParams,$location,Serial_Numbers,Test_Attempts,Test_Results,SharedDataSvc){
    	
    	$scope.testData = Test_Results.query({attemptID:$stateParams.resultID});
    	    	
    })
    
    