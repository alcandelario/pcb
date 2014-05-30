<?php

class Test_Name extends \Eloquent {
	protected $table = 'test_names';
	protected $fillable = array('test_name');

	
	public function test_result()
	{
		return $this->belongsTo("Test_Result","test_result_id");
	}


}