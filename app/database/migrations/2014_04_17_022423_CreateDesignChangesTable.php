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
				
			$table->timestamps();

		});

		Schema::table('design_changes', function($table) 
		{
			$table
				->unsignedInteger('project_id')
				->foreign('project_id')
				->references('id')
				->on('projects');
				
			$table
				->unsignedInteger('pcb_revision_id')
				->foreign("pcb_revision_id")
				->references('id')
				->on('pcb_revisions');
			
			$table
				->unsignedInteger('member_id')
				->foreign("member_id")
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
		Schema::dropIfExists("design_changes");
	}

}
