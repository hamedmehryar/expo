<?php
/**
 * Provides database migration routines for the table users.
 *
 * @author     hamedmehryar
 */
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {

            $table->increments('id');
            $table->string('name', 60);
            $table->string('company', 60)->nullable();
            $table->string('company_sname', 12)->nullable();
            $table->string('email')->unique();
            $table->string('password');

            $table->string('dir_name', 50)->unique();
            $table->string('logo_ext', 5)->nullable();

            $table->rememberToken();
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
        Schema::drop('users');
    }
}
