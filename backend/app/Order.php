<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_id', 'order_unique_id', 'amount', 'total_amount','tax_amount', 'tax' 
    ];

    public function customers()
    {
        return $this->belongsTo('App\Customer', 'customer_id');
    }

    public function order_items()
    {
        return $this->hasMany('App\OrderItem');
    }
}
