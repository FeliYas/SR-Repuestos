<?php

use App\Models\Admin;
use App\Models\Novedades;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $admin = Admin::create([
        'name' => 'Administrador de novedades',
        'password' => Hash::make('password'),
    ]);

    $this->actingAs($admin, 'admin');
    $this->withoutMiddleware(ValidateCsrfToken::class);
    Storage::fake('public');
});

test('una novedad publica admite texto enriquecido largo al crear y editar', function () {
    $text = '<p>'.str_repeat('Contenido de prueba ', 25).'</p>';

    $this->post(route('admin.novedades.store'), [
        'image' => UploadedFile::fake()->image('novedad.jpg'),
        'title' => 'Novedad extensa',
        'type' => 'Producto',
        'text' => $text,
    ])->assertSessionHasNoErrors();

    $novedad = Novedades::firstOrFail();
    expect($novedad->text)->toBe($text);

    $this->post(route('admin.novedades.update'), [
        'id' => $novedad->id,
        'title' => 'Novedad editada',
        'type' => 'Promoción',
        'text' => $text.' Actualizado',
    ])->assertSessionHasNoErrors();

    expect($novedad->refresh()->text)->toBe($text.' Actualizado');
});

test('ambos formularios explican cuando falta la imagen', function (string $routeName) {
    $this->post(route($routeName), [
        'title' => 'Novedad',
        'type' => 'Producto',
        'text' => 'Texto',
    ])->assertSessionHasErrors(['image' => 'Seleccioná una imagen para la novedad.']);
})->with(['admin.novedades.store', 'admin.novedadesprivadas.store']);

test('ambos formularios rechazan archivos que no son imagen con un mensaje claro', function (string $routeName) {
    $this->post(route($routeName), [
        'image' => UploadedFile::fake()->create('documento.pdf', 5, 'application/pdf'),
        'title' => 'Novedad',
        'type' => 'Producto',
        'text' => 'Texto',
    ])->assertSessionHasErrors(['image' => 'El archivo debe ser una imagen.']);
})->with(['admin.novedades.store', 'admin.novedadesprivadas.store']);

test('ambos formularios indican el limite cuando la imagen es demasiado grande', function (string $routeName) {
    $this->post(route($routeName), [
        'image' => UploadedFile::fake()->image('grande.jpg')->size(2049),
        'title' => 'Novedad',
        'type' => 'Producto',
        'text' => 'Texto',
    ])->assertSessionHasErrors(['image' => 'La imagen no puede superar los 2 MB.']);
})->with(['admin.novedades.store', 'admin.novedadesprivadas.store']);
