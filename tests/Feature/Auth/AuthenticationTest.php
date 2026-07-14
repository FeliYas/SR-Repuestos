<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test("login screen can be rendered", function () {
    $response = $this->get("/login");

    $response->assertStatus(200);
});

test("users can authenticate using the login screen", function () {
    $user = User::factory()->create([
        "autorizado" => true,
    ]);

    $response = $this->post("/login", [
        "name" => $user->name,
        "password" => "password",
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect("/privada/novedades");
});

test("users can not authenticate with invalid password", function () {
    $user = User::factory()->create([
        "autorizado" => true,
    ]);

    $this->post("/login", [
        "name" => $user->name,
        "password" => "wrong-password",
    ]);

    $this->assertGuest();
});

test("users can logout", function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post("/logout");

    $this->assertGuest();
    $response->assertRedirect("/");
});
