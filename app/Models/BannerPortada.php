<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BannerPortada extends Model
{
    protected $guarded = [];

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }
    public function getVideoAttribute($value)
    {
        return url("storage/" . $value);
    }
    public function getLogoBannerAttribute($value)
    {
        return url("storage/" . $value);
    }
}
