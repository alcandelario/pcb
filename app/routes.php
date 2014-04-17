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


Route::group(["before" => "guest"], function()
{
	Route::any("/", [
		"as"   => "user/login",
		"uses" => "UserController@login"
		]);
	
	Route::any("/request", [
	"as"   => "user/reset_password_request",
	"uses" => "UserController@resetPasswordRequest"
	]);
	
	Route::any("/reset", [
	"as"   => "user/reset_password",
	"uses" => "UserController@resetPassword"
	]);
	
});	
	
// USER MUST BE LOGGED IN TO GET TO THESE ROUTES
Route::group(["before" => "auth"], function()
{
	Route::any('/profile',[
				"as"	=> "user/profile",
				"uses"	=> 'UserController@profile'
	]);
	
	Route::any("/logout", [
				"as"   => "user/logout",
				"uses" => "UserController@logoutAction"
	]);
	
	Route::post('upload_data/{id}','ImportedDataController@pcb_test_data');
	
	Route::get('projects/{id?}','ProjectController@get_projects');
	
	Route::get('serial_numbers/{proj_id?}/{serial_id?}','SerialNumberController@get_serial_numbers');
	
	// an overview of this serial number's test attempts
	Route::get('test_attempts/{proj_id}/{serial_id?}','TestAttemptController@get_test_attempts');
	
	Route::get('test_results/{attempt_id}/{type_of?}','TestAttemptController@get_attempt_results');

});
	
