<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logos extends Model
{
    protected $guarded = [];

    public function getLogoPrincipalAttribute($value)
    {
        return url("storage/" . $value);
    }
    public function getLogoSecundarioAttribute($value)
    {
        return url("storage/" . $value);
    }
}
