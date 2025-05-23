<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ArchivoCalidad extends Model
{
    protected $guarded = [];


    public function getArchivoPesoAttribute()
    {
        if (Storage::exists($this->archivo)) {
            return round(Storage::size($this->archivo) / 1024, 2); // en KB
        }


        return null;
    }

    // Devolver la extensión del archivo (formato)
    public function getArchivoFormatoAttribute()
    {
        return pathinfo($this->archivo, PATHINFO_EXTENSION);
    }

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }

    // Devolver el tamaño del archivo en KB (u otra unidad si querés)

}
