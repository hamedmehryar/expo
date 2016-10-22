<?php
/**
 * Start the definition of routes.
 *
 * @author     hamedmehryar
 */

Route::get('/', function () {
    return view('welcome');
});
Route::group(['middlewareGroups' => ['web']], function () {

    Route::get('/', 'HomeController@index');

    Route::get('event/stand', ['as' => 'stand', 'uses' => 'StandController@fetch']);

    Route::match(['get', 'post'], 'event/admin/', ['as' => 'admin', 'uses' =>'ReservationController@emailReport']);

    Route::match(['get', 'post'], 'event/reservation', ['as' => 'reservation', 'uses' =>'ReservationController@reservation']);


    Route::get('event/{code}', ['as' => 'hall-map', 'uses' =>'EventController@index']);

    Route::get('event', 'HomeController@index');

});