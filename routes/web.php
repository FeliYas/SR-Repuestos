<?php

use App\Models\BannerPortada;
use App\Models\Categoria;
use App\Models\Contacto;
use App\Models\Instagram;
use App\Models\Marca;
use App\Models\Nosotros;
use App\Models\Novedades;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $contacto = Contacto::first();
    $categorias = Categoria::orderBy('order', 'asc')->get();
    $marcas = Marca::orderBy('order', 'asc')->get();
    $instagram = Instagram::orderBy('order', 'asc')->get();
    $bannerPortada = BannerPortada::first();
    $novedades = Novedades::all();

    return Inertia::render('home', [
        'bannerPortada' => $bannerPortada,
        'categorias' => $categorias,
        'marcas' => $marcas,
        'novedades' => $novedades,
        'instagram' => $instagram,
        'contacto' => $contacto,
    ]);
})->name('home');

Route::get('/nosotros', function () {
    $contacto = Contacto::first();
    $bannerPortada = BannerPortada::first();
    $nosotros = Nosotros::first();

    return Inertia::render('nosotros', [
        'bannerPortada' => $bannerPortada,
        'contacto' => $contacto,
        'nosotros' => $nosotros,
    ]);
})->name('nosotros');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render(component: 'dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin_auth.php';
