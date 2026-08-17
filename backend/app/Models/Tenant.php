<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use SoftDeletes;

    protected $fillable = ['unit_id', 'full_name', 'phone', 'email', 'start_date', 'end_date', 'is_active', 'payment_due_day'];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
