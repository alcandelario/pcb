<?php

class Design_Issue extends \Eloquent {
	protected $table = 'design_issues';
	protected $fillable = [];
	
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
	
	
}