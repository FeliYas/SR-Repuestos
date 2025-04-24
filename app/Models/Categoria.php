<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $guarded = [];

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }
}
