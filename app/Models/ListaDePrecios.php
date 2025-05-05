<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ListaDePrecios extends Model
{
    protected $guarded = [];

    // Si el archivo se guarda como una ruta

    public function getArchivoAttribute($value)
    {
        return url("storage/" . $value);
    }

    public function getFormatoArchivo()
    {
        if (empty($this->archivo)) {
            return null;
        }

        // Obtener la extensión del archivo
        $extension = pathinfo($this->archivo, PATHINFO_EXTENSION);
        return $extension;
    }

    public function getPesoArchivo()
    {
        if (empty($this->archivo)) {
            return null;
        }

        // Verificar si el archivo existe en el almacenamiento
        if (Storage::exists($this->archivo)) {
            // Obtener el tamaño en bytes
            $bytes = Storage::size($this->archivo);

            // Convertir a KB, MB, etc.
            $units = ['B', 'KB', 'MB', 'GB', 'TB'];
            $bytes = max($bytes, 0);
            $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
            $pow = min($pow, count($units) - 1);

            $bytes /= (1 << (10 * $pow));

            return round($bytes, 2) . ' ' . $units[$pow];
        }

        return null;
    }
}
