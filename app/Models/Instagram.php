<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instagram extends Model
{
    protected $guarded = [];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function getImageAttribute($value)
    {
        if (!$value) {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        return url('storage/' . $value);
    }
}
