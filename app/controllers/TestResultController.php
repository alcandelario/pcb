<?php
class TestResultController extends BaseController {

	public function __construct()
	{
		$this->beforeFilter('serviceAuth');
		//$this->beforeFilter('serviceCSRF');
	}
	
	public function show($id){
		//$results = Test_Attempt::with('awt_test_metadata','test_result')->find($id);
		
		$results = DB::table("test_attempts")
						->join('awt_test_metadata', 'test_attempts.id','=','awt_test_metadata.test_attempt_id')
						->join('test_results','test_attempts.id','=','test_results.test_attempt_id')
						->join('test_names', 'test_results.test_name_id','=','test_names.id')
						->where("test_attempts.id",'=',$id)
						->get();

		return Response::json($results,201);

	}

	public function googleCharts(){
		$params = Input::all();
		
		// sometimes we want charts for all serial numbers or 
		// just for a single unit's test attempts
		if(!strcmp($params['serialID'],'all')){

			$resp = DB::table("test_attempts")
						->join('test_results','test_attempts.id','=','test_results.test_attempt_id')
						->join('test_names', 'test_results.test_name_id','=','test_names.id')
						->join('serial_numbers', 'test_attempts.project_id','=',"serial_numbers.project_id")
						->where("test_attempts.project_id",'=',$params['projectID'])
						->orderBy("test_name")
						// ->where("test_attempts.final_result" '!=','Incomplete')
						->get();
		}
		else {

			$resp = DB::table("test_attempts")
						->join('test_results','test_attempts.id','=','test_results.test_attempt_id')
						->join('test_names', 'test_results.test_name_id','=','test_names.id')
						->join('serial_numbers', 'test_attempts.serial_number_id','=',"serial_numbers.id")
						->where("test_attempts.project_id",'=',$params['projectID'])
						->where("test_attempts.serial_number_id",'=',$params['serialID'])
						// ->where("test_attempts.final_result" '!=','Incomplete')
						->get();
		}
		
		return Response::json($resp,201);	
	
	}


}