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
                // create a model with our form
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
           
           if(serials.length > 0)  // this project actually has serial nums 
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
     * Google charts API interface controller
     *
     **/
    .controller('googleChartsController',function($cookieStore,$scope,$stateParams,$location,Test_Results,$http){
        // configure the view
        if($stateParams.serialID === 'all')
        {
          $scope.hideNestedOne = 'false';
          //$scope.hideNestedTwo = 'true';
        }
        else{
          $scope.hideNestedTwo = 'false';
          $scope.serialID = $cookieStore.get("serialID");
          $scope.serialNumber = $cookieStore.get("serialNumber");
          $scope.hideTestResults='true';
        }

        $scope.projectName = $cookieStore.get("projectName");
        $scope.projectID = $cookieStore.get("projectID");
                
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
        // build charts for an individual serial number
        else 
        {
            var serID = '';
          	
          	if($stateParams.serialID !== 'all') {
                  serID = $scope.serialID;
            }
            else{
                  serID = 'all'
            }
            // get test data for this serial number
            var results = $http({
                                url: $url,
                             method: "POST",
                               data: {'projectID': $scope.projectID, 'serialID': serID },
            })

            .success(function(data,status) 
            {
                $resp = buildChartValues(data);
                $scope.charts = buildChartObjects($resp);
            })
        }
    
        /**
         * Format the data for use with Google Charts directive
           @return  {
                          TEST_1: [
                                    {
                                        url: test_id_1
                                       data: {
                                              c: [
                                                   {
                                                    
                                                   },
                                                   {
    
                                                   },
                                                   {
    
                                                   }   
                                                 ]  
                                             }
                                    },
                                    {
                                       url: test_id_2
                                      data: {...}
                                    }
                                  ]
                          TEST_2: [

                                  ]
                    }
          **/
        var buildChartValues = function(data){
            var $tests = [];
            var $results = {};

            // extract all test names
            for(var $i=0; $i < data.length; $i++)
            {
                $tests.push(data[$i].test_name);
            } 

            // create the @return data structure
            for(var $i=0;$i<data.length;$i++)
            {
               var units = data[$i].units;
               var min = data[$i].min;
               var max = data[$i].max;
               var res = data[$i].final_result.toLowerCase();

              if(  units === 'logic'         ||
                   units === 'bool'          ||
                   units === 'none'          ||
                 (!min && ((max + 0) == 1))  ||
                   res === 'incomplete'      ||
                   res === 'completed'
               )
               {
                // ignore any non-numeric test data
               }
               else
               {
                  var $test = data[$i].test_name;
                  var $value = data[$i].actual;
                  var $att_id = data[$i].test_attempt_id;
                  var $minV = data[$i].min;
                  var $maxV = data[$i].max;
                  var $units = data[$i].units;
                  var $tested = data[$i].date;
                  var $serial = data[$i].pcb;
                  var $result = data[$i].result;

                  // if test name exists in @return object, add new result
                  // to that object's array
                  if($test in $results){
                    var $index = $results[$test].length + 1;

                    var $row = {"url": $att_id,
                                "serial": $serial, 
                                "minV": $minV,
                                "maxV": $maxV,
                                "units": $units,
                                "tested": $tested, 
                                "data": {"c":[{"v": $index},{"v": data[$i].actual},{"v": "PCB: "+$serial+'<br>Tested: '+$tested+'<br> Final Result: '+$value+' ('+$result+')'}]}
                               }; 
                  	
                    $results[$test].push($row);
                  }   
                  // otherwise create a new object property in the @return object              
                  else{
                    var $row = {"url": $att_id, 
                                "serial": $serial,
                                "minV": $minV,
                                "maxV": $maxV,
                                "units": $units,
                                "tested": $tested, 
                                "data": {"c":[{"v": 1},{"v": data[$i].actual},{"v": "PCB: "+$serial+'<br>Tested: '+$tested+'<br> Final Result: '+$value+' ('+$result+')'}]}
                               }; 
                  	$results[$test] = [$row];
                  }
                }
            }

            return $results;
        }

        /**
         *
         *  further parse the data into a chart object
         *
         */
        var buildChartObjects = function($data){
          /**
           *
           * Chart object prototype
           */
           var chart = function() {

                return {"type": "ScatterChart",
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

                                 "rows": '',
                               },
                   "options": {
                                "title": "",
                                "isStacked": "true",
                                "fill": 20,
                                "displayExactValues": true,
                                "vAxis": {
                                          "title": "",
                                          "minValue":"",
                                          "maxValue":"",
                                          "gridlines": {
                                                        "count": 2
                                                       }
                                         },
                                "legend": "none",
                                "hAxis":   {
                                            "title": "Attempt",
                                            "viewWindowMode": 'maximized'
                                           },
                                "tooltip": {
                                             "isHtml": true,
                                            // "trigger": "selection"
                                           },
                                "width":  440,
                                "height": 400
                              },
                   "formatters": {},
                   "view": {}
                };
              };

            var $ch_objects = {};

            for(var $test_name in $data)
            {
                var $proto = chart();
                var $temp = [];
                var results = $data[$test_name]; // get all objects in that test's array
                
                // extract the columns from each test attempt
                for($i = 0; $i < results.length; $i++)
                {
                  var row = results[$i].data
                  $temp.push(row);  
                }
                
                // populate the prototype with custom data
                $proto.options.title = $test_name;
                $proto.options.vAxis.title = $test_name;
                $proto.options.vAxis.minValue = $data[$test_name][0].minV;
                $proto.options.vAxis.maxValue = $data[$test_name][0].maxV;
                $proto.data.rows = $temp;

                
                $ch_objects[$test_name] = $proto;
            }
            return $ch_objects;
          }
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
      		$cookieStore.put('userLoggedIn','false');
      		$cookieStore.put('username', '');
          $cookieStore.put('email', '');
      		
      		$rootScope.$broadcast('event:auth-loginRequired', {data: {flash: 'userLogout'}});
          delete $rootScope.sessionExpired;
          $state.go("login");
      	}
    	
        $scope.login = function(){
	
         	Authenticate.save(
             {
                 'email': $sanitize($scope.email),
                 'password': $sanitize($scope.password)
             },
             
             function(data) {
    
               	// store user profile data
               	$cookieStore.put('userLoggedIn', 'true');
               	$cookieStore.put('username', data.user.username);
               	$cookieStore.put('email', data.user.email);
                $rootScope.username = data.user.username;  // to populate header
                 
                // broadcast a successful login event
                authService.loginConfirmed(); 
                
                // go to our default state if its a fresh log in
                if(typeof $rootScope.sessionExpired === 'undefined'){
                  $rootScope.sessionExpired = 'false';
                  $cookieStore.put('sessionExpired', 'false');
                  $state.go($defaultState);
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


    
    