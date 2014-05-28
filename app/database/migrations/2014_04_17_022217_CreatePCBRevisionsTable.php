<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePCBRevisionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pcb_revisions', function(Blueprint $table)
		{
			$table->increments("id");

			$table
				->string("revision")
				->nullable()
				->default(null);

			$table
				->string("schematic_name")
				->nullable()
				->default(null);

			$table
				->string("layout_name")
				->nullable()
				->default(null);

			$table->timestamps();

		});

		Schema::table('pcb_revisions', function($table) 
		{
			$table
				->unsignedInteger('project_id')
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
		Schema::dropIfExists("pcb_revisions");
	}

}
