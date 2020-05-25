<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'status', 'address', 'city', 'postcode', 'state', 'country', 'comment',
    ];
}
