<?php

class Project extends \Eloquent {
	protected $fillable = array('name','charge_code');
	protected $guarded = array('id');
	
	
	public function serial_number()
	{
		return $this->hasMany('serial_number');
	}
	
	public function team_member()
	{
		return $this->hasMany('team_member');
	}
	
	public function test_attempt()
	{
		return $this->hasMany('test_attempt');
	}
	
	public function design_change()
	{
		return $this->hasMany('design_issue');
	}
	
	
	public function pcb_revision()
	{
		return $this->hasMany('pcb_revision');
	}
	
	public function shipping_form()
	{
		return $this->hasMany('shipping_form');
	}
	
	
	
	
	
}