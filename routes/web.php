<?php

use App\Models\BannerPortada;
use App\Models\Categoria;
use App\Models\Instagram;
use App\Models\Marca;
use App\Models\Novedades;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $categorias = Categoria::orderBy('order', 'asc')->get();
    $marcas = Marca::orderBy('order', 'asc')->get();
    $instagram = Instagram::orderBy('order', 'asc')->get();
    $bannerPortada = BannerPortada::first();
    $novedades = Novedades::all();
    if ($bannerPortada && $bannerPortada->video) {
        $bannerPortada->video = url("storage/" . $bannerPortada->video);
    }
    if ($bannerPortada && $bannerPortada->image) {
        $bannerPortada->image = url("storage/" . $bannerPortada->image);
    }
    if ($bannerPortada && $bannerPortada->logo_banner) {
        $bannerPortada->logo_banner = url("storage/" . $bannerPortada->logo_banner);
    }

    foreach ($categorias as $item) {
        if ($item->image) {
            $item->image = url('storage/' . $item->image);
        }
    }

    foreach ($marcas as $item) {
        if ($item->image) {
            $item->image = url('storage/' . $item->image);
        }
    }

    foreach ($novedades as $item) {
        if ($item->image) {
            $item->image = url('storage/' . $item->image);
        }
    }

    return Inertia::render('home', [
        'bannerPortada' => $bannerPortada,
        'categorias' => $categorias,
        'marcas' => $marcas,
        'novedades' => $novedades,
        'instagram' => $instagram,
    ]);
})->name('defaultLayout');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render(component: 'dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin_auth.php';
