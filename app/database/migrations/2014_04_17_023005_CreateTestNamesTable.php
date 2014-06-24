<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTestNamesTable extends Migration {

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
		Schema::create('test_names', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('project_id');

			$table->string('test_name');

			$table->timestamps();
		});

		Schema::table('test_names', function($table){
			
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
		Schema::dropIfExists("test_names");
	}

}
