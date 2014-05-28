<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTextDocumentsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('text_documents', function(Blueprint $table)
		{
			$table->increments("id");

			$table->unsignedInteger('project_id');

			$table->unsignedInteger('member_id');

			$table->text("document");
			
			$table->timestamps();
		});

		Schema::table('text_documents', function($table) 
		{
			$table
				->foreign('project_id')
				->references('id')
				->on('projects');

			$table
				->foreign('member_id')
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
		Schema::dropIfExists("text_documents");
	}

}
