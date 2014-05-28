<?php

class Test_Result extends \Eloquent {
	protected $table = 'test_results';
	protected $fillable = array('test_attempt_id','test_num','test_name','min','max','actual','units','result');
	
	public function test_attempt()
	{
		return $this->belongsTo("Test_Attempt","test_attempt_id");
	}
	
	
}