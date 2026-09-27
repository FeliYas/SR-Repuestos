<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class ProductSearchService
{
    private const PRODUCT_FIELDS = [
        'name',
        'code',
        'aplicacion',
        'anio',
        'num_original',
        'tonelaje',
        'espigon',
        'bujes',
    ];

    private const SUBPRODUCT_FIELDS = [
        'code',
        'description',
        'medida',
        'componente',
        'caracteristicas',
    ];

    public function apply(Builder $query, ?string $search): Builder
    {
        foreach ($this->tokens($search) as $token) {
            $variants = $this->variants($token);

            $query->where(function (Builder $tokenQuery) use ($variants) {
                foreach ($variants as $variant) {
                    $like = '%'.$variant.'%';

                    foreach (self::PRODUCT_FIELDS as $field) {
                        $tokenQuery->orWhere($field, 'like', $like);
                    }

                    $tokenQuery
                        ->orWhereHas('categoria', fn (Builder $relation) => $relation->where('name', 'like', $like))
                        ->orWhereHas('marca', fn (Builder $relation) => $relation->where('name', 'like', $like))
                        ->orWhereHas('subproductos', function (Builder $relation) use ($like) {
                            $relation->where(function (Builder $fields) use ($like) {
                                foreach (self::SUBPRODUCT_FIELDS as $field) {
                                    $fields->orWhere($field, 'like', $like);
                                }
                            });
                        });
                }
            });
        }

        return $query;
    }

    public function applyToSubproducts(Builder $query, ?string $search): Builder
    {
        foreach ($this->tokens($search) as $token) {
            $variants = $this->variants($token);

            $query->where(function (Builder $tokenQuery) use ($variants) {
                foreach ($variants as $variant) {
                    $like = '%'.$variant.'%';

                    foreach (self::SUBPRODUCT_FIELDS as $field) {
                        $tokenQuery->orWhere($field, 'like', $like);
                    }

                    $tokenQuery->orWhereHas('producto', function (Builder $product) use ($like) {
                        $product->where(function (Builder $matches) use ($like) {
                            $matches->where(function (Builder $fields) use ($like) {
                                foreach (self::PRODUCT_FIELDS as $field) {
                                    $fields->orWhere($field, 'like', $like);
                                }
                            })->orWhereHas('categoria', fn (Builder $relation) => $relation->where('name', 'like', $like))
                                ->orWhereHas('marca', fn (Builder $relation) => $relation->where('name', 'like', $like));
                        });
                    });
                }
            });
        }

        return $query;
    }

    private function tokens(?string $search): array
    {
        $normalized = Str::of((string) $search)
            ->squish()
            ->lower()
            ->replaceMatches('/(?<=\d)x(?=\d)/u', ' ')
            ->replaceMatches('/(?<=\d)(?=\pL)|(?<=\pL)(?=\d)/u', ' ')
            ->replaceMatches('/[^\pL\pN]+/u', ' ')
            ->trim()
            ->toString();

        if ($normalized === '') {
            return [];
        }

        return array_values(array_unique(array_filter(explode(' ', $normalized))));
    }

    private function variants(string $token): array
    {
        $variants = [$token];

        if (mb_strlen($token) > 3 && Str::endsWith($token, 'es')) {
            $variants[] = mb_substr($token, 0, -2);
        }

        if (mb_strlen($token) > 2 && Str::endsWith($token, 's')) {
            $variants[] = mb_substr($token, 0, -1);
        }

        return array_values(array_unique(array_filter($variants)));
    }
}
