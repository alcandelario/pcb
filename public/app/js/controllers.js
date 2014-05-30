angular.module("projectTracker")	
	
    /**
     * 
     * overview of all user projects
	 *
	 **/
	.controller('homeController', function($scope,$modal,$rootScope,Projects,SharedDataSvc,$cookieStore){
    	    $cookieStore.put("projectName", "");
            $cookieStore.put("projectID", "");

            $scope.projects = Projects.get();

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

            
            $scope.createNewProject = function(){
                
                var modalInstance = $modal.open({
                        templateUrl: 'newproject_modal.html',
                         controller: 'newProjectCtrl',
                               size: 'sm',
                            resolve: {
                               items: function(){
                                return $scope.name = '';
                               }
                           }
                    });

            };
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
           
           if(serials.length > 0)
           {
                $scope.projectName = serials[0].project.name;
                $scope.projectUrl =  $scope.DashUrl.makeUrl($scope.projectName);
                $cookieStore.put("projectName", $scope.projectName);
                $scope.hideProjectHome = "false";
           }
           else
           {
                //No serials yet, but we still need the user-friendly project Name
            var $name = Projects.query({projectID: $stateParams.projectID});
                $name.$promise.then(function(project){
                    $scope.projectName = project.name;
                });
           }
        });

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
        $rootScope.hideNestedTwo = 'true';

        $scope.projectName = $cookieStore.get("projectName");
    	$scope.projectID = $cookieStore.get("projectID");
        $scope.serialID = $stateParams.serialID;
    	
    	$scope.history = Test_Attempts.query({serialID:$stateParams.serialID});
    	
    	$scope.history.$promise.then(function(result){
    		$scope.serialNumber = result[0].serial_number.pcb;
            $cookieStore.put("serialNumber", $scope.serialNumber);
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
     * Google charts API interfacing controller
     *
     **/
    .controller('googleChartsController',function($cookieStore,$scope,$stateParams,$location,Test_Results,$http){
        $scope.hideTestResults='true';
        $scope.hideNestedTwo='false';

        $scope.projectName = $cookieStore.get("projectName");
        $scope.projectID = $cookieStore.get("projectID");
        $scope.serialID = $cookieStore.get("serialID");
        $scope.serialNumber = $cookieStore.get("serialNumber");
        
        
        // build the request URL
        var $url = $location.absUrl();
        var $path = "index.php?/#"+$location.path();
        $url = $url.replace($path,"/google-charts");

        //test only
        $url ="http://localhost/pcbtracker/public/google-charts";

        if($stateParams.projectID === 'all'){
            // don't support this for now. This link
            // came from a generic non-project related page
            // like for example, the mainpage 
        }

        else {
        	var serID = '';
        	
        	if($stateParams.serialID !== 'all') {
                serID = $scope.serialID;
            }
            else{
                serID = 'all'
            }

            var results = $http({
                              url: $url,
                           method: "POST",
                             data: {'projectID': $scope.projectID, 'serialID': serID },
            })

            .success(function(data,status) 
            {
                $this.parseResp(data);
            })
        }

        var parseResp = function(data){
            // takes individual attempts and parses each
            // test result into arrays. will return an 
            // array like:
            //               [
            //                    "Test Name": {
            //                              "url": test-name,
            //                             "data": ["result","result",...,"result"]
            //                     },
            //                     "Other Test": {
            //                               "url": other-test,
            //                              "data": ["result","result",...,"result"]
            //                     }
            //                  ]            
        }

   
           // $scope.charts = {
           //                  "test1": 
           //                          {
           //                              "url": "test1",
           //                              "data": {"1","2","3"}
           //                          },
           //                  "test2": 
           //                          {
           //                              "url": "test2",
           //                              "data": {"4","5","6"}
           //                          }
           // }

           // for($i=0; $i < $scope.charts.length; $i++){
                    
           // }
           
           var testdata = 
                {        "rows": [
                    // parser function will create the below structure
                    // parser will return data as follows:
                    // { "test-name1" : {the below structure},
                    //   "test-name2" : {the below structure} 
                    // }

                    // take $chartPrototype "

                   {
                      "c": [
                           {
                               "v": 0
                           },
                           {
                               "v": 122
                           },
                           {
                               "v": "122"
                           }
                       ]
                   },
                   {
                      "c": [
                           {
                               "v": 1
                           },
                           {
                               "v": 126
                           },
                           {
                               "v": "126"
                           }
                       
                       ]
                   }
               ]
           }


           $scope.chart = {
               "type": "ScatterChart",
               "displayed": false,
               "data": {
                   "cols": [
                       {    "id": "index",
                         "label": "Index",
                          "type": "number" 
                       },
                       {
                            "id": "actual",
                         "label": "Actual",
                          "type": "number"
                       },
                       {    "id":  '',
                          "type":  'string', 
                          'role':'tooltip',
                             'p': {
                                   'role': "tooltip",
                                   'html': true
                               }
                       }
                   ],
                   "rows": [
                    // parser function will create the below structure
                    // parser will return data as follows:
                    // { "test-name1" : {the below structure},
                    //   "test-name2" : {the below structure} 
                    // }

                    // take $chartPrototype "

                   {
                      "c": [
                           {
                               "v": 0
                           },
                           {
                               "v": 122
                           },
                           {
                               "v": "122"
                           }
                       ]
                   },
                   {
                      "c": [
                           {
                               "v": 1
                           },
                           {
                               "v": 126
                           },
                           {
                               "v": "126"
                           }
                       
                       ]
                   }
               ]
           },
           "options": {
               "title": "Average Sleep Current",
               "isStacked": "true",
               "fill": 20,
               "displayExactValues": true,
               "vAxis": {
                   "title": "Avg Sleep Current (mA)",
                   "gridlines": {
                       "count": 2
                   }
               },
               "legend": "none",
               "hAxis": {
                   "title": "Attempt"
               },
               "tooltip": {
                   "isHtml": true,
                  "trigger": "selection"
               },
               "width": 300,
               "height": 200
           },
           "formatters": {},
           "view": {}
       }


        	
   // });
    	
    	results.error(function (data, status, headers, config) {
            var b = 0;
        });

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
             });
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

    var newProjectCtrl = function($sanitize,DashUrl,Projects,$state,$cookieStore,$scope,$modalInstance,items){
                $scope.name = items;
                $scope.alert = {};
                
                $scope.submit = function(name){
                    var project = Projects.save({
                        'name': $sanitize(name)
                    });
             
                    project.$promise.then(function(data){
                        var url = DashUrl.makeUrl(data.name);
                        $cookieStore.put('projectName', data.name);
                        $cookieStore.put('projectID', data.id);
                        
                        $scope.alert = {type:'success',msg:'Project created!'};
                        
                        setTimeout(function()
                        {
                          $modalInstance.dismiss('cancel');
                          $state.go ('project.home', { projectID: data.id, projectName : url } )
                       },1000);
                        
                      // need an error handler

                    });
                }    

                $scope.closeAlert = function() {
                  $scope.alert = {};
                }

                $scope.cancel = function(){
                    $modalInstance.dismiss('cancel');
                };
	}


    
    