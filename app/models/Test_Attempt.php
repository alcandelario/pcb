<?php

class Test_Attempt extends \Eloquent {
	
	protected $table = 'test_attempts';
	protected $fillable = array('project_id','member_id','serial_number_id','final_result','date');
	

	public function project()
	{
		return $this->belongsTo("Project");
	}
	
	public function serial_number()
	{
		return $this->belongsTo("Serial_Number","serial_number_id");
	}
	
	public function member() 
	{
		return $this->belongsTo("Member");
	}
	
	public function awt_test_metadata()
	{
		return $this->hasOne("AWT_Test_Metadata","test_attempt_id");
	}
	
	public function test_result()
	{
		return $this->hasMany("Test_Result","test_attempt_id");
	}
	

}