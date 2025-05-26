<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\ListaDePreciosController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\PedidoProductoController;
use App\Http\Controllers\PrivadaController;
use App\Http\Controllers\SendPedidoController;
use App\Http\Controllers\SubProductoController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::middleware('privada')->group(function () {
        Route::get('privada/productos', [SubProductoController::class, 'indexPrivada'])->name('index.privada.subproductos');
        Route::get('privada/carrito', [PrivadaController::class, 'carrito']);

        Route::get('privada/mispedidos', [PedidoController::class, 'misPedidos']);
        Route::get('privada/listadeprecios', [ListaDePreciosController::class, 'index']);
    });



    Route::post('sendPedido', [SendPedidoController::class, 'sendReactEmail'])
        ->name('sendPedido');

    Route::post('pedido', [PedidoController::class, 'store'])
        ->name('pedido.store');

    Route::post('pedidoProducto', [PedidoProductoController::class, 'store'])
        ->name('pedidoProducto.store');
});
