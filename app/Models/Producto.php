<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $guarded = [];

    public function categorias()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function marcas()
    {
        return $this->belongsTo(Marca::class);
    }
    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class);
    }
}
