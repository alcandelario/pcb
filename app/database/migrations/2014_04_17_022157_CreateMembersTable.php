<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMembersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('members', function(Blueprint $table)
		{
			$table->increments("id");

			$table
				->string("position")
				->nullable()
				->default(null);

			$table
				->string("firstname")
				->nullable()
				->default(null);

			$table
				->string("lastname")
				->nullable()
				->default(null);

			$table
				->string("ph_work")
				->nullable()
				->default(null);

			$table
				->string("ph_home")
				->nullable()
				->default(null);

			$table
				->string("email_work")
				->nullable()
				->default(null);

			$table
				->string("email_home")
				->nullable()
				->default(null);

			$table
				->boolean("active")
				->nullable()
				->default(1);

			$table->timestamps();

		});

		Schema::table('members', function($table) 
		{
			$table
				->unsignedInteger('user_id')
				->foreign('user_id')
				->references('id')
				->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("members");
	}

}
