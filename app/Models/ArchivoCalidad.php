<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ArchivoCalidad extends Model
{
    protected $guarded = [];

    protected $appends = ['archivo_peso', 'archivo_formato'];
    public function getArchivoPesoAttribute()
    {
        if ($this->archivo && Storage::disk('public')->exists($this->archivo)) {
            $sizeInKB = Storage::disk('public')->size($this->archivo) / 1024;

            if ($sizeInKB >= 1024) {
                // Mostrar en MB
                return round($sizeInKB / 1024, 2) . ' MB';
            } else {
                // Mostrar en KB
                return round($sizeInKB, 2) . ' KB';
            }
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
