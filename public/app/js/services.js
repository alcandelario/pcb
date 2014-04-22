
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
