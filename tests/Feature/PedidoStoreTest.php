<?php

use App\Models\Pedido;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test("pedido store forces iibb to zero and recalculates total", function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post("/pedido", [
        "user_id" => $user->id,
        "tipo_entrega" => "retiro cliente",
        "mensaje" => "Test",
        "subtotal" => 1000,
        "iva" => 210,
        "iibb" => 30,
        "total" => 1240,
    ]);

    $pedido = Pedido::firstOrFail();

    expect((float) $pedido->iibb)->toBe(0.0);
    expect((float) $pedido->total)->toBe(1210.0);

    $response->assertSessionHas("pedido_id", $pedido->id);
});
