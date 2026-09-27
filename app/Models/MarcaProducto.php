<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class MarcaProducto extends Model
{
    protected $guarded = [];

    public function scopeAlphabetical(Builder $query): Builder
    {
        return $query->orderBy('name')->orderBy('id');
    }

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
