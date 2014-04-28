<?php

class SerialNumberController extends BaseController {
	

	public function get_serial_numbers($project_id = NULL, $serial_id = NULL){
		/**
		 * supports retrieving system wide serial number data, project specific
		 *  or data for an individual serial number
		 */
		if($project_id === NULL){
			return Serial_Number::all();
		}
		elseif($project_id !== NULL && $serial_id === NULL){
			return Serial_Number::where('project_id','=',$project_id)
								->get();
		}
		elseif($project_id !== NULL && $serial_id !== NULL){
			return Serial_Number::where('project_id','=',$project_id)
						  		->where('id','=',$serial_id)
								->get();
		}
	}
	
	public function show($id){
		$serial_numbers = Serial_Number::where('project_id','=',$id)
		->orderBy(DB::raw('LENGTH(pcb), pcb'))
		->get();
		
		return Response::json($serial_numbers,201);
		
	}
}
