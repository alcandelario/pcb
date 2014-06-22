
angular.module("projectTracker")
	
	.factory("Authenticate", function($resource,$rootScope){
        return $resource($rootScope.rsrc_path +"authenticate/")
    })
    
    .factory("Projects", function($cacheFactory,$resource,$rootScope){
        return $resource($rootScope.rsrc_path +"projects/:projectID", 
                    {projectID:'@id'},
                    {
                    'query':{method: 'GET', cache: true, isArray: false},
                     'get' :{method: 'GET', cache: true, isArray: true}, 
                    }
                );
    })
    
    .factory("Serial_Numbers", function($cacheFactory,$resource,$rootScope){
    	return $resource($rootScope.rsrc_path +"serial_numbers/:projectID",
                    {projectID:'@id'},
                    {
                        'query': {method: 'GET', cache: true, isArray:true},
                          'get': {method: 'GET', cache: true}
                    }
                )
    })
    
    .factory("Test_Attempts", function($cacheFactory,$resource,$rootScope){
    	return $resource($rootScope.rsrc_path +"test_attempts/:serialID", 
                        {serialID:'@id'},
                        {
                            'query':{method: 'GET', cache: true, isArray: true},
                            'get' :{method: 'GET', cache: true, isArray: true}, 
                        }
                );
    })

    .factory("Test_Names",function($cacheFactory,$resource,$rootScope) {
        return $resource($rootScope.rsrc_path +"test_names/:id",{id:''},
                        {'get': {method:'GET', cache: true, isArray: true}
               })
    })
    
    .factory("Test_Results", function($resource,$rootScope){
    	return $resource($rootScope.rsrc_path +"test_results/:attemptID", 
    			{attemptID:'@id'},
    			{'query': {method: 'GET', cache: true, isArray: true},
                });
    })

    .factory('Cache', function($cacheFactory) {
        return $cacheFactory('appData');
    })

    .service('DashUrl', function() {
        this.makeUrl = function(rawString){
           return rawString.replace(/\s+/g, '-').toLowerCase(); 
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
            		$rootScope.alerts.push(message);
            		//$rootScope.showFlash = true;
            		break;
            	}
            },
            clear: function(){
            	$rootScope.showFlash = false;
            }
        }
    })
    
    
