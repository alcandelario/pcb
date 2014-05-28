<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSerialNumbersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('serial_numbers', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('project_id');

			$table
				->string("pcb")
				->nullable()
				->default(null);

			$table
				->string("housing")
				->nullable()
				->default(null);

			$table
				->string("imei")
				->nullable()
				->default(null);

			$table
				->string("ip")
				->nullable()
				->default(null);

			$table
				->string("mac")
				->nullable()
				->default(null);

			$table
				->string("esn")
				->nullable()
				->default(null);

			$table
				->string("phone")
				->nullable()
				->default(null);

			$table
				->string("sim")
				->nullable()
				->default(null);

			$table->timestamps();
		});

		Schema::table('serial_numbers', function($table){
			
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
		Schema::dropIfExists("serial_numbers");
	}

}
