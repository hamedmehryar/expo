<?php
/**
 * Provides Controller services for {@link \App\Event}.
 *
 * @author     hamedmehryar
 */
namespace App\Http\Controllers;

use App\Repositories\EventRepository;
use App\Repositories\StandRepository;

class EventController extends Controller
{

    private $eventRepository;
    private $standRepository;

    /**
     * EventController constructor.
     * @param EventRepository $eventRepository
     * @param StandRepository $standRepository
     */
    public function __construct(EventRepository $eventRepository, StandRepository $standRepository)
    {
        $this->eventRepository = $eventRepository;
        $this->standRepository = $standRepository;
    }

    /**
     * @param $code
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index($code){

        $event = $this->eventRepository->getByCode($code);

        if (!$event->exists()) {

            return view('event/not-found');

        } else {

            $stands = $this->standRepository->getByEventWithReservation($event->id);
            return view('event/index')
                ->with('event', $event)
                ->with('stands', $stands);
        }

    }
}
