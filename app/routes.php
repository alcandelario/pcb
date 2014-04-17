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

Route::get('/', function()
{
	return View::make('hello');
});

Route::post('auth/login','HomeController@login');

Route::post('auth/logout/{id}','HomeController@logout');

Route::post('upload_data/{id}','UploadedDataController@pcb_test_data');

Route::get('projects/{id?}','ProjectController@get_projects');

Route::get('serial_numbers/{proj_id?}/{serial_id?}','SerialNumberController@get_serial_numbers');

// an overview of this serial number's test attempts
Route::get('test_attempts/{proj_id}/{serial_id?}','TestAttemptController@get_test_attempts');

Route::get('test_results/{attempt_id}/{type_of?}','TestAttemptController@get_attempt_results');