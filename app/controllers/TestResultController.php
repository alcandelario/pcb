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

	public function googleCharts(){
		$params = Input::all();
		
		// sometimes we want charts for all serial numbers or 
		// just for a single unit's test attempts
		if(!strcmp($params['serialID'],'all')){
			$resp = Test_Attempt::with('test_result')
			->where('project_id','=',$params['projectID'])
			->orderBy('date','ASC')
			->get();
		}
		else {
			$resp = Test_Attempt::with('test_result')
			->where('serial_number_id','=',$params['serialID'])
			->orderBy('date','ASC')
			->get();
		}
		
		return Response::json($resp,201);	
	
	}


}