<?php

class Design_Change extends \Eloquent {
	protected $table = 'design_changes';
	protected $fillable = [];
	public $timestamps = FALSE;
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
	
	
}