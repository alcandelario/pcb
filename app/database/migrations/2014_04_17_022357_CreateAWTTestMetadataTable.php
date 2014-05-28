<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAWTTestMetadataTable extends Migration {

	/**
	 * Run the migrations.$table->increments("id");
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('awt_test_metadata', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('test_attempt_id');
			
			$table
				->string("inspector_number")
				->nullable()
				->default(null);

			$table
				->string("tns_system")
				->nullable()
				->default(null);

			$table
				->string("tns_software_version")
				->nullable()
				->default(null);

			$table
				->string("test_program_set_build")
				->nullable()
				->default(null);

			$table
				->string("tps_version")
				->nullable()
				->default(null);

			$table
				->string("path_loss_file_due")
				->nullable()
				->default(null);

			$table->timestamps();

		});

		Schema::table("awt_test_metadata", function($table) 
		{
			$table
				->foreign('test_attempt_id')
				->references('id')
				->on('test_attempts');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("awt_test_metadata");
	}

}
