<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('login', 'LoginController@get_login')->name('login');
Route::post('login', 'LoginController@post_login');

Route::group(['middleware' => 'auth'], function() {
	Route::get('/', 'LoginController@dashboard');
	Route::post('/', 'LoginController@logout');

	Route::post('logs', 'LoginController@logs');
	Route::post('titles', 'TitlesController@index');
	Route::post('titles/create', 'TitlesController@store');
	Route::post('titles/{id}', 'TitlesController@show');
	Route::post('titles/{id}/edit', 'TitlesController@edit');
	Route::post('titles/{id}/update', 'TitlesController@update');
	Route::post('titles/{id}/delete', 'TitlesController@destroy');

	Route::post('users', 'UsersController@index');
	Route::post('users/create', 'UsersController@store');
	Route::post('users/check', 'UsersController@create');
	Route::post('users/validate', 'UsersController@show');
	Route::post('users/{id}', 'UsersController@edit');
	Route::post('users/{id}/update', 'UsersController@update');
	Route::post('users/{id}/delete', 'UsersController@destroy');
});