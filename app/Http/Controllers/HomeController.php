<?php
/**
 * Provides a controller for home page views/models.
 *
 * @author     hamedmehryar
 */
namespace App\Http\Controllers;

use App\Repositories\EventRepository;

class HomeController extends Controller
{

    private $eventRepository;

    /**
     * HomeController constructor.
     * @param EventRepository $eventRepository
     */
    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    /**
     * @return $this
     */
    public function index()
    {
        $events = $this->eventRepository->getPublished();

        return view('home')
            ->with('events', $events);

    }
}
