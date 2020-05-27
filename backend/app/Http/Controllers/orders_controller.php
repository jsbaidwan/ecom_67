<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Order;
use Validator;
class orders_controller extends Controller
{
    public $response = array('success' => 0, 'msg' => array('text' => ''), 'data' => array());

    ######### FUNCTION TO GET LIST OF ALL ACTIVE Orders #########
    function get_orders() {
        $response['data'] = Order::with(['customers', 'order_items'])->orderBy('id', 'desc')->get();
        $response['success'] = 1;
        return $response;
    }

    ######### FUNCTION TO GET ORDER DETAILS #########
    function get_order_details(Request $request, $order_id) {
        $response['data'] = Order::with(['customers', 'order_items'])->where('id', $order_id)->first();
        $response['success'] = 1;
        return $response;
    }
}
