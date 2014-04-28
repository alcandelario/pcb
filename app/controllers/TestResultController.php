<?php
class TestResultController extends BaseController {

	public function show($id){
		$resp = Test_Attempt::with('awt_test_metadata','test_result')->find($id);
		$resp = Response::json($resp,201);

		return $resp;
	}



}