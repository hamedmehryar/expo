<?php
/**
 * Compose the home page.
 *
 * @author     hamedmehryar
 */

$event_path      = url('event') .'/';
$image_path = URL::secureAsset('image/event') .'/';

$cssVersion = '1.0.0';
$jsVersion  = '1.0.0';
?>
@extends('web-app')

@section('head')
    <link rel="stylesheet" href="{{ URL::secureAsset('css/home.css?v='. $cssVersion) }}">
@stop

@section('navbar-title')
    Events
@stop


@section('content')
    <div class="parallax" style="background: url({{ URL::secureAsset('image/expo-bg.jpg') }}),linear-gradient(50deg, #ff4169 0, #7c26f8 100%);"></div>
    <div class="map-container" style="">
        <div class="announcement">
            <h1>Select an event and book a Stand Space</h1>
        </div>
        <div class="circle-container">
            <div class="middle-elem">.</div>
            <div class="articles">
            @foreach($events as $event)
                <article class="event" id="{{ $event->code }}" data-itype="{{ $event->image_type }}">
                    <div class="title">
                        <figure class="head">
                            <img src="{{ $image_path . $event->code . \App\Event::$imageTypes[$event->image_type] }}">
                        </figure>
                        <h3>{{ $event->name }}</h3>
                    </div>
                    <div class="body">
                        <div class="desc">
                            {!! $event->description !!}
                        </div>
                        <hr>
                        <div class="location">{{ $event->location }}</div>
                        <div class="dates">
                            <div class="start-at">
                                <label>start:</label>
                                <span>{{ $event->start_at->toDayDateTimeString() }}</span>&nbsp;<div class="label label-default">{{ $event->start_at->diffForHumans()  }}</div>
                            </div>
                            <div class="end-at">
                                <label>end:</label>
                                <span>{{ $event->end_at->toDayDateTimeString() }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <button type="button" class="book">Book your place</button>
                    </div>
                </article>
            @endforeach
            </div>
        </div>
    </div>
@stop

@section('footer')
<script type="application/javascript">
    var jsFooterParams = {
        event_detail_path: "{{ $event_path }}",
        img_path: "{{ $image_path }}"
    };
</script>
<script src="{{ URL::secureAsset('js/home.js?v='. $jsVersion) }}"></script>
@stop