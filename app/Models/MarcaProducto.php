<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarcaProducto extends Model
{
    protected $guarded = [];

    public function getImageAttribute($value)
    {
        if (!$value) {
            return null;
        }

        return url('storage/' . $value);
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'marca_id');
    }
}
