<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDiscussionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * Messages related to project or serial number
	 * along with replies
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('discussions', function(Blueprint $table)
		{
			$table->increments("id");

			$table
				->string("message");

			$table->timestamps();
		});

		Schema::table('discussions', function($table) 
		{
			$table
				->unsignedInteger('member_id')
				->foreign('member_id')
				->references('id')
				->on('members');

			$table
				->unsignedInteger('project_id')
				->foreign('project_id')
				->references('id')
				->on('projects');

			$table
				->unsignedInteger('serial_id')
				->foreign('serial_id')
				->references('id')
				->on('serial_numbers');

			$table
				->unsignedInteger('reply_to_id')
				->foreign('reply_to_id')
				->references('id')
				->on('discussions');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("discussions");
	}

}
