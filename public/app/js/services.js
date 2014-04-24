
angular.module("projectTracker")
	
    .factory("Authenticate", function($resource){
        return $resource("/pcbtracker/public/service/authenticate/")
    })
    
    .factory("Projects", function($resource){
        return $resource("/pcbtracker/public/service/projects/")
    })
    
    .factory('SharedDataSvc', function(){
    	var sharedData = {};
    	
    	return {
    		getShared: function(){
    			return sharedData;
    		},
    		setShared: function(key,value){
    			sharedData[key] = value;
    		}
    	}
    })
    
    .factory('Flash', function($rootScope){
        return {
            show: function(message){
                $rootScope.flash = message
            },
            clear: function(){
                $rootScope.flash = ""
            }
        }
    })
