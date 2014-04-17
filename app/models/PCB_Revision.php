<?php

class PCB_Revision extends \Eloquent {
	protected $table = 'pcb_revisions';
	protected $fillable = [];
	public $timestamps = FALSE;
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
}