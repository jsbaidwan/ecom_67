<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;
use App\Category;
use Validator;
use Auth;
use App\Http\Resources\Product as ProductResource;

class products_controller extends Controller
{
    public $response = array('success' => 0, 'msg' => array('text' => ''), 'data' => array());

    ######### FUNCTION TO ADD PRODUCT PRODUCT #######
    function add_product(Request $request) {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|max:255',
            'product_description' => 'max:255',
            'category_id' => 'required|numeric',
            'price' => 'required|numeric',
            'pcs' => 'required|numeric|not_in:0',
        ]);
        if ($validator->fails()) {
            $this->response['msg']['text'] = $validator->messages();           
        }
        else {
            $data = $request->all();
            $data['user_id'] = Auth::user()->id;
            if(Product::create($data)) {
                $this->response['msg']['text'] = 'Product has been added successfully.';
                $this->response['success'] = 1;
            } 
            else {
                $this->response['msg']['text'] = 'An error occurred while adding product.';
            }
        }
        return $this->response;
    }

    ######### FUNCTION TO ADD PRODUCT #######
    function products() {
        $user_id = Auth::user()->id;
        $this->response['data'] = Product::where('user_id', $user_id)->orderBy('product_name', 'asc')->get();
        $this->response['success'] = 1;
        return $this->response;
    }

    ######### FUNCTION TO ADD PRODUCT #######
    function update_product_status(Request $request) {
        $validator = Validator::make($request->all(), [
            'status' => 'required|numeric|in:0,1',
            'product_id' => 'required|numeric',
        ]);
        if ($validator->fails()) {
            $this->response['msg']['text'] = $validator->messages();   
        }
        else {
            if($request->status) {
                $request->status = 0;
            }
            else {
                $request->status = 1;
            }
            $user_id = Auth::user()->id;
            if(Product::where('user_id', $user_id)->where('id', $request->product_id)->update(['status' => $request->status])) {
                $this->response['success'] = 1; 
                $this->response['msg']['text'] = 'Product status has been updated successfully.';   
            }
            else {
                $this->response['msg']['text'] = 'An error occured while updating product status.';
            }    
        }
        return $this->response;
    }

    ######### FUNCTION TO ADD PRODUCT #######
    function get_product(Request $request, $product_id) {
        $data['product_id'] = $product_id;
        $validator = Validator::make($data, [
            'product_id' => 'required|numeric',
        ]);
        if ($validator->fails()) {
            $this->response['msg']['text'] = $validator->messages();   
        }
        else {
            $user_id = Auth::user()->id;
            $this->response['data'] = Product::where('user_id', $user_id)->where('id', $product_id)->first();
            $this->response['data']['categories'] = Category::select('id','category_name')->where('user_id', $user_id)->get();
            if(empty($this->response['data'])) {
                $this->response['msg']['text'] = 'Product not found.';
            }
            else {  
                $this->response['success'] = 1;
            }
        }
        return $this->response;
    }

    ######### FUNCTION TO UPDATE PRODUCT #######
    function update_product(Request $request) {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|max:255',
            'product_id' => 'required|numeric',
            'product_description' => 'max:255',
            'category_id' => 'required|numeric',
            'price' => 'required|numeric',
            'pcs' => 'required|numeric',
        ]);
        if ($validator->fails()) {
            $this->response['msg']['text'] = $validator->messages();           
        }
        else {
            $data = $request->all();
            unset($data['product_id']);
            $user_id = Auth::user()->id;
           if(Product::where('user_id', $user_id)->where('id', $request->product_id)->update($data)) {
                $this->response['msg']['text'] = 'Product has been updated successfully.';
                $this->response['success'] = 1;
           } 
           else {
                $this->response['msg']['text'] = 'An error occured while updating product.';
           }
        }
        return $this->response;
    }
}
