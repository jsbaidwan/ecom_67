<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'product_name', 'product_description', 'user_id', 'category_id', 'tax_group_id', 'pcs', 'price',
    ];
}
