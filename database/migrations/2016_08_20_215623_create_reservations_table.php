<?php
/**
 * Provides database migration routines for the table reservations.
 *
 * @author     hamedmehryar
 */
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {

            $table->increments('id');
            $table->timestamps();

            $table->unsignedInteger('event_id')->index();
            $table->foreign('event_id')->references('id')->on('events');

            $table->unsignedInteger('stand_id')->index();
            $table->foreign('stand_id')->references('id')->on('stands');

            $table->unsignedInteger('user_id')->index();
            $table->foreign('user_id')->references('id')->on('users');

            $table->decimal('price');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('reservations');
    }
}
