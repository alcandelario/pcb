<?php

class Test_Name extends \Eloquent {
	protected $table = 'test_names';
	protected $fillable = array('test_name');

	
	public function test_result()
	{
		return $this->belongsToMany("Test_Result","test_name_id");
	}

    public function test_attempt()
	{
		return $this->hasManyThrough("Test_Attempt", "Test_Result");
	}

}