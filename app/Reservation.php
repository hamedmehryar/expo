<?php
/**
 * Provides a model for exposition stand space records.
 *
 * @author     hamedmehryar
 */
namespace App;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'event_id', 'stand_id', 'user_id', 'price'
    ];

    /**
     * Specify what columns which cannot be mass assignable.
     *
     * @var array
     */
    protected $guarded = [
        'status'
    ];
    /**
     * Returns all stand spaces for a specific exposition.
     *
     * @param $query
     * @param $userId
     *
     * @return \Doctrine\DBAL\Query\QueryBuilder
     */
    public function scopeByUser($query, $userId){

        return $query->where('user_id', '=', $userId);

    }

    /**
     * Returns all booked stand spaces for a specific exposition event.
     *
     * @param $query
     * @param $eventId
     *
     * @return \Doctrine\DBAL\Query\QueryBuilder
     */
    public function scopeByEvent($query, $eventId){

        return $query
            ->select(
                'reservations.id as reservation_id',
                'reservations.price',
                'stands.code as stand_code',
                'users.company',
                'users.company_sname',
                'users.name as admin_name',
                'users.email as admin_email'
            )
            ->join('stands', 'stands.id', '=', 'reservations.stand_id')
            ->join('users', 'users.id', '=', 'reservations.user_id')
            ->where('reservations.event_id', '=', $eventId);

    }

    /**
     * Returns the relation to which {@link App\Event} the reservation refers to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function event()
    {
        return $this->belongsTo('App\Event', 'event_id');
    }

    /**
     * Returns the relation to which {@link App\Stand} the reservation/Reservation refers to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function stand()
    {
        return $this->belongsTo('App\Stand', 'stand_id');
    }

    /**
     * Returns the relation to which {@link App\User} the reservation/reservation belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\User', 'user_id');
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

        //setlocale(LC_MONETARY, $locale);

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
}
