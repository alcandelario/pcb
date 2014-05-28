<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShippingFormsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('shipping_forms', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('member_id');
			
			$table->unsignedInteger('project_id');
			
			$table
				->string("to_firstname")
				->nullable()
				->default(null);

			$table
				->string("to_lastname")
				->nullable()
				->default(null);

			$table
				->string("address")
				->nullable()
				->default(null);

			$table
				->string("city")
				->nullable()
				->default(null);

			$table
				->string("email")
				->nullable()
				->default(null);

			$table
				->string("tracking_number")
				->nullable()
				->default(null);

			$table->date("shipped");

			$table->timestamps();
		});

		Schema::table('shipping_forms', function($table) 
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
		Schema::dropIfExists("shipping_forms");
	}

}
