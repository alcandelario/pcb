<?php

class ProjectController extends BaseController {
	
	public function __construct()
	{
		$this->beforeFilter('serviceAuth');
 		//$this->beforeFilter('serviceCSRF');
	}

	public function index(){
		$projects = Response::json(Project::all(),202);
		return $projects;
	}
	
	public function show($id){

		if(strcmp($id,"0") === TRUE){
			$projects = Project::all();
		}
		else {
			$projects = Project::find($id);
		}
		return Response::json($projects,202);
		
	}

	public function store()  // "store()" maps to POST /resource. Used for new project creation
	{

        $project = array("name" => Input::get("name"));
        // Retrieve the user by the attributes, or instantiate a new instance...
		$project = Project::firstOrNew($project);

        if (!$project->exists)
        {
           // project doesn't exist
           $project->save();
           
           // send angularJS a JSON object with new project data
           return Response::json($project,202);
           
        }
        else {
    		return Response::json(['flash' => 'Project exists'],202);
    	}
    }
}