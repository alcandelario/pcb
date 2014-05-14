<?php

class TestAttemptController extends BaseController {
	
	public function __construct()
	{
		$this->beforeFilter('serviceAuth');
		//$this->beforeFilter('serviceCSRF');
	}
	
// 	public function get_test_attempts($project_id, $serial_id = NULL){
// 		if($serial_id === NULL){
// 			$resp = Test_Attempt::where('project_id','=',$project_id)
// 							   ->get();
// 			return $resp;
// 		}
// 		else{
// 			$resp = Test_Attempt::where('project_id','=',$project_id)
// 							   ->where('serial_number_id','=',$serial_id)
// 							   ->get();
			
// 			return $resp;
// 		}
// 	}
	
	
// 	public function get_attempt_results($id, $type_of = NULL){

// 		if($type_of === NULL){  // this request is probably for AWT based test results
// 			$resp = Test_Attempt::with('awt_test_metadata','test_result')->find($id);
			
// 			return $resp;
// 		}
// 		elseif(strpos($type_of,'custom') !== FALSE){
// 			// this data displayed will likely come from custom data tables
// 			// a user created themself
// 			// NOT 100% sure I need to differentiate between the two
// 		}
// 	}
	
	public function show($id){
		
		$test_attempts = Test_Attempt::with('serial_number')
		->where('serial_number_id','=',$id)
		->orderBy('date','ASC')
		->get();
	
		return Response::json($test_attempts,201);
	
	}
	
	
	
}