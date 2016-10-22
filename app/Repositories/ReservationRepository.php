<?php

/**
 * Provides Repository services for {@link \App\Reservation}.
 *
 * @author     hamedmehryar
 */

namespace App\Repositories;

use App\Reservation;

class ReservationRepository extends EloquentRepository
{

    /**
     * Initialization of resources.
     *
     * @param Reservation $model
     */
    function __construct(Reservation $model)
    {
        $this->model = $model;
    }

    function reserve()
    {

    }

}