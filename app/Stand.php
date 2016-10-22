<?php
/**
 * Provides a Model for exposition stand spaces.
 *
 * @author     hamedmehryar
 */
namespace App;

use Doctrine\DBAL\Query\QueryBuilder;
use Illuminate\Database\Eloquent\Model;

class Stand extends Model
{

    /**
     * Specify what columns which cannot be mass assignable.
     *
     * @var array
     */
    protected $guarded = [
        'status'
    ];

    /**
     * Returns all available stand spaces for a specific exposition event.
     *
     * @param $query
     * @param $eventId
     *
     * @return \Doctrine\DBAL\Query\QueryBuilder
     */
    public function scopeAvailableByEvent($query, $eventId){

        return $query->where('status', '=', 0)->where('event_id', '=', $eventId);

    }

    /**
     * Returns stand spaces for a specific exposition event.
     *
     * @param $query
     * @param $eventId
     *
     * @return \Doctrine\DBAL\Query\QueryBuilder
     */
    public function scopeByEvent($query, $eventId){

        return $query->where('event_id', '=', $eventId);

    }

    /**
     * Returns stand spaces for a specific exposition event.
     *
     * @param $query
     * @param $eventId
     * @param $standId
     *
     * @return \Doctrine\DBAL\Query\QueryBuilder
     */
    public function scopeByEventWithReservation($query, $eventId, $standId=null){

        $query = $query
            ->select(
                'stands.*',
                'users.company_sname',
                'users.dir_name as user_dir_key',
                'users.logo_ext as user_logo_ext',
                'users.name as admin_name',
                'users.email as admin_email',
                'reservations.id as reservation_id'
            )

            ->leftjoin('reservations', function ($join) use($eventId){

                $join
                    ->on('reservations.stand_id', '=', 'stands.id')
                    ->where('reservations.event_id', '=', $eventId);

            })
            ->leftjoin('users', 'users.id', '=', 'reservations.user_id')
            ->where('stands.event_id', '=', $eventId);

        if (!empty($standId))
            $query->where('stands.id', '=', $standId);

        return $query;

    }

    /**
     * Returns stand spaces for a specific exposition event.
     *
     * @param $query
     * @param $eventId
     * @param $standId
     *
     * @return \Doctrine\DBAL\Query\QueryBuilder
     */
    public function scopeWithReservation($query, $eventId, $standId){

        return $query
            ->select(
                'stands.*',
                'users.company_sname',
                'users.name as admin_name',
                'users.email as admin_email',
                'reservations.id as reservation_id',
                'users.dir_name as user_dir_key',
                'users.logo_ext as user_logo_ext'
            )
            ->join('reservations', 'reservations.stand_id', '=', 'stands.id')
            ->join('users', 'users.id', '=', 'reservations.user_id')
            ->where('reservations.event_id', '=', $eventId)
            ->where('reservations.stand_id', '=', $standId);

    }

    /**
     * Returns TRUE if the stand is already booked.
     *
     * @return bool
     */
    public function reserved(){

        return $this->attributes['status'] == 1;

    }

    /**
     * Returns the price formatted to money.
     *
     * @param float $value
     * @param string $locale
     *
     * @return string
     */
    public function getPriceAttribute($value, $locale='en_US'){

        // setlocale(LC_MONETARY, $locale);

        return Util::formatMoney($value, 1);

    }

    /**
     * Returns the price formatted to money.
     *
     * @return string
     */
    public function priceToDB(){

        return $this->attributes['price'];

    }

    /**
     * Returns the sq meters formatted with m2.
     *
     * @return string
     */
    public function sqMetersFormatted(){

        return floatval($this->sq_meters) .'m2';

    }

    /**
     * Returns the relation to which {@link App\Event} the stand belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function event()
    {
        return $this->belongsTo('App\Event', 'event_id');
    }
}
