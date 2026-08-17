<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = ['house_id', 'unit_id', 'type', 'amount', 'expense_date', 'paid_by_owner', 'notes'];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
