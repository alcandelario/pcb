<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTestAttemptsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('test_attempts', function(Blueprint $table)
		{
			$table->increments("id");

			$table
				->string('final_result');
				
			$table
				->date('date');
		});

		Schema::table('test_attempts', function($table) 
		{
			$table
				->unsignedInteger('project_id')
				->foreign('project_id')
				->references('id')
				->on('projects');

			$table
				->unsignedInteger('serial_number_id')
				->foreign('serial_number_id')
				->references('id')
				->on('serial_numbers');

			$table
				->unsignedInteger('member_id')
				->foreign('member_id')
				->references('id')
				->on('members');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("test_attempts");
	}

}
