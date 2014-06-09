<?php

class TestNameController extends BaseController {
	
	public function __construct()
	{
		$this->beforeFilter('serviceAuth');
		//$this->beforeFilter('serviceCSRF');
	}
	
	public function index(){
		$test_names = Test_Name::get();

		return Response::json($test_names,201);
	}

	public function show($id){
	
	}
}
