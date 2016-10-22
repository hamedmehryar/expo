<?php
/**
 * Provides database migration routines for the table expo_stand.
 *
 * @author     hamedmehryar
 */
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateStandsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stands', function (Blueprint $table) {

            $table->increments('id');
            $table->timestamps();
            $table->unsignedInteger('event_id')->index();
            /**
             * Specifies the status of the stand:
             *
             * 0 = available, 1 = reserved
             */
            $table->tinyInteger('status')->default('1');

            $table->string('code', 20);
            $table->decimal('price');
            $table->decimal('sq_meters', 7, 3);
            $table->string('image_ext', 5);
            $table->text('description');

            $table->unique(['event_id', 'code'], 'uk_event_code');
            $table->foreign('event_id')->references('id')->on('events');

            /*
             * Specifies the position of the company logo around the the stand title, being left the default.
             *
             * l = left, t = top, r = right, b = bottom
             */
            $table->char('logo_pos', 1)->nullable();

            /*
             * Specifies whether the reservation confirmation email has been already mailed to the customer
             */
            $table->tinyInteger('email_sent')->default(0);

        });

        DB::statement("
INSERT INTO stands VALUES
    (1, now(), now(), 1, 0, 'N1', 1250, 30, 'jpg', 'Small, but amazing', NULL, 0),
    (2, now(), now(), 1, 0, 'S1', 1600, 40, 'jpg', 'King of the Hill', NULL, 0),
    (3, now(), now(), 1, 0, 'E1', 500, 20, 'jpg', 'Your startup going BIG', NULL, 0),
    (4, now(), now(), 1, 0, 'W1', 2000, 80, 'jpg', 'King of the World', NULL, 0),
    
    (5, now(), now(), 2, 0, 'N1', 990, 15, 'jpg', 'Best spot', NULL, 0),
    (6, now(), now(), 2, 0, 'S1', 880, 15, 'jpg', 'Great views', NULL, 0),
    (7, now(), now(), 2, 0, 'E1', 770, 10, 'jpg', 'Next of the entrance', NULL, 0),
    (8, now(), now(), 2, 0, 'W1', 650, 10, 'jpg', 'Close to the tree', NULL, 0),
    
    (9, now(), now(), 3, 0, 'Olympic1', 20000, 1500, 'jpg', 'Great Green from all', 'l', 0),
    (10, now(), now(), 3, 0, 'Olympic2', 1200, 150, 'jpg', 'Favela view', 'r', 0),
    (11, now(), now(), 3, 0, 'Olympic3', 5000, 500, 'jpg', 'Cristo at the Top', 't', 0),
    (12, now(), now(), 3, 0, 'Olympic4', 2000, 300, 'jpg', 'Beach view', 'l', 0);
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("delete from stands;");

        Schema::drop('stands');
    }
}
