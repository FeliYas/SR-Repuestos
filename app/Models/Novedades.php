<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Novedades extends Model
{
    protected $guarded = [];

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }
}
