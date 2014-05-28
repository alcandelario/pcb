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

			$table->unsignedInteger('member_id');
			
			$table->unsignedInteger('project_id');
			
			$table
				->unsignedInteger('serial_id')
				->nullable()
				->default(null);

			$table
				->unsignedInteger('reply_to_id')
				->nullable()
				->default(null);

			$table->string("message");

			$table->boolean("is_bug")
				  ->nullable()
				  ->default(0);

			$table->timestamps();
		});

		Schema::table('discussions', function($table) 
		{
			$table
				->foreign('member_id')
				->references('id')
				->on('members');

			$table
				->foreign('project_id')
				->references('id')
				->on('projects');

			$table
				->foreign('serial_id')
				->references('id')
				->on('serial_numbers');

			$table
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
