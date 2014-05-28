<?php

class Serial_Number extends \Eloquent {
	
	protected $table = 'serial_numbers';
	protected $fillable = array('project_id','pcb','housing','imei','ip','mac','esn','phone','sim');
	
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
	
	public function test_attempt()
	{
		return $this->hasMany("Test_Attempt","serial_number_id");
	}
	
	public function shipped_item()
	{
		return $this->hasMany("shipped_items","serial_number_id");
	}
	
	
	
}