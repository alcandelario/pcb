<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('users', function(Blueprint $table)
		{
			$table->increments("id");

			$table
				->string("username")
				->nullable()
				->default(null);

			$table
				->string("password");

			$table
				->string("email")
				->nullable()
				->default(null);

			$table
				->string("created_at")
				->nullable()
				->default(null);

			$table
				->string("updated_at")
				->nullable()
				->default(null);

			$table
				->boolean("admin")
				->nullable()
				->default(0);

			$table
				->text("remember_token")
				->nullable();

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("users");
	}

}
