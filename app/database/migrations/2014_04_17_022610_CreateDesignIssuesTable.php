<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDesignIssuesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('design_issues', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('project_id');

			$table->unsignedInteger('pcb_revision_id');
			
			$table->unsignedInteger('member_id');
			
			$table->string("issue");

			$table->text("resolution");
	
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

		Schema::create('bugs', function(Blueprint $table) 
		{
			$table->increments("id");

			$table->unsignedInteger("design_issue_id");

			$table->unsignedInteger("discussion_id");

			$table->unsignedInteger("creator");

			$table->unsignedInteger("assignee");

			$table->date("due");

			$table
				->boolean("resolved")
				->default(0);

			$table->timestamps();
		});


		Schema::table('design_issues', function($table) 
		{
			$table
				->foreign('project_id')
				->references('id')
				->on('projects');
				
			$table
				->foreign("pcb_revision_id")
				->references('id')
				->on('pcb_revisions');
			
			$table
				->foreign("member_id")
				->references('id')
				->on('members');
		});


		Schema::table('bugs', function($table) 
		{
			$table
				->foreign("design_issue_id")
				->references('id')
				->on('design_issues');

			$table
				->foreign("discussion_id")
				->references('id')
				->on('discussions');

			$table
				->foreign("creator")
				->references('id')
				->on('members');

			$table
				->foreign("assignee")
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
