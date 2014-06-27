
angular.module("projectTracker")
	
	.factory("Authenticate", function($resource,$rootScope){
        return $resource($rootScope.endpoint +"authenticate/")
    })
    
    .factory("Projects", function($cacheFactory,$resource,$rootScope){
        return $resource($rootScope.endpoint +"projects/:projectID", 
                    {projectID:'@id'},
                    {
                    'query':{method: 'GET', cache: true, isArray: false},
                     'get' :{method: 'GET', cache: true, isArray: true}, 
                    }
                );
    })
    
    .factory("Serial_Numbers", function($cacheFactory,$resource,$rootScope){
    	return $resource($rootScope.endpoint +"serial_numbers/:projectID",
                    {projectID:'@id'},
                    {
                        'query': {method: 'GET', cache: true, isArray:true},
                          'get': {method: 'GET', cache: true}
                    }
                )
    })
    
    .factory("Test_Attempts", function($cacheFactory,$resource,$rootScope){
    	return $resource($rootScope.endpoint +"test_attempts/:serialID", 
                        {serialID:'@id'},
                        {
                            'query':{method: 'GET', cache: true, isArray: true},
                            'get' :{method: 'GET', cache: true, isArray: true}, 
                        }
                );
    })

    .factory("Test_Names",function($cacheFactory,$resource,$rootScope) {
        return $resource($rootScope.endpoint +"test_names/:id",
                        {id:'@id'},
                        {'get':   {method:'GET', cache: true, isArray: true},
                         'query': {method:'GET', cache: true, isArray: true}
                        }
               );
    })
    
    .factory("Test_Results", function($resource,$rootScope){
    	return $resource($rootScope.endpoint +"test_results/:attemptID", 
    			{attemptID:'@id'},
    			{'query': {method: 'GET', cache: true, isArray: true},
                });
    })

    .factory('Cache', function($cacheFactory) {
        return $cacheFactory('appData');
    })

    .service('GoogleChart', function() {
        return {"type": "ScatterChart",
                        "displayed": false,
                        "data": {
                                 "cols": [
                                           {    "id": "index",
                                             "label": "Index",
                                              "type": "number" 
                                           },
                                           {    "id": "actual",
                                             "label": "Actual",
                                              "type": "number"
                                           },
                                           {    "id":  '',
                                              "type":  'string', 
                                              'role':'tooltip',
                                                 'p': {'role': "tooltip", 'html': true}
                                           }
                                         ],
                                 "rows": '',
                               },
                   "options": {
                                "title": "",
                                "isStacked": "true",
                                "fill": 20,
                                "displayExactValues": true,
                                "vAxis": {"title": "", "minValue":"", "maxValue":"", 
                                          "gridlines": {"count": 2}
                                         },
                                "legend": "none",
                                "hAxis":   {"title": "Attempt", "viewWindowMode": 'maximized'},
                                "tooltip": {"isHtml": true},
                                "width":  440,
                                "height": 400
                              },
                   "formatters": {},
                   "view": {}
                };
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
    
    
