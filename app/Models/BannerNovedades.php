<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BannerNovedades extends Model
{
    protected $guarded = [];

    public function getBannerAttribute($value)
    {
        return url("storage/" . $value);
    }
}
