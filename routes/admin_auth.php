<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BannerPortadaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ImagenProductoController;
use App\Http\Controllers\InstagramController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\NosotrosController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ValoresController;
use App\Models\ImagenProducto;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest:admin')->group(function () {

    Route::get('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login');
    Route::post('/admin/login', [AdminAuthController::class, 'authenticate']);
});

Route::middleware('auth:admin')->group(function () {
    Route::post('admin-logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    Route::get('admin/administradores', [AdminController::class, 'index'])->name('admin.index');
    Route::post('admin/store', [AdminController::class, 'store'])->name('admin.store');
    Route::put('admin/update/{id}', [AdminController::class, 'update'])->name('admin.update');
    Route::delete('admin/destroy/{id}', [AdminController::class, 'destroy'])->name('admin.destroy');
    Route::get('admin/bannerportada', [BannerPortadaController::class, 'index'])->name('admin.bannerportada');
    Route::post('admin/bannerportada', [BannerPortadaController::class, 'update'])->name('admin.bannerportada.update');
    Route::get('admin/instagram', [InstagramController::class, 'index'])->name('admin.instagram');
    Route::post('admin/instagram', [InstagramController::class, 'store'])->name('admin.instagram.store');
    Route::post('admin/instagram/update', [InstagramController::class, 'update'])->name('admin.instagram.update');
    Route::get('admin/nosotros', [NosotrosController::class, 'index'])->name('admin.nosotros');
    Route::post('admin/nosotros/update', [NosotrosController::class, 'update'])->name('admin.nosotros.update');
    Route::get('admin/valores', [ValoresController::class, 'index'])->name('admin.valores');
    Route::post('admin/valores', [ValoresController::class, 'update'])->name('admin.valores.update');
    Route::get('admin/categorias', [CategoriaController::class, 'index'])->name('admin.categorias');
    Route::post('admin/categorias', [CategoriaController::class, 'store'])->name('admin.categorias.store');
    Route::post('admin/categorias/update', [CategoriaController::class, 'update'])->name('admin.categorias.update');
    Route::delete('admin/categorias/destroy/{id}', [CategoriaController::class, 'destroy'])->name('admin.categorias.destroy');
    Route::get('admin/marca', [MarcaController::class, 'index'])->name('admin.marca');
    Route::post('admin/marca', [MarcaController::class, 'store'])->name('admin.marca.store');
    Route::post('admin/marca/update', [MarcaController::class, 'update'])->name('admin.marca.update');
    Route::delete('admin/marca/destroy', [MarcaController::class, 'destroy'])->name('admin.marca.destroy');
    Route::get('admin/productos', [ProductoController::class, 'index'])->name('admin.productos');
    Route::post('admin/productos', [ProductoController::class, 'store'])->name('admin.productos.store');
    Route::post('admin/productos/update', [ProductoController::class, 'update'])->name('admin.productos.update');
    Route::delete('admin/productos/destroy', [ProductoController::class, 'destroy'])->name('admin.productos.destroy');
    Route::post('admin/productos/imagenes/store', [ImagenProductoController::class, 'imagenesStore'])->name('admin.imagenes.store');
    Route::post('admin/productos/imagenes/update', [ImagenProductoController::class, 'imagenesUpdate'])->name('admin.imagenes.update');
    Route::delete('admin/productos/imagenes/destroy', [ImagenProductoController::class, 'imagenesDestroy'])->name('admin.imagenes.destroy');

    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard'); // Cambia esto a tu página de dashboard
    })->name('admin.dashboard');
});
