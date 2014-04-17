<?php

class Member extends \Eloquent {
	protected $fillable = [];
	public $timestamps = FALSE;
	
	public function user()
	{
		return $this->hasOne("User");
	}
	
	
	
}