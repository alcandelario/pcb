<?php

class Team_Member extends \Eloquent {
	protected $table = 'team_members';
	protected $fillable = [];
	
	
	public function project()
	{
		return $this->belongsToMany("Project");
	}
	
	public function member()
	{
		return $this->hasOne("Member");
	}
	
	
}