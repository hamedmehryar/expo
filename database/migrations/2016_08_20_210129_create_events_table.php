<?php
/**
 * Provides database migration routines for the table expo_event.
 *
 * @author     hamedmehryar
 */
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {

            $table->increments('id');
            $table->timestamps();
            $table->string('code', 6)->unique();

            /**
             * Specify the extension of the image which is housed in the dir image/event/
             *
             * For list see {@link Event::$imageTypes}.
             */
            $table->tinyInteger('image_type')->default('0');

            $table->string('name');
            $table->string('location');
            $table->double('lat');
            $table->double('lon');
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->text('description');

        });

        DB::statement("
INSERT INTO events VALUES
(1, now(), now(), 'xpzJsw', 0, 'California Expo', '55 Music Concourse Dr, San Francisco, CA 94118', '37.770715', '-122.407978', '2016-12-01 09:00:00', '2016-12-25 19:00:00', 'Reinvent your Thursday nights at <strong>After Dark</strong>. Experience a fascinating array of unique, adult-only programs and events that change each week. Grab dinner by the Bay, play with hundreds of hands-on exhibits, crawl through our pitch-black Tactile Dome, sip cocktails, and explore.'),
(2, now(), now(), 'Jhsu8s', 0, 'Las Vegas Expo', '3570 S Las Vegas Blvd, Las Vegas, NV 89109', '38.908519', '-77.036015', '2016-12-02 18:00:00', '2016-12-30 23:00:00', 'There’s always something exciting happening at Fremont Street Experience, from the Viva Vision light show to world-class concerts. Remember, our concerts, live entertainment and Viva Vision shows are all free. That’s not a typo. :-)'),
(3, now(), now(), 'gTYjsw', 0, 'Rio Expo', 'Av. Olof Palme, 305 - Camorim, Rio de Janeiro - RJ, 22783-119', '-22.907710', '-43.176364', '2016-12-12 08:00:00', '2016-12-31 23:59:00', '<strong>Get ready</strong> for the intense excitement of 42 Olympic sport disciplines in one place: <mark>306 events</mark> over the course of 19 days of competition will yield 136 medals for women, 161 for men and nine mixed medals.');
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("delete from events;");

        Schema::drop('events');
    }
}
