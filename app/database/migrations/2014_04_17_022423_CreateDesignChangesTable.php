<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDesignChangesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('design_changes', function(Blueprint $table)
		{
			$table->increments("id");

			$table
				->integer("project_id")

			$table
				->integer("pcb_revision_id")

			$table
				->integer("member_id")


			$table
				->string("change")
				->nullable()
				->default(null);

			$table
				->string("reason")
				->nullable()
				->default(null);
			
			$table
				->timestamp("date")
				->nullable()
				->default(null);
			
			$table
				->boolean("layout_required")
				->nullable()
				->default(0);

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('design_changes', function(Blueprint $table)
		{
			Schema::dropIfExists("design_changes");
		});
	}

}
