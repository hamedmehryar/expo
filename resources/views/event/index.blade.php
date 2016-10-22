<?php
/**
 * Compose the event/index page.
 *
 * @author     hamedmehryar
 */

$cssVersion    = '1.0.0';
$jsVersion     = '1.0.0';

$reservedSymbol  = '&#x2714;';
$userAssetsDir = URL::secure_asset('user-assets');

?>
@extends('web-app')

@section('head')
    <link rel="stylesheet" href="{{ URL::secure_asset('css/event/index.css?v='. $cssVersion) }}">
@stop

@section('nav-bar-attachment'){{ 'static' }}@stop

@section('navbar-title')
    {{ $event->name }}
@stop

@section('right-navbar')
    <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Admin Menu <span class="caret"></span></a>
            <ul class="dropdown-menu">
                <li><a href="#" id="menu-send-rep-email">Send email report</a></li>
            </ul>
        </li>
    </ul>
@stop

@section('content')

    <h4 class="title">You can book a place by clicking in the available - <span class="stand-ref">Green</span> - listing below.</h4>

    <div class="stand-list-wrapper">
        <ul class="stand-list">
        @foreach($stands as $stand)
            <li id="{{ $event->id .'_'. $stand->id }}" {!! $stand->reserved() ? ' class="booked"' : '' !!}>
                <span class="title">
                    {!!
                    $stand->code .

                    ($stand->reserved()
                        ? '<abbr>'.
                                '<span>'. $reservedSymbol .' '. $stand->company_sname .'</span>'.
                                '<i class="co-logo mini" style="background-image:url('. \App\User::urlToLogo($stand->user_dir_key, $stand->user_logo_ext) .')"></i>'.
                          '</abbr>'

                        : '')
                    !!}
                </span>
            </li>
        @endforeach
        </ul>
    </div>

    <div class="map-wrapper">
        @if(File::exists(resource_path('views/event/svg/'. $event->code .'-map.blade.php')))
            @include('event/svg/'. $event->code .'-map')
        @endif
    </div>

@stop

@section('footer')
<script type="application/javascript">
var
    jsFooterParams = {
        fetchUrl: "{{ route('stand')  }}",
        imageUrl: "{{ URL::secure_asset('image/stand/') }}",
        reservationUrl: "{{ route('reservation')  }}",
        profileLogoUrl: "{{ \App\User::urlToLogo('$user_dir', '$user_logo') }}",
        adminUrl: "{{ route('admin')  }}",
        charCodeBooked: "{{ $reservedSymbol }}",
        charBooked: "✔",
        eventId: {{ $event->id }},
        stands: {
        <?php
            /**
             * Define the list of stands with respective info.
             */
            $i = 0;
            foreach($stands as $stand){

                echo ($i > 0 ? ',' : '') .
                        $stand->id .": [".
                        // idx 0
                        '"'. $stand->code . ($stand->reserved() ? ' '. $reservedSymbol : '') .'",'.
                        '"'. $stand->price .'",'.
                        $stand->status .','.

                        // idx 3
                        intval($stand->reservation_id) .','.
                        '"'. $stand->company_sname .'",'.

                        '"'. $stand->user_dir_key .'",'.
                        '"'. $stand->user_logo_ext .'",'.
                        '"'. $stand->logo_pos .'"'.

                    ']';

                $i++;

            }
        ?>

        }
    };
</script>
<script src="{{ URL::secure_asset('js/event/index.js?v='. $jsVersion) }}"></script>
@stop