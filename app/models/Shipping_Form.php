<?php

class Shipping_Form extends \Eloquent {
	protected $table = 'shipping_forms';
	protected $fillable = [];
	
	
	public function project()
	{
		return $this->belongsTo("Project");
	}
}