<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NovedadPrivada extends Model
{
    protected $table = 'novedades_privadas';

    protected $guarded = [];

    public function getImageAttribute($value)
    {
        return $value ? url('storage/' . $value) : null;
    }
}
