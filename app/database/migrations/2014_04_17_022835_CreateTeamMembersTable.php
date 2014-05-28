<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeamMembersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('team_members', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('member_id');

			$table->unsignedInteger('project_id');


			$table
				->boolean("is_manager")
				->nullable()
				->default(null);

			$table
				->boolean("can_invite")
				->nullable()
				->default(null);

			$table
				->integer("access_level")
				->nullable()
				->default(null);

			$table->timestamps();

		});

		Schema::table('team_members', function($table) 
		{
			$table
				->foreign('member_id')
				->references('id')
				->on('members');

			$table
				->foreign('project_id')
				->references('id')
				->on('projects');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("team_members");
	}

}
