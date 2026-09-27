<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Novedades extends Model
{
    protected $guarded = [];

    public function scopeNewestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }

    public function getImageAttribute($value)
    {
        return url("storage/" . $value);
    }
}
