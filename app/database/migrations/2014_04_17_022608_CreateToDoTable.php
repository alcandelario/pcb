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

			$table
				->string("todo_item");

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

		Schema::table('todo', function($table)
		{
			$table
				->unsignedInteger('member_id')
				->foreign('member_id')
				->references('id')
				->on('members');

			$table
				->unsignedInteger('project_id')
				->foreign('project_id')
				->references('id')
				->on('projects');

			$table
				->unsignedInteger('assigned_to_id')
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
