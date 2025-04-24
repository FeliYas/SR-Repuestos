<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArchivoCalidad extends Model
{
    protected $guarded = [];

    public function getArchivoAttribute($value)
    {
        return url("storage/" . $value);
    }

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }
}
