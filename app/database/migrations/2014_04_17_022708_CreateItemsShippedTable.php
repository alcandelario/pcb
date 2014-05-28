<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsShippedTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('shipped_items', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('shipping_form_id');

			$table->unsignedInteger('serial_number_id');

			$table->unsignedInteger('shipping_form_content_id');

			$table->timestamps();

		});

		Schema::create('shipping_form_contents', function(Blueprint $table) 
		{
			$table->increments("id");

			$table->string("item");

			$table->integer("qty");

			$table->string("item_note");

			$table->timestamps();

		});

		Schema::table('shipped_items', function($table) 
		{
			$table
				->foreign('serial_number_id')
				->references('id')
				->on('serial_numbers');

			$table
				->foreign('shipping_form_id')
				->references('id')
				->on('shipping_forms');

			$table
				->foreign('shipping_form_content_id')
				->references('id')
				->on('shipping_form_contents');

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
