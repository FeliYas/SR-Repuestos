<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'cuit' => '20-12345678-9',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertGuest();
    $response->assertRedirect('/');
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'cuit' => '20-12345678-9',
        'autorizado' => false,
        'lista' => 3,
    ]);
});

test('registration cannot grant authorization or choose a price list', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'another@example.com',
        'cuit' => '20-12345678-9',
        'password' => 'password',
        'password_confirmation' => 'password',
        'autorizado' => true,
        'lista' => 1,
    ])->assertRedirect('/');

    $this->assertDatabaseHas('users', [
        'email' => 'another@example.com',
        'autorizado' => false,
        'lista' => 3,
    ]);
});
