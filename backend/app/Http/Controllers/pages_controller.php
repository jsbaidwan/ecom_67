<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;
use App\Category;
use App\Customer;
use App\Order;
use App\OrderItem;
use Validator;
class pages_controller extends Controller
{
    public $response = array('success' => 0, 'msg' => array('text' => ''), 'data' => array());

    ######### FUNCTION TO GET LIST OF ALL ACTIVE PRODUCTS #########
    function get_products() {
        $response['data'] = Product::where('status', 1)->get();
        $response['success'] = 1;
        //echo '<pre>';print_r($response);die;
        return $response;
    }

    ######### FUNCTION TO GET LIST OF ALL ACTIVE CATEGORIES #########
    function get_categories() {
        $response['data'] = Category::select('category_name', 'id')->with(['products' => function ($query) {
            $query->where('status', 1);
        },])->where('status', 1)->get();
        $response['success'] = 1;
        //echo '<pre>';print_r($response);die;
        return $response;
    }


    ######### FUNCTION TO GET PRODUCT AND RELATED PRODUCTS #########
    function get_product(Request $request, $product_id) {
        $data['product_id'] = $product_id;
        $validator = Validator::make($data, [
            'product_id' => 'required|numeric',
        ]);
        if ($validator->fails()) {
            $this->response['msg'] = $validator->messages();   
        }
        else {
            $this->response['data']['product'] = Product::where('id', $product_id)->first();
            if(!empty($this->response['data']['product'])) {
                $this->response['data']['related_products'] = Product::where('category_id', $this->response['data']['product']['category_id'])->where('id', '!=', $this->response['data']['product']['id'])->get();
                $this->response['success'] = 1;
            }    
            else {  
                $this->response['msg']['text'] = 'Product not found.';
            }
        }
        return $this->response;
    }

    ######### FUNCTION TO GET PRODUCT AND RELATED PRODUCTS #########
    function place_order(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|regex:/^[a-zA-Z ]+$/|max:255',
            'email' => 'required|email|max:255|unique:customers',
            'phone' => 'required|min:10|numeric',
            'address' => 'required|max:255',
            'city' => 'required|max:255',
            'postcode' => 'required|max:255',
            'state' => 'required|max:255',
            'purchased_items' => 'required|array'
        ]);
        if ($validator->fails()) {
            $this->response['msg'] = $validator->messages();  
            return $this->response; 
        }
        else {
            foreach($request->purchased_items as $purchased_item) {
                $items_validator = Validator::make($purchased_item, [
                    'id' => 'required|numeric',
                    'quantity' => 'required|numeric|not_in:0'
                ]);
                if($items_validator->fails()) {
                    $this->response['msg'] = $items_validator->messages(); 
                    return $this->response;  
                }
                $product_ids_arr[] = $purchased_item['id'];
                $items_arr[$purchased_item['id']] = $purchased_item['quantity'];
            }
            $products = Product::whereIn('id', $product_ids_arr)->where('status', 1)->get();
            if(count($products) != count($request->purchased_items)) {
                $this->response['msg']['text'] = "Products mismatch. Please regenrate your order and add items again to the cart.";
                return $this->response;
            }
            else {
                
                $sub_total = 0;
                $total = 0;
                $tax = 13;
                $tax_amount = 0;
                foreach($products as $product) {
                    if($items_arr[$product->id] > $product->pcs) {
                        $this->response['msg']['text'] = $product->product_name." quantity is exceeded than available stock. Please regenrate your order and add items again to the cart.";
                        return $this->response;
                    }
                    else {
                        $save_arr[$product->id]['pcs'] = $product->pcs-$items_arr[$product->id];
                        $save_arr[$product->id]['quantity'] = $items_arr[$product->id];
                        $save_arr[$product->id]['price'] = $product->price;
                        $save_arr[$product->id]['total_price'] = $product->price*$items_arr[$product->id];
                        $save_arr[$product->id]['product_name'] = $product->product_name;

                        /* CALCULATE AMOUNT*/
                        $sub_total += $product->price*$items_arr[$product->id];
                        $tax_amount = (13/100)*$sub_total;
                        $total = $sub_total+$tax_amount;
                    }
                }
                $customer_data = $request->except(['purchased_items']);
                $saved_customer_data = Customer::create($customer_data);

                
                /* Order Table data */
                $get_max_order_unique_id = Order::max('order_unique_id');
                $set_order_unique_id = 1;
                if(!empty($get_max_order_unique_id)) {
                    $set_order_unique_id = $get_max_order_unique_id+1;
                }
                $order_data['customer_id'] = $saved_customer_data ->id;
                $order_data['order_unique_id'] = $set_order_unique_id;
                $order_data['amount'] = $sub_total;
                $order_data['total_amount'] = $total;
                $order_data['tax'] = $tax;
                $order_data['tax_amount'] = $tax_amount;
                $saved_order_data = Order::create($order_data);


                /* Order Items Table data */
                foreach($save_arr as $product_id => $item_detail) {
                    Product::where('id', $product_id)->update(['pcs' => $item_detail['pcs']]);
                    $order_items['product_id'] = $product_id;
                    $order_items['order_id'] = $saved_order_data->id;
                    $order_items['quantity'] = $item_detail['quantity'];
                    $order_items['unit_price'] = $item_detail['price'];
                    $order_items['total_price'] = $item_detail['total_price'];
                    $order_items['product_name'] = $item_detail['product_name'];
                    $order_items['tax'] = 13;
                    OrderItem::create($order_items);
                }
                $this->response['msg']['text'] = "Order has been confirmed.";
                $this->response['success'] = 1;
            }
        }
        return $this->response;
    }
}
