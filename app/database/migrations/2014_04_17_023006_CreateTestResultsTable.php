<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTestResultsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('test_results', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('test_attempt_id');

			$table->unsignedInteger('test_name_id');

			$table
				->string("test_num")
				->nullable()
				->default(null);

			$table
				->string("min")
				->nullable()
				->default(null);

			$table
				->string("max")
				->nullable()
				->default(null);

			$table
				->string("actual")
				->nullable()
				->default(null);

			$table
				->string("units")
				->nullable()
				->default(null);

			$table
				->string("result")
				->nullable()
				->default(null);

		});

		Schema::table('test_results', function($table) 
		{
			$table
				->foreign('test_attempt_id')
				->references('id')
				->on('test_attempts');

			$table
				->foreign('test_name_id')
				->references('id')
				->on('test_names');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("test_results");
	}

}
