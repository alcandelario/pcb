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
<div class="alert" ng-show="flash" ng-bind="flash"></div>

<div id="content" ng-controller='ContentController' class="ng-scope">
	<div class="container" ng-view></div>
</div>

<script src="app/lib/angular/angular.min.js"></script>
<script src="app/lib/angular/angular-route.min.js"></script>
<script src="app/lib/angular/angular-resource.min.js"></script>
<script src="app/lib/angular/angular-sanitize.min.js"></script>
<script src="app/lib/angular/http-auth-interceptor.js"></script>
<script src="app/js/app.js"></script>
<script src="app/js/content.js"></script>
<script src="app/js/controllers.js"></script>
<script src="app/js/directives.js"></script>
<script src="app/js/filters.js"></script>
<script src="app/js/services.js"></script>

<script>
    angular.module("projectTracker").constant("CSRF_TOKEN", '<?php echo csrf_token(); ?>'); 
</script>
</body>
</html>