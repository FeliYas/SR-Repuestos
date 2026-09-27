<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SubProducto extends Model
{
    protected $guarded = [];
    protected $appends = ['display_image'];

    public function scopeAlphabetical(Builder $query): Builder
    {
        return $query->orderBy('description')->orderBy('code')->orderBy('id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function getImageAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }

    public function getDisplayImageAttribute(): ?string
    {
        if ($this->image) {
            return $this->image;
        }

        if (! $this->relationLoaded('producto') || ! $this->producto) {
            return null;
        }

        return $this->producto->imagenes->first()?->image;
    }
}
