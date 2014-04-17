<?php

class AWT_Test_Metadata extends \Eloquent {
	protected $table = 'awt_test_metadata';
	protected $fillable = array('test_attempt_id','inspector_number', 'tns_system','tns_software_system','test_program_set_build','tps_version','path_loss_file_due');
    public $timestamps = FALSE;
	
	public function test_attempt()
	{
		return $this->belongsTo("Test_Attempt","test_attempt_id","id");
	}
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
}