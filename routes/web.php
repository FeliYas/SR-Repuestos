<?php

use App\Http\Controllers\ProductoController;
use App\Models\ArchivoCalidad;
use App\Models\BannerNovedades;
use App\Models\BannerPortada;
use App\Models\Calidad;
use App\Models\Categoria;
use App\Models\Contacto;
use App\Models\Instagram;
use App\Models\Marca;
use App\Models\Nosotros;
use App\Models\Novedades;
use App\Models\Producto;
use App\Models\Valores;
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
    $valores = Valores::first();

    return Inertia::render('nosotros', [
        'bannerPortada' => $bannerPortada,
        'contacto' => $contacto,
        'nosotros' => $nosotros,
        'valores' => $valores,
    ]);
})->name('nosotros');

Route::get('/calidad', function () {
    $contacto = Contacto::first();
    $calidad = Calidad::first();
    $archivos = ArchivoCalidad::orderBy('order', 'asc')->get();


    return Inertia::render('calidad', [
        'contacto' => $contacto,
        'calidad' => $calidad,
        'archivos' => $archivos,

    ]);
})->name('calidad');

Route::get('/novedades', function () {
    $contacto = Contacto::first();
    $bannerNovedades = BannerNovedades::first();
    $novedades = Novedades::orderBy('order', 'asc')->get();

    return Inertia::render('novedades', [
        'contacto' => $contacto,
        'novedades' => $novedades,
        'bannerNovedades' => $bannerNovedades,

    ]);
})->name('novedades');



Route::get('/contacto', function () {
    $contacto = Contacto::first();

    return Inertia::render('contacto', [
        'contacto' => $contacto,
    ]);
})->name('contacto');

// routes/web.php
Route::get('/productos', [ProductoController::class, 'indexInicio'])->name('/productos');
Route::get('/productos/{id}', [ProductoController::class, 'show'])->name('/productos');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render(component: 'dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin_auth.php';
