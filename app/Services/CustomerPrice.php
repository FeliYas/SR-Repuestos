<?php

namespace App\Services;

use App\Models\SubProducto;
use App\Models\User;

class CustomerPrice
{
    private const PRICE_FIELDS = [
        1 => 'price_mayorista',
        2 => 'price_minorista',
        3 => 'price_dist',
        4 => 'price_lista_4',
    ];

    public function for(User $user, SubProducto $subproducto): ?float
    {
        $field = self::PRICE_FIELDS[(int) $user->lista] ?? null;
        $price = $field ? (float) $subproducto->{$field} : 0;

        return $price > 0 ? $price : null;
    }

    public function publicData(User $user, SubProducto $subproducto): array
    {
        return [
            'id' => $subproducto->id,
            'producto_id' => $subproducto->producto_id,
            'code' => $subproducto->code,
            'description' => $subproducto->description,
            'medida' => $subproducto->medida,
            'componente' => $subproducto->componente,
            'caracteristicas' => $subproducto->caracteristicas,
            'image' => $subproducto->image,
            'price' => $this->for($user, $subproducto),
            'producto' => $subproducto->relationLoaded('producto') && $subproducto->producto ? [
                'id' => $subproducto->producto->id,
                'name' => $subproducto->producto->name,
                'marca' => $subproducto->producto->marca ? ['name' => $subproducto->producto->marca->name] : null,
            ] : null,
        ];
    }
}
