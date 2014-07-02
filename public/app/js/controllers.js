angular.module("projectTracker")	
	
    /**
     * 
     * overview of all user projects
	 *
	 **/
	.controller('homeController', function(Cache,$scope,$modal,$rootScope,Projects,$cookieStore){
      
      $scope.projects = Cache.get('allProjects');

      if(typeof $scope.projects === 'undefined')
      {  
        $scope.projects = Projects.get();

        $scope.projects.$promise.then(function (projects) {
          
          // add a clean url segment for project home links
            for($i=0; $i < projects.length; $i++){
                var project = projects[$i];
                var name = project['name'];
                projects[$i]['projectUrl'] = $scope.DashUrl.makeUrl(name);
            }
          
            $scope.projects = projects;
            Cache.put('allProjects', projects)
        });
      }

      $scope.createNewProject = function(){
          // create a model with our form
          var modalInstance = $modal.open({
                  templateUrl: 'newproject_modal.html',
                   controller: 'modalController',
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
  .controller('projectHomeController',function(Cache,$cookieStore,$rootScope,$scope,$stateParams,$location,Projects,Serial_Numbers){
        $scope.hideNestedOne = 'true';
        $scope.hideNestedTwo = 'true';
        $scope.hideProjectHome = 'true';
        var params = {};
        
        var project = Cache.get('project');

        if(typeof project !== 'undefined' && project.projectID !== $stateParams.projectID)
        {
            // re-init the cache object and re-populate as needed
            Cache.remove('project'); 
        }
        
        $scope.serials = Serial_Numbers.query({projectID:$stateParams.projectID});
        
        $scope.serials.$promise.then(function(serials) {
           project = Cache.get('project');
           if(serials.length > 0)  // this project actually has serials 
           {
                $scope.projectName = serials[0].project.name;
           }
           else
           {
             // We still need the user-friendly project Name
             $name = Projects.query({projectID: $stateParams.projectID});
             $name.$promise.then(function(project){
                 $scope.projectName = project.name;
                 $temp = Cache.get('project');
                 $temp.projectName = $scope.projectName;
                 Cache.put('project');
             });
           }
           project.projectName = $scope.projectName;
           Cache.put('project',project);   
        });

        $scope.projectID = $stateParams.projectID;
        params.projectID = $scope.projectID;
        params.projectUrl = $stateParams.projectName;
        Cache.put('project',params);
    })
    /**
     * 
     * Unit under test (UUT) history of test attempts
     *
     **/
  .controller('testHistoryController',function(Cache,Test_Results,$modal,$cookieStore,$scope,$rootScope,$stateParams,Serial_Numbers,Test_Attempts){
    	  project = Cache.get('project');
        $rootScope.hideNestedOne = 'false';  // make this available to directives that may need it
        $rootScope.hideNestedTwo = 'true';
        $scope.projectName = project.projectName;
    	  $scope.projectID = project.projectID;
        $scope.serialID = $stateParams.serialID;
    	
      	$scope.history = Test_Attempts.query({serialID:$stateParams.serialID});
    	
    	  $scope.history.$promise.then(function(result){
    		    project = Cache.get('project');

            $scope.serialNumber = result[0].serial_number.pcb;
            
            project.serialNumber =  $scope.serialNumber;
            
            Cache.put('project',project);
    	  });
    	
    	  project.serialID = $stateParams.serialID;

        Cache.put('project',project);

        // $scope.resultsModal = function (id){
        //   var testID = id;
        //   $testData = Test_Results.query({attemptID:id});
                           
        //   $testData.$promise.then(function(results){
        //       $scope.testData = results;
        //       $scope.hideTestResults = 'false';

        //       var modalInstance = $modal.open({
        //           templateUrl: 'app/partials/test-results.html',
        //            controller: 'modalController',
        //                  size: 'lg',
        //             backdrop: 'true',
        //               resolve: {
        //                 items: function(){
        //                    return result;                          
        //                  }
        //              }
        //       }); 
        //   }); 
        // }
  })
  /** 
   * 
   * UUT test attempt results
   *
   **/
  .controller('testResultsController',function($scope,$stateParams,$location,Serial_Numbers,Test_Attempts,Test_Results){
  	$scope.hideTestResults='true';

  	$scope.testData = Test_Results.query({attemptID:$stateParams.resultID});
    
      $scope.testData.$promise.then(function(result) {
          $scope.hideTestResults='false';
    })
  })
  /**
   *
   *Setup to print shipping labels
   *
   */
   .controller('labelSetupController',function(Cache,$rootScope,$http,$state,Flash,$cookieStore,$scope,$stateParams,$location,Projects,Serial_Numbers,Test_Attempts,Test_Results,Test_Names) {
        $scope.serialID = parseInt($stateParams.serialID,10)
        Cache.put('serialInUrl', $scope.serialID);
        $scope.projectID = $stateParams.projectID;
        $scope.selectedSerials = [];
        $scope.selectedTests =[];
        $scope.step2 = true;
        $scope.step3 = true;

        $scope.projects = Projects.get();
        $scope.projects.$promise.then(function(projects) {
            Cache.put('projects',projects);
            if($scope.projectID === 'all'){
                // just show the project select
            } 
            else{
                // get tests and pre-check the boxes if user is coming back heres to include on labels
                $scope.labelSetup($scope.projectID);
                $scope.step1 = true;
            }
        });

        // manage a list of checked serial numbers 
        // to generate labels for
        $scope.toggleSerial = function(id){
            var index = $scope.selectedSerials.indexOf(id);
            // needs to be removed
            if(index > -1){
              $scope.selectedSerials.splice(index,1);
            }
            // needs to be added
            else{
              $scope.selectedSerials.push(id);
            }
        }
        // manage a list of checked test data 
        // to include on the label
        $scope.toggleTest = function(id){
            var index = $scope.selectedTests.indexOf(id);
            // needs to be removed
            if(index > -1){
              $scope.selectedTests.splice(index,1);
            }
            // needs to be added
            else{
              $scope.selectedTests.push(id);
            }
        }
        // select/deselect all serial numbers
        $scope.toggleAll = function(state){
            $scope.selectedSerials = []; // empty the list

            for($i=0; $i < $scope.serials.length; $i++) {
                serial = $scope.serials[$i];
                serial.isChecked = !state;
                $scope.serials[$i] = serial;
                if(state === false){
                  $scope.selectedSerials.push(serial.id)
                }
                else if(state === true){
                  index = $scope.selectedSerials.indexOf(serial.id)
                  if (index > -1){
                    $scope.selectedSerials.splice(index,1)
                  }
                }
            }
            $scope.toggleState = !$scope.toggleState;
        }
        // retrieve a list of test names and serial
        // numbers to include on a label  
        $scope.labelSetup = function(id){
              $scope.step1 = true;
              $scope.step3 = true;
              // are we just re-opening the setup view?
              if(id !== 'open')
              {
                  $scope.toggleState = false;
                  $scope.selectedSerials = [];
                  $scope.selectedTests = [];
                  $scope.tests = Test_Names.query({id: id});
                  $scope.serials = Serial_Numbers.query({projectID:id});
                  $scope.serials.$promise.then(function(serials) {
                      $scope.serials = preCheckSerial($scope.serialID,$scope.serials);
                      $scope.step2 = false;  
                  });
              }
              else {
                $scope.step2 = false;
              }
        }
        // go back to the first-step, project select form
        $scope.reset = function(){
          $scope.step2 = true;
          $scope.step3 = true;
          $scope.step1 = false;
        }
        // check the appropriate checkbox if we were
        // given a serial number id in the URI segment
        preCheckSerial = function(id,serials)
        {
            if(id !== 'all'){
                // set the is "isChecked" property as needed
                for($i=0; $i<serials.length; $i++) {
                    var serial = serials[$i];
                    if(serial.id === id){
                      serial.isChecked = true
                      $scope.selectedSerials.push(serial.id)
                    }
                    else{
                      serial.isChecked = false
                    }
                    serials[$i] = serial;
                }
            }
            return serials;
        }
          
        $scope.printLabels = function(){
          $scope.step2 = true;
          $scope.step3 = false;
          $scope.meta
          // API endpoint to retrieve data for the label
          var $url = $location.absUrl();
          var $path = "index.php?/#"+$location.path();
          $url = $url.replace($path,"/print-labels");
          //*******test only************
          $url ="http://localhost/pcbtracker/public/print-labels";
          var results = $http({
                                url: $url,
                             method: "POST",
                               data: {'serials': $scope.selectedSerials,'tests': $scope.selectedTests},
          })
          .success(function(data,status) 
           {
              $scope.totalLabels = Object.keys(data).length;
              $scope.currentPage = 1;
              $scope.perPage = 6;
              $scope.labels = [];
              $scope.filteredLabels = [];
              
              for (var key in data){
                if(data.hasOwnProperty(key)) {
                  $scope.labels.push(data[key]);
                }
              }

              $scope.addMetaData(data);

              $scope.setPage($scope.currentPage);
           })
        }
        // add meta data to each label
        $scope.addMetaData = function(data){
         var itemsPerLabel = 18; // not including one field for the serial number
         $scope.metaData = [{ "name": "Part Number","val":''    }, 
                            { "name": "Tested","val":''         },
                            { "name": "CP Version","val":''     },
                            { "name": "DSP Version","val":''    },
                            { "name": "ASIC Version","val":''   }, 
                            { "name": "NVM Version","val":''    },
                            { "name": "BOOT Version","val":''   }
                          ];
          var $emptyFields = itemsPerLabel - (Object.keys($scope.metaData).length + 
                                              $scope.selectedTests.length);
          $scope.custom = [];

          if($emptyFields >= 0)
          {  
            for(var $i=0;$i<$emptyFields;$i++)
            {
              $scope.custom.push({"name": ''});
            }
          }

        }
        // Set the type of serial number to be displayed
        // Currently support "pcb", "housing", "IMEI"
        $scope.serialType = function(type){
           $scope.type = 'label.serials.'+type;
           $scope.$digest(); 
        }

        $scope.setPage = function(pageNum){
          $scope.currentPage = pageNum;
          var begin = (($scope.currentPage - 1) * $scope.perPage);
          var end = begin + $scope.perPage;
          $scope.filteredLabels = $scope.labels.slice(begin, end);
        }
     })
     /** 
     * 
     * Google charts API interface controller
     *
     **/
    .controller('googleChartsController',function(GoogleChart,Cache,Flash,$cookieStore,$scope,$stateParams,$location,Test_Results,$http){
        var project = Cache.get('project');
        // configure the view
        if($stateParams.serialID === 'all')
        {
          $scope.hideNestedOne = 'false';
        }
        else{
          $scope.hideNestedTwo = 'false';
          $scope.serialID = project.serialID;
          $scope.serialNumber = project.serialNumber;
          $scope.hideTestResults='true';
        }
        $scope.projectName = project.projectName;
        $scope.projectID = project.projectID;
        // build the request URL
        var $url = $location.absUrl();
        var $path = "index.php?/#"+$location.path();
        $url = $url.replace($path,"/chart-test-limits");


        //*****test only******
        $url ="http://localhost/pcbtracker/public/chart-test-limits";


        if($stateParams.projectID === 'all'){
            // don't support this for now. This link
            // came from a generic non-project related page
            // like for example, the mainpage 
        }
        else 
        {
            // build charts for an individual serial number
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
         *
         * Save the results to an Excel file
         *
         */
        $scope.saveExcel = function() {
          // build the request URL
          var $url = $location.absUrl();
          var $path = "index.php?/#"+$location.path();
          $url = $url.replace($path,"/save-excel");


          //************test only******************
          $url ="http://localhost/pcbtracker/public/save-excel";


          var results = $http({
                                url: $url,
                             method: "GET",
                               data: {},
          })
          .success(function(data,status) 
           {
               var alert = {'type': 'success','msg': 'Click <a class="alert-link" href='+data+'>HERE</a> to download your file.'};
               Flash.show('flash',alert);
           })
        }
        /**
         * Format the data for use with Google Charts directive
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
                  var $att_id = data[$i].id;
                  var $minV = data[$i].min;
                  var $maxV = data[$i].max;
                  var $units = data[$i].units;
                  var $tested = data[$i].date;
                  var $serial = data[$i].pcb;
                  var $result = data[$i].result;
                  var $index = '';
                  var $row = {"url": $att_id,
                                "serial": $serial, 
                                "minV": $minV,
                                "maxV": $maxV,
                                "units": $units,
                                "tested": $tested, 
                                "data": {"c":[{"v": $index},{"v": $value},{"v": "PCB: "+$serial+'<br>Tested: '+$tested+'<br> Final Result: '+$value+' ('+$result+')'}]}
                               }; 
                  // if test name exists in @return object, add new result
                  // to that object's array
                  if($test in $results){
                    var $index = $results[$test].length + 1;
                    $row.data.c[0].v = $index;
                    $results[$test].push($row);
                  }   
                  // otherwise create a new object property in the @return object              
                  else{
                    $row.data.c[0].v = 1;
                  	$results[$test] = [$row];
                  }
                }
            }
            return $results;
        }
        /**
         *  Parse the raw data into a chart object
         */
        var buildChartObjects = function($data){
            var $ch_objects = {};
            for(var $test_name in $data)
            {
                var $proto = GoogleChart;
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
    .controller('MainController', function($scope,$rootScope,$state,$sanitize,$location,Authenticate,authService,Flash,$cookieStore) {
       	$defaultState = 'home';				// where to go after logging in
        $rootScope.alerts = [];

       	var $loggedIn = $cookieStore.get('userLoggedIn');

        if($loggedIn === 'true'){
          $state.go('home');
        }

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
               	// store user profile data if successful
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
         // close any alert box
         $scope.closeAlert = function(index) {
              $rootScope.alerts.splice(index, 1);
         }
    })
    /*
     * Handler for file uploading
     */
    .controller('fileUploadController', function(Projects,Cache, $scope,$fileUploader,$location) {
    	// build the route Laravel will respond to for file uploads
    	var project = Cache.get('project');
      var $projectID = project.projectID;
      var $url = $location.absUrl();
    	var $path = "index.php#"+$location.path();
    	var $mode = "0";    //default upload mode
    	$url = $url.replace($path,"service/upload_data");
    	

      /**********TEST ONLY ************/
      $url ="http://localhost/pcbtracker/public/service/upload_data";

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
        	$scope.upload_status = {type:"success", msg:"Your data was saved successfully!"};
          $scope.showUploadFlash = true;
          console.info('Success', xhr, item, response);
          
          $projects = Projects.get();

          $projects.$promise.then(function (projects) {
          
          // add a clean url segment for project home links
            for($i=0; $i < projects.length; $i++){
                var project = projects[$i];
                var name = project['name'];
                projects[$i]['projectUrl'] = $scope.DashUrl.makeUrl(name);
            }
          
            $scope.projects = projects;
            Cache.put('allProjects', projects)
           });
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

    var modalController = function(Cache,$sanitize,DashUrl,Projects,$state,$cookieStore,$scope,$modalInstance,items){
                $scope.name = items;
                $scope.testData = items;
                $scope.alert = {};
                
                $scope.submit = function(name){
                    var project = Projects.save({
                        'name': $sanitize(name)
                    });
             
                    project.$promise.then(function(data){
                        // update our cache data with the new project
                        $projects = Cache.get('allProjects');
                        var url = DashUrl.makeUrl(data.name);
                        data.projectUrl = url;
                        $projects.push(data);
                        Cache.put('allProjects',$projects);

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