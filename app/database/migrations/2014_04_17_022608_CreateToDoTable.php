<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateToDoTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('todo', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('todo_name_id');

			$table->unsignedInteger('member_id');

			$table->unsignedInteger('project_id');

			$table
				->unsignedInteger('assigned_to_id')
				->nullable()
				->default(null);

			$table->string("todo_item");

			$table
				->date("due_date")
				->nullable()
				->default(null);
			
			$table
				->boolean("completed")
				->nullable()
				->default(null);

			$table->timestamps();
		});

		
		Schema::create('todo_names', function(Blueprint $table)
		{
			$table->increments("id");

			$table->string("name");

			$table
				  ->boolean("is_hardware")  	// false = software
				  ->nullable()
				  ->default(1);

			$table
				  ->boolean("is_mechanical")	// false = TBD
				  ->nullable()
				  ->default(0);

			$table
				  ->boolean("final_shipment")	// false = TBD
				  ->nullable()
				  ->default(0);


			$table->timestamps();
		});


		Schema::table('todo', function($table)
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
				->foreign('assigned_to_id')
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
		Schema::dropIfExists("todo");
	}

}
