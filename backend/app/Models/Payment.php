<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['unit_id', 'amount', 'payment_date', 'type', 'status', 'notes'];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
