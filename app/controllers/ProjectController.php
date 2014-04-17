<?php

class ProjectController extends BaseController {

	public function get_projects($id = NULL){
	
		if($id === NULL){
			return Project::all();
		}
		else{
			return Project::find($id);
		}
		
	}
}