<?php

class ProjectController extends BaseController {
	
	public function __construct()
	{
		$this->beforeFilter('serviceAuth');
 		//$this->beforeFilter('serviceCSRF');
	}

	public function index(){
		$projects = Response::json(Project::all(),201);
		return $projects;
	}
	
	public function show($id){
		return Response::json(Project::find($id),201);
	}
}