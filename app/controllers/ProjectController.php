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
// 		$projects = Project::with(array('team_members' => function($query)
// 		{
// 			$query->where('member_id','equals',$id)
// 		}))->get();
		if(str_contains($id,"0") === TRUE){
			$projects = Project::all();
			return Response::json($projects,202);
		}
		else {
			$projects = Project::find($id);
			return Response::json($projects,202);
		}
		
	}

	public function store()  // "store()" maps to POST /resource. Used for new project creation
	{
	//             $validator = Validator::make(Input::all(), [
//                 "name"    => "required"
//             ]);
            
//             if ($validator->passes())
//             {
                $project = [
                    "name" => Input::get("name")
                ];
                // Retrieve the user by the attributes, or instantiate a new instance...
				$project = Project::firstOrNew($project);

                if (!$project->exists)
                {
                   // project doesn't exist
                   $project->save();
                   
                   // send angularJS a JSON object with new project infouser data
                   $resp = Response::json($project,202);
                   return $resp;
                }
                else {
            		$resp = Response::json(['flash' => 'Project exists'],202);
            		return $resp;
            	}
            //}
    }
}