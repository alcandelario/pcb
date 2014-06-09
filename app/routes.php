<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/


// this first route is to load AngularJS
Route::get('/', function()
{
	return View::make('index');
});


// add the authenticate route for Angular to have access to
Route::group(array('prefix' => 'service'), function() {

	Route::resource('authenticate', 'UserController');
	Route::resource('projects', 'ProjectController');
	Route::resource('serial_numbers', 'SerialNumberController');
	Route::resource('test_attempts', 'TestAttemptController');
	Route::resource('test_results', 'TestResultController');
	Route::resource('upload_data','ImportedDataController');
	Route::resource('test_names','TestNameController');
});

// USER MUST BE LOGGED IN TO GET TO THESE ROUTES
Route::group(["before" => "auth"], function()
{
// 	Route::any('/profile',[
// 				"as"	=> "user/profile",
// 				"uses"	=> 'UserController@profile'
// 	]);
	
	Route::post('chart-test-limits','TestResultController@chartTestLimits');
	Route::get('save-excel','TestResultController@saveExcel');
	
// 	Route::get('projects/{id?}','ProjectController@get_projects');
// 	Route::get('serial_numbers/{proj_id?}/{serial_id?}','SerialNumberController@get_serial_numbers');

});
	
