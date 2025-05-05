<?php

// app/Http/Middleware/ShareDefaultLayoutData.php
namespace App\Http\Middleware;

use App\Models\Contacto;
use App\Models\Logos;
use App\Models\Provincia;
use Closure;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PrivadaMiddleware
{
    public function handle($request, Closure $next)
    {
        if (!Auth::check()) {
            return redirect('/');  // O la URL que prefieras
        }
        Inertia::share([
            'contacto' => fn() => Contacto::first(),
            'logos' => fn() => Logos::first(),
            'provincias' => fn() => Provincia::with('localidades')->orderBy('name', 'asc')->get(),
        ]);

        return $next($request);
    }
}
