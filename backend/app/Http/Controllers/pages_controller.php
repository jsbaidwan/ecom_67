<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;
use App\Category;
use App\Customer;
use Validator;
class pages_controller extends Controller
{
    public $response = array('success' => 0, 'msg' => array('text' => ''), 'data' => array());

    ######### FUNCTION TO HET LIST OF ALL ACTIVE PRODUCTS #########
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
            'email' => 'required|email|max:255',
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
                foreach($products as $product) {
                    if($items_arr[$product->id] > $product->pcs) {
                        $this->response['msg']['text'] = $product->product_name." quantity is exceeded than available stock. Please regenrate your order and add items again to the cart.";
                        return $this->response;
                    }
                    else {
                        $save_arr[$product->id] = $product->pcs-$items_arr[$product->id];
                    }
                }
                foreach($save_arr as $product_id => $pcs) {
                    Product::where('id', $product_id)->update(['pcs' => $pcs]);
                }
                $customer_data = $request->except(['purchased_items']);
                Customer::create($customer_data);
                $this->response['msg']['text'] = "Order has been confirmed and placed successfully";
                $this->response['success'] = 1;
            }
        }
        return $this->response;
    }
}
