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
    .controller('homeController',function($scope,$location,Projects,SharedDataSvc){
    	    $userdata = SharedDataSvc.getShared();
    	    $scope.email = $userdata.email;
    	    $scope.username = $userdata.username;
            
    	    var projects = Projects.query();
    	    $scope.projects = projects;    	    
    	    
    })