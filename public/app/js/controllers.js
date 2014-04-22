angular.module("projectTracker")	
	
	// Controller to handle login
	.controller('loginController',function($scope,$sanitize,$location,Authenticate,Flash,SharedDataSvc){
        $data = SharedDataSvc.getShared();
        $scope.flash = $data.flash;
		
		$scope.login = function(){
        	Authenticate.save({
                'email': $sanitize($scope.email),
                'password': $sanitize($scope.password)
            },function(data) {
                $scope.flash = '';
                SharedDataSvc.setShared("username", data.user.username);
                SharedDataSvc.setShared("email", data.user.email);
                $location.path('/home');
                Flash.clear()
                sessionStorage.authenticated = true;
            },function(response){
               // $scope.flash = response.data.flash;
            })
        }
	})
        
    // Controller for Homepage. For now, show all project names but
    // eventually just show projects user is a team member on
    .controller('homeController',function($scope,$location,Authenticate,Projects,SharedDataSvc,Flash){
    	    $userdata = SharedDataSvc.getShared();
    	    $scope.email = $userdata.email;
    	    $scope.username = $userdata.username;
            
    	    if(!sessionStorage.authenticated){
    	    	$location.path('/')
    	    	Flash.show("You need to be logged in to see this page")
    	    }
    	    
    	    var projects = Projects.query();
    	    
    	    $scope.logout = function (){
                Authenticate.get({},function(){
                	SharedDataSvc.setShared("flash","You've logged out, "+$scope.username);
                    $location.path('/')
                })
            }
    })