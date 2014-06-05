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
		$query = 'SELECT test_attempts.id,date,final_result,pcb,test_name,min,max,actual,units,result FROM test_attempts 
					INNER JOIN test_results ON test_attempts.id = test_results.test_attempt_id
					INNER JOIN test_names ON test_results.test_name_id = test_names.id
					INNER JOIN serial_numbers ON test_attempts.serial_number_id = serial_numbers.id
					WHERE test_attempts.project_id = '.$params['projectID'].' ';


		if(!strcmp($params['serialID'],'all')){
			// do nothing
		}
		else {
			// add the serial number clause for charting an individual unit's data
			$query = $query.'AND test_attempts.serial_number_id = '.$params['serialID'];
		}

		// build the rest of the query and add the ORDER clause
		$query = $query.' ORDER BY test_name';
		
		$results = DB::select( DB::raw($query) );
		
		return Response::json($results,201);	
	
	}


}