/**
   *
   *Setup to print shipping labels
   *
   */
angular.module('labels',[])

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

          for(var $i=0;$i<$emptyFields;$i++){
            $scope.custom.push({"name": ''});
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