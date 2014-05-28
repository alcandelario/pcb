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

			$table->string('test_name');

			$table->timestamps();
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
