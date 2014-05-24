
angular.module("projectTracker")
	
	.factory("Authenticate", function($resource,$rootScope){
        return $resource($rootScope.rsrc_path +"authenticate/")
    })
    
    .factory("Projects", function($resource,$rootScope){
        return $resource($rootScope.rsrc_path +"projects/")
    })
    
    .factory("Serial_Numbers", function($resource,$rootScope){
    	return $resource($rootScope.rsrc_path +"serial_numbers/:projectID",{projectID:'@id'})
    })
    
    .factory("Test_Attempts", function($resource,$rootScope){
    	return $resource($rootScope.rsrc_path +"test_attempts/:serialID", {serialID:'@id'})
    })
    
    .factory("Test_Results", function($resource,$rootScope){
    	return $resource($rootScope.rsrc_path +"test_results/:attemptID", 
    			{attemptID:'@id'},
    			{'query': {method: 'GET', isArray: false}
    	});
    })
    .service('DashUrl', function() {
        this.makeUrl = function(rawString){
           return rawString.replace(/\s+/g, '-').toLowerCase(); 
        }
    })
    
    .service('SharedDataSvc', function(){
     	var shareddata = {};
    	
    	return {
    		getShared: function(){
    	  			return shareddata;
    		},
    		setShared: function($key,value){
    		
    			shareddata[$key] = value;
    		}
    	}
    })
    
    .service('Flash', function($rootScope){
    	return {
            show: function(where,message){
            	switch (where){
            	case 'login_flash':
            		$rootScope.login_flash = message;
            		$rootScope.showLoginFlash = true;
            		break;
            	case 'flash':
            		$rootScope.flash = message;
            		$rootScope.showFlash = true;
            		break;
            	}
            },
            clear: function(){
            	$rootScope.showFlash = false;
            }
        }
    })
    
    
