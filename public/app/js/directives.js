/**
 * To handle session expiration
 * 
 * Use http-auth-interceptor to look for any 401 (unauthorized) events
 * and prompt user to login
 * 
 **/
app.directive('ifLoginRequired', ['$compile','$http','$templateCache','Flash','authService','$cookieStore', function($compile,$http,$templateCache,Flash,authService,$cookieStore) {
	
		var getTemplate = function(){
			return $http.get("app/partials/login.html", {cache: $templateCache});
		}
	
	
		var linker = function(scope,element,attrs) {
			
				// Session expired handler will insert 'login' partial
				// Will ignore a user logout action or a failed auth attempt (as reported by server)
				scope.$on('event:auth-loginRequired', function(event,message) {
								  
					if(message.data.flash != 'userLogout' && message.data.flash != "Authentication failed"){
						
						var loader = getTemplate();
					
						var promise = loader.success(function(html) {
							element.html(html);
						})
						.then(function(response) {
						
							var compiled = $compile(element.html())(scope);
							element.replaceWith(compiled);
							element = compiled;
						})
						
						Flash.show("login_flash", "Your session expired. Please log the fuck back in");
					}

					// For failed login attempts, just show a flash message to user
					else if(message.data.flash == 'Authentication failed'){
						authService.loginCancelled();  // dump any buffered http requests
						Flash.show("login_flash","Sorry but your email/password combo did not work. Try again");
					}
				})
			
				
				// Successful login handler will remove 'login' partial		        
				scope.$on('event:auth-loginConfirmed', function($rootScope) {
					$cookieStore.put('sessionExpired', 'false');
					var compiled = $compile('<div></div>')(scope);
					element.replaceWith(compiled);
					element = compiled;
				});
			}
	
	return {
		restrict: 'E',
		    link: linker,
	     replace: true
	}		
}]);


/**
 * To handle conditional nav bar display based on authentication status
 * 
 **/
app.directive('loggedInNav', ['$compile','$http','$templateCache','Flash','$rootScope','$cookieStore', function($compile,$http,$templateCache,Flash,$rootScope,$cookieStore) {

	var linker = function(scope,element,attrs) {
		
		// The default, non-event driven state of this directive
		$rootScope.userLoggedIn = $cookieStore.get('user_logged_in');
		$rootScope.username = $cookieStore.get('username');
		
		if($rootScope.userLoggedIn === "true"){
			var compiled = $compile('<header class="main-nav" ng-include=\'"app/partials/header.html"\'></header>')(scope);
			element.replaceWith(compiled);
			element = compiled;
		}


		// Successful login handler. Will insert header partial
		scope.$on('event:auth-loginConfirmed', function() {
			var compiled = $compile('<header class="main-nav" ng-include=\'"app/partials/header.html"\'></header>')(scope);
			element.replaceWith(compiled);
			element = compiled;
		})
		
	    // User logout handler will remove header partial
	    // Ignores any "session expired" events
		scope.$on('event:auth-loginRequired', function(event,message) {
			
			if(message.data.flash == 'userLogout'){
				var e = element.next();
				e.remove();
			}
		});
	}

return {
	restrict: 'EA',
	    link: linker,
	 replace: true,
  transclude: true
 }		

}]);
/**
 * The angular file upload module
 * @author: nerv
 * @version: 0.5.6, 2014-04-24
 */

// It is attached to <input type="file"> element like <ng-file-select="options">
app.directive('ngFileSelect', ['$fileUploader', function($fileUploader) {
    'use strict';

    return {
        link: function(scope, element, attributes) {
            if(!$fileUploader.isHTML5) {
                element.removeAttr('multiple');
            }

            element.bind('change', function() {
                var data = $fileUploader.isHTML5 ? this.files : this;
                var options = scope.$eval(attributes.ngFileSelect);

                scope.$emit('file:add', data, options);

                if($fileUploader.isHTML5 && element.attr('multiple')) {
                    element.prop('value', null);
                }
            });

            element.prop('value', null); // FF fix
        }
    };
}]);
app.directive('closeMe', function() {
	'use strict';

	return { 
			link: function(scope,element,attrs) {
					
					element.bind('click', function(e) {
						e.preventDefault();
						element.parent().remove();	
					})
			  }
	}
});

/**
 *
 *
 * Display the data upload form
 *
 */
 app.directive('uploadDataForm',['$fileUploader','$compile','$http','$templateCache','$rootScope','$cookieStore','$location', function($fileUploader,$compile,$http,$templateCache,$rootScope,$cookieStore,$location) {
 
 	var getTemplate = function(){
			return $http.get("app/partials/data-upload.html", {cache: $templateCache});
		}

	var linker = function(scope,element,attrs) {

				// make sure this isn't visiable
				scope.isCollapsed = "true";
			
				// Session expired handler will insert 'login' partial
				// Will ignore a user logout action or a failed auth attempt (as reported by server)
				element.bind('click', function(event) {
						event.preventDefault();

						var loader = getTemplate();

						var promise = loader.success(function(html) {
							
							var compiled = $compile(html)(scope);
							element.parent().next().prepend(compiled);							
						})
				})
			}			
			
	var uploadController = function($cookieStore,$location,$fileUploader,$scope){
		// build the route Laravel will respond to for file uploads
    	var $projectID = $cookieStore.get('projectID');
    	var $url = $location.absUrl();
    	var $path = "index.php?/#"+$location.path();
    	var $mode = "0"    //default upload mode
    	$url = $url.replace($path,"/service/upload_data");
    	
    	// testing only
    	$url = "http://localhost/pcbtracker/public/service/upload_data";
    	
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
        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
        	$scope.upload_status = {type:"danger", msg: "Uh oh, problem saving your data to the database"};
            $scope.showUploadFlash = true;
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
	}		
	
	return {
		restrict: 'A',
		    link: linker,
	  controller: uploadController
	}		


 }]);