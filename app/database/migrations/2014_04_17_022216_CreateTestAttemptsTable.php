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

			$table->unsignedInteger('project_id');

			$table->unsignedInteger('serial_number_id');
			
			$table->unsignedInteger('member_id');
			
			$table->string('final_result');
				
			$table->dateTime('date');

			$table->timestamps();
		});

		Schema::table('test_attempts', function($table) 
		{
			$table
				->foreign('project_id')
				->references('id')
				->on('projects');

			$table
				->foreign('serial_number_id')
				->references('id')
				->on('serial_numbers');

			$table
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
