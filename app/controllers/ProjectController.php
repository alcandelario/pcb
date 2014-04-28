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
		$projects = Project::with(array('team_members' => function($query)
		{
			$query->where('member_id','equals',$id);
		}))->get();
		
		return Response::json($projects,201);
	}
}