<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSerialNumberShippedTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('serial_numbers_shipped', function(Blueprint $table)
		{
			$table->increments("id");

		});

		Schema::table('serial_numbers_shipped', function($table) 
		{
			$table
				->unsignedInteger('serial_number_id')
				->foreign('serial_number_id')
				->references('id')
				->on('serial_numbers');

			$table
				->unsignedInteger('shipping_form_id')
				->foreign('shipping_form_id')
				->references('id')
				->on('shipping_forms');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{

		Schema::dropIfExists("serial_numbers_shipped");

	}

}
