<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['house_id', 'type', 'name', 'rooms', 'bathrooms', 'base_rent_cost', 'features', 'status'];

    protected $casts = [
        'features' => 'array',
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function tenant()
    {
        return $this->hasOne(Tenant::class)->where('is_active', true);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
