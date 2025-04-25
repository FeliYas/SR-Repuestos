<?php

// app/Http/Middleware/ShareDefaultLayoutData.php
namespace App\Http\Middleware;

use App\Models\Contacto;
use App\Models\Provincia;
use Closure;
use Inertia\Inertia;

class ShareDefaultLayoutData
{
    public function handle($request, Closure $next)
    {
        Inertia::share([
            'contacto' => fn() => Contacto::first(),
            'provincias' => fn() => Provincia::with('localidades')->orderBy('name', 'asc')->get(),
        ]);

        return $next($request);
    }
}
