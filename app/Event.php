<?php
/**
 * Provides a model for exposition events.
 *
 * @author     hamedmehryar
 */
namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Event extends Model
{

    /**
     * Specify to Laravel what columns should be treated as date/time.
     *
     * @var array
     */
    protected $dates = ['start_at', 'end_at'];

    /**
     * Types used for the column image_type
     *
     * @var array
     */
    public static $imageTypes = [0 => '.jpg', '1' => 'png'];

    /**
     * Returns records with start_at greater than now.
     *
     * @param $query
     *
     * @return \Doctrine\DBAL\Query\QueryBuilder
     */
    public function scopePublished($query){

        return $query->where('start_at', '>', Carbon::now());

    }


    /**
     * Returns TRUE if the event ending date/time is past or quantity of booked stand space is greater than 0.
     *
     * @param $eventId
     *
     * @return Boolean
     */
    public static function emailReportAllowed($eventId){

        $queryResult = DB::table('stands')
            ->select(array(DB::raw('COUNT(stands.id) as qty')))
            ->where('status', '=', 1)
            ->where('event_id', '=', $eventId)->first();

        return (

           ($queryResult && $queryResult->qty > 0) ||

           DB::table('events')->where('id', '=', $eventId)->where('end_at', '<', Carbon::now())->count() > 0
        );

    }
}
