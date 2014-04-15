<?php

class Serial_Number extends \Eloquent {
	
	protected $table = 'serial_numbers';
	protected $fillable = array('project_id','pcb','housing','imei','ip','mac','esn','phone','sim');
	public $timestamps = FALSE;
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
	
	public function test_attempt()
	{
		return $this->hasMany("Test_Attempt","serial_number_id");
	}
	
	public function serial_numbers_shipped()
	{
		return $this->hasMany("Serial_Number_Shipped","serial_number_id");
	}
	
	
	
}