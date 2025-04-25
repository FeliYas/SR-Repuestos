<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Localidad extends Model
{
    protected $guard = [];

    public function provincias()
    {
        return $this->belongsTo(Provincia::class);
    }
}
