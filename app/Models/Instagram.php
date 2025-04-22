<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instagram extends Model
{
    protected $guarded = [];

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }
}
