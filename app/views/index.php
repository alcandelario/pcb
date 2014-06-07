<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes">
    <title>PeaSeaBee</title>
    <link href="app/css/bootstrap/css/bootstrap.min.css" rel="stylesheet">
   <!--  <link href="app/css/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet"> -->
    <link href="app/css/app.css" rel="stylesheet" />
</head>

<body ng-app="projectTracker" class='row'>

	<div ng-controller='MainController' class='main-cont' ui-view>
			<if-login-required></if-login-required>
			<div class="main-nav" logged-in-nav></div>
			<div class='container main-inner'>
				<div class='row' ng-bind-html="flash" ng-show='showFlash'></div>
				<alert ng-repeat="alert in $rootScope.alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</alert>
				<section class="content-cont row" ui-view='viewContent'></section>
				<footer class='row' ui-view='viewFooter'></footer>
			</div>
	</div>

	<script src="app/lib/angular/angular.min.js"></script>
	<script src="app/lib/angular/angular-route.min.js"></script>
	<script src="app/lib/angular/angular-ui-router.js"></script>
	<script src="app/lib/angular/angular-resource.min.js"></script>
	<script src="app/lib/angular/ui-bootstrap-tpls-0.11.0.min.js"></script>
	<script src="app/lib/angular/angular-sanitize.min.js"></script>
	<script src="app/lib/angular/angular-cookies.min.js"></script>
	<script src="app/lib/angular/http-auth-interceptor.js"></script>
	<script src="app/lib/angular/angular-file-upload.min.js"></script>
	<script src="app/lib/angular/ng-google-chart.js"></script>
	<script src="app/js/app.js"></script>
	<script src="app/js/content.js"></script>
	<script src="app/js/controllers.js"></script>
	<script src="app/js/directives.js"></script>
	<script src="app/js/filters.js"></script>
	<script src="app/js/services/services.js"></script>
	<script src="app/js/services/$fileUploader.js"></script>
	
	<script>
	    angular.module("projectTracker").constant("CSRF_TOKEN", '<?php echo csrf_token(); ?>'); 
	</script>
</body>
</html>