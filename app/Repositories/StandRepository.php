<?php

/**
 * Provides Repository services for {@link \App\Stand}.
 *
 * @author     hamedmehryar
 */

namespace App\Repositories;


use App\Stand;

class StandRepository extends EloquentRepository
{

    /**
     * Initialization of resources.
     *
     * @param Stand $model
     */
    function __construct(Stand $model)
    {
        $this->model = $model;
    }

    function getByEventWithReservation($eventId)
    {
        return $this->model->byEventWithReservation($eventId)->orderBy('stands.code')->get();
    }

}