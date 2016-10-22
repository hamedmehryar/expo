<?php

/**
 * Provides Repository services for {@link \App\Event}.
 *
 * @author     hamedmehryar
 */

namespace App\Repositories;


use App\Event;

class EventRepository extends EloquentRepository
{

    /**
     * Initialization of resources.
     *
     * @param Event $model
     */
    function __construct(Event $model)
    {
        $this->model = $model;
    }

    function getByCode($code)
    {
        return $this->model->where('code', $code)->first();
    }

    function getPublished()
    {
        return $this->model->published()->orderBy('start_at')->get();
    }

}