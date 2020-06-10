<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

######## USER ###########
Route::post('login', 'users_controller@login');
Route::post('register', 'users_controller@register')->middleware('auth:api');
Route::post('save_profile', 'users_controller@save_profile')->middleware('auth:api');
Route::post('change_password', 'users_controller@change_password')->middleware('auth:api');
//Route::get('get_profile_details', 'users_controller@get_profile_details')->middleware('auth:api');
Route::middleware('auth:api')->get('/user', function (Request $request) {
    $request->user()->success = 1;
    $request->user()->msg = "";
    return $request->user();
});



####### FORGET PASSWORD ###########
Route::post('forget_password', 'forget_password_controller@forget_password');
Route::post('reset/password', 'users_controller@callResetPassword');


######## Category ###########
Route::post('add_category', 'categories_controller@add_category')->middleware('auth:api');
Route::get('categories', 'categories_controller@categories')->middleware('auth:api');
Route::post('update_category_status', 'categories_controller@update_category_status')->middleware('auth:api');
Route::get('categories/{id}', 'categories_controller@get_category')->middleware('auth:api');
Route::post('update_category', 'categories_controller@update_category')->middleware('auth:api');
Route::get('get_categories', 'categories_controller@get_categories')->middleware('auth:api');

######## Products ###########
Route::post('add_product', 'products_controller@add_product')->middleware('auth:api');
Route::get('products', 'products_controller@products')->middleware('auth:api');
Route::post('update_product_status', 'products_controller@update_product_status')->middleware('auth:api');
Route::get('products/{id}', 'products_controller@get_product')->middleware('auth:api');
Route::post('update_product', 'products_controller@update_product')->middleware('auth:api');

######## Orders ###########
Route::get('get_orders', 'orders_controller@get_orders')->middleware('auth:api');
Route::get('get_order_details/{id}', 'orders_controller@get_order_details')->middleware('auth:api');


######## WEBSITE ROUTES START ###########
Route::get('get_products', 'pages_controller@get_products');
Route::get('get_categories', 'pages_controller@get_categories');
Route::get('get_product/{id}', 'pages_controller@get_product');
Route::post('place_order/', 'pages_controller@place_order');
Route::get('get_cart_products_detail/{id}', 'pages_controller@get_cart_products_detail');
######## WEBSITE ROUTES END ###########

