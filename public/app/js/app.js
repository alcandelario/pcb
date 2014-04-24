var app = angular.module("projectTracker",[
                                           'http-auth-interceptor',
                                           'content',
                                           'ngResource',
                                           'ngSanitize',
                                           'ngRoute'
                                           ]);

app.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/',{templateUrl:'app/partials/login.html', controller: 'loginController'});
        $routeProvider.when('/home',{templateUrl:'app/partials/home.html', controller: 'homeController'});
        $routeProvider.otherwise({redirectTo :'/'});
    }]);


app.run(function($http,CSRF_TOKEN){
            $http.defaults.headers.common['csrf_token'] = CSRF_TOKEN;
        });

app.directive('authMessages', function() {
    return {
        restrict: 'C',
        link: function($scope) {
          
          $scope.$on('event:auth-loginRequired', function() {
        	  $rootScope.flash = "Login Failed";
          });
          
          $scope.$on('event:auth-loginConfirmed', function() {
          
          });
        }
      }
    });