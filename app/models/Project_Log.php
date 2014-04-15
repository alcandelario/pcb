<?php

class Project_Log extends \Eloquent {
	protected $table = 'project_logs';
	protected $fillable = [];
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
}