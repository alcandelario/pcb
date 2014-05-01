<?php
class TestResultController extends BaseController {

	public function __construct()
	{
		$this->beforeFilter('serviceAuth');
		//$this->beforeFilter('serviceCSRF');
	}
	
	public function show($id){
		$resp = Test_Attempt::with('awt_test_metadata','test_result')->find($id);
		$resp = Response::json($resp,201);

		return $resp;
	}



}