<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $guarded = [];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function marca()
    {
        return $this->belongsTo(MarcaProducto::class, 'marca_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class, 'producto_id');
    }

    public function subproductos()
    {
        return $this->hasMany(SubProducto::class);
    }

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }

    public function getFichaTecnicaAttribute($value)
    {
        return url("storage/" . $value);
    }
}
