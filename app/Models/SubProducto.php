<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubProducto extends Model
{
    protected $guarded = [];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function getImageAttribute()
    {
        // Asegurate de que el producto y sus imágenes existan
        if ($this->producto && $this->producto->imagenes && $this->producto->imagenes->first()) {
            return $this->producto->imagenes->first()->image;
        }

        return null; // O una imagen por defecto si querés
    }
}
