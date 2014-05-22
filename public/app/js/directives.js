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
			
				scope.$on('event:auth-loginRequired', function(event,message) {
					/*
					 * Display the 'login' partial and flash a "session expired" alert.
					 * Do not display partial if a new page load, failed login, or
					 * if user manually logs out
					 */
					
				  
					if(message.data.flash != 'userLogout' && message.data.flash != "Authentication failed"){
						
						// session must have expired so show a login partial
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
					else if(message.data.flash == 'Authentication failed'){
						
						// failed login attempt
						authService.loginCancelled();  // dump any buffered http requests
						Flash.show("login_flash","Sorry but your email/password combo did not work. Try again");
					}
				})
			
		        
				scope.$on('event:auth-loginConfirmed', function($rootScope) {
					//scope.sessionExpired = false;
					$cookieStore.put('sessionExpired', 'false');
					// remove the login partial
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
 * To handle conditional navigation bar display 
 * 
 **/
app.directive('loggedInNav', ['$compile','$http','$templateCache','Flash','$rootScope','$cookieStore', function($compile,$http,$templateCache,Flash,$rootScope,$cookieStore) {

	var getTemplate = function(){
		return $http.get("app/partials/header.html", {cache: $templateCache});
	}


	var linker = function(scope,element,attrs) {
		
		var template = function () {
			var loader = getTemplate();
		
			var promise = loader.success(function(html) {
				element.html(html);
			})
			.then(function(response) {
		
				var compiled = $compile(element.html())(scope);
				element.replaceWith(compiled);
				element = compiled;
			})
		}
		
		$rootScope.userLoggedIn = $cookieStore.get('user_logged_in');
	
		if($rootScope.userLoggedIn === "true"){
				//template();
				var compiled = $compile('<header ng-include=\'"app/partials/header.html"\'></header>')(scope);
				element.replaceWith(compiled);
				element = compiled;
		}
			
		scope.$on('event:auth-loginConfirmed', function() {
			/*
			 * Display the 'header' partial
			 */
			
			//template();
			
			var compiled = $compile('<header ng-include=\'"app/partials/header.html"\'></header>')(scope);
			element.append(compiled);
			element = compiled;
		})
		
	        
		scope.$on('event:auth-loginRequired', function(event,message) {
			
			// remove the header partial if the user logged out
			if(message.data.flash == 'userLogout'){
				//scope.sessionExpired = true;

				$cookieStore.put('sessionExpired', 'true');

				var compiled = $compile('<div></div>')(scope);
				element.replaceWith(compiled);
				element = compiled;
			}
		});
		}

return {
	restrict: 'EA',
	    link: linker,
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