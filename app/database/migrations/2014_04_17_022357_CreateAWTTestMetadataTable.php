<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAWTTestMetadataTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('awt_test_metadata', function(Blueprint $table)
		{
			$table->increments("id");

			$table
				->integer("test_attempt_id")
				
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

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('awt_test_metadata', function(Blueprint $table)
		{
			//
		});
	}

}
