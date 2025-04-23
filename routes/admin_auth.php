<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArchivoCalidadController;
use App\Http\Controllers\BannerNovedadesController;
use App\Http\Controllers\BannerPortadaController;
use App\Http\Controllers\CalidadController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\ImagenProductoController;
use App\Http\Controllers\InstagramController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\NosotrosController;
use App\Http\Controllers\NovedadesController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\SubProductoController;
use App\Http\Controllers\ValoresController;
use App\Models\Calidad;
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
    Route::delete('admin/instagram/destroy', [InstagramController::class, 'destroy'])->name('admin.instagram.destroy');
    Route::get('admin/nosotros', [NosotrosController::class, 'index'])->name('admin.nosotros');
    Route::post('admin/nosotros/update', [NosotrosController::class, 'update'])->name('admin.nosotros.update');
    Route::get('admin/valores', [ValoresController::class, 'index'])->name('admin.valores');
    Route::post('admin/valores', [ValoresController::class, 'update'])->name('admin.valores.update');
    Route::get('admin/categorias', [CategoriaController::class, 'index'])->name('admin.categorias');
    Route::post('admin/categorias', [CategoriaController::class, 'store'])->name('admin.categorias.store');
    Route::post('admin/categorias/update', [CategoriaController::class, 'update'])->name('admin.categorias.update');
    Route::delete('admin/categorias/destroy/{id}', [CategoriaController::class, 'destroy'])->name('admin.categorias.destroy');
    Route::get('admin/marcas', [MarcaController::class, 'index'])->name('admin.marcas');
    Route::post('admin/marcas', [MarcaController::class, 'store'])->name('admin.marcas.store');
    Route::post('admin/marcas/update', [MarcaController::class, 'update'])->name('admin.marcas.update');
    Route::delete('admin/marcas/destroy', [MarcaController::class, 'destroy'])->name('admin.marcas.destroy');
    Route::get('admin/productos', [ProductoController::class, 'index'])->name('admin.productos');
    Route::post('admin/productos', [ProductoController::class, 'store'])->name('admin.productos.store');
    Route::post('admin/productos/update', [ProductoController::class, 'update'])->name('admin.productos.update');
    Route::delete('admin/productos/destroy', [ProductoController::class, 'destroy'])->name('admin.productos.destroy');
    Route::post('admin/productos/imagenes/store', [ImagenProductoController::class, 'store'])->name('admin.imagenes.store');
    Route::post('admin/productos/imagenes/update', [ImagenProductoController::class, 'update'])->name('admin.imagenes.update');
    Route::delete('admin/productos/imagenes/destroy', [ImagenProductoController::class, 'destroy'])->name('admin.imagenes.destroy');

    Route::get('admin/calidad', [CalidadController::class, 'index'])->name('admin.calidad');
    Route::post('admin/calidad', [CalidadController::class, 'update'])->name('admin.calidad.update');

    Route::get('admin/archivos', [ArchivoCalidadController::class, 'index'])->name('admin.archivos');
    Route::post('admin/archivos', [ArchivoCalidadController::class, 'store'])->name('admin.archivos.store');
    Route::post('admin/archivos/update', [ArchivoCalidadController::class, 'update'])->name('admin.archivos.update');
    Route::delete('admin/archivos/destroy', [ArchivoCalidadController::class, 'destroy'])->name('admin.archivos.destroy');

    Route::get('admin/novedades', [NovedadesController::class, 'index'])->name('admin.novedades');
    Route::post('admin/novedades', [NovedadesController::class, 'store'])->name('admin.novedades.store');
    Route::post('admin/novedades/update', [NovedadesController::class, 'update'])->name('admin.novedades.update');
    Route::delete('admin/novedades/destroy', [NovedadesController::class, 'destroy'])->name('admin.novedades.destroy');

    Route::get('admin/bannernovedades', [BannerNovedadesController::class, 'index'])->name('admin.bannernovedades');
    Route::post('admin/bannernovedades', [BannerNovedadesController::class, 'update'])->name('admin.bannernovedades.update');

    Route::get('admin/contacto', [ContactoController::class, 'index'])->name('admin.contacto');
    Route::post('admin/contacto', [ContactoController::class, 'update'])->name('admin.contacto.update');

    Route::get('admin/subproductos', [SubProductoController::class, 'index'])->name('admin.subproductos');
    Route::post('admin/subproductos', [SubProductoController::class, 'store'])->name('admin.subproductos.store');
    Route::post('admin/subproductos/update', [SubProductoController::class, 'update'])->name('admin.subproductos.update');
    Route::delete('admin/subproductos/destroy', [SubProductoController::class, 'destroy'])->name('admin.subproductos.destroy');

    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard'); // Cambia esto a tu página de dashboard
    })->name('admin.dashboard');
});
