<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provincia extends Model
{
    protected $guard = [];


    public function localidades()
    {
        return $this->hasMany(Localidad::class);
    }
}
