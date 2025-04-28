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

Route::middleware(['shareDefaultLayoutData'])->group(function () {
    Route::get('/', function () {
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
        ]);
    })->name('home');

    Route::get('/nosotros', function () {
        $bannerPortada = BannerPortada::first();
        $nosotros = Nosotros::first();
        $valores = Valores::first();

        return Inertia::render('nosotros', [
            'bannerPortada' => $bannerPortada,
            'nosotros' => $nosotros,
            'valores' => $valores,
        ]);
    })->name('nosotros');

    Route::get('/calidad', function () {
        $calidad = Calidad::first();
        $archivos = ArchivoCalidad::orderBy('order', 'asc')->get();


        return Inertia::render('calidad', [
            'calidad' => $calidad,
            'archivos' => $archivos,

        ]);
    })->name('calidad');

    Route::get('/novedades', function () {
        $bannerNovedades = BannerNovedades::first();
        $novedades = Novedades::orderBy('order', 'asc')->get();

        return Inertia::render('novedades', [
            'novedades' => $novedades,
            'bannerNovedades' => $bannerNovedades,

        ]);
    })->name('novedades');

    Route::get('/novedades/{id}', function ($id) {
        $novedad = Novedades::where('id', $id)->first();

        return Inertia::render('novedadesShow', [
            'novedad' => $novedad,
        ]);
    })->name('novedades');



    Route::get('/contacto', function () {

        return Inertia::render('contacto');
    })->name('contacto');
    Route::get('/productos', [ProductoController::class, 'indexVistaPrevia'])->name('/productos');
    Route::get('/productos/{id}', [ProductoController::class, 'indexInicio'])->name('/productos');
    Route::get('/productos/{categoria_id}/{producto_id}', [ProductoController::class, 'show'])->name('/productoss');
    Route::get('/busqueda', [ProductoController::class, 'SearchProducts'])->name('searchproducts');
});




// routes/web.php



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render(component: 'dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin_auth.php';
