<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{
    protected $guarded = [];

    public function productos()
    {
        return $this->belongsTo(Producto::class);
    }

    public function getImageAttribute($value)
    {
        return asset("storage/" . $value);
    }
}
