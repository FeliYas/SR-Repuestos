<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Calidad extends Model
{
    protected $guarded = [];

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }
    public function getBannerAttribute($value)
    {
        return url("storage/" . $value);
    }
}
