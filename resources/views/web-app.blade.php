<?php
/**
 * Defines the master structure of a page, with head/body/content/footer.
 *
 * @author     hamedmehryar
 */
$cssVersion = '1.0.0';
$jsVersion  = '1.0.0';
?>
<!doctype html>
<html>
<head>
    <title>Virtual Exposition</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @if(Agent::isMobile())
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
    @endif
    <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ URL::secure_asset('css/global.css?v='. $cssVersion) }}">
    @yield('head')
</head>
<body>
    <nav class="navbar navbar-default navbar-@yield('nav-bar-attachment', 'fixed')-top">
        <div class="container-fluid">
            <div class="navbar-header">
                @if(Request::is('/'))
                    <div class="navbar-brand">Virtual Exposition</div>
                @else
                    <a class="navbar-brand" href="/">Virtual Exposition</a>
                @endif
            </div>
            <ul class="nav navbar-nav">
                <li><a class="non-click"><div class="title">@yield('navbar-title')</div></a></li>
            </ul>
            @yield('right-navbar')
        </div>
    </nav>
    <div class="main-wrapper">
        @yield('head-content')
        @yield('content')
    </div>
</body>
<script src="//code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.validation/0.7.1/backbone-validation-min.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="{{ URL::secure_asset('js/global.js?v='. $jsVersion ) }}"></script>
@yield('footer')
</html>
