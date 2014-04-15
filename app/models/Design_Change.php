<?php

class Design_Change extends \Eloquent {
	protected $table = 'design_changes';
	protected $fillable = [];
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
	
	
}