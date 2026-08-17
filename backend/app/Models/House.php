<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $fillable = ['name', 'address', 'map_url', 'photo_url', 'description'];

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
