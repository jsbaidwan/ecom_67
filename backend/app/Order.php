<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_id','product_id','order_id','quantity','amount','tax'  
    ];
}
