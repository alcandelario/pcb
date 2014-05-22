<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>PeaSeaBee</title>
    <link href="app/css/bootstrap.min.css" rel="stylesheet">
    <link href="app/css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="app/css/app.css" rel="stylesheet" />
</head>
<body ng-app="projectTracker">

	<div ng-controller='MainController' class='col-md-12' ui-view>
			<if-login-required></if-login-required>
			<div logged-in-nav></div>
			<div ng-bind-html="flash" ng-show='showFlash'></div>
			<section ui-view='content'></section>
			<footer ui-view='footer'></footer>
	</div>

	<script src="app/lib/angular/angular.min.js"></script>
	<script src="app/lib/angular/angular-route.min.js"></script>
	<script src="app/lib/angular/angular-ui-router.js"></script>
	<script src="app/lib/angular/angular-resource.min.js"></script>
	<script src="app/lib/angular/angular-sanitize.min.js"></script>
	<script src="app/lib/angular/angular-cookies.min.js"></script>
	<script src="app/lib/angular/http-auth-interceptor.js"></script>
	<script src="app/lib/angular/angular-file-upload.min.js"></script>
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