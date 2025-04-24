<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
    protected $guarded = [];

    public function getBannerAttribute($value)
    {
        return url("storage/" . $value);
    }
}
