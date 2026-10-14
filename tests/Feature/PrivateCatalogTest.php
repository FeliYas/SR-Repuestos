<?php

use App\Models\Categoria;
use App\Models\MarcaProducto;
use App\Models\Pedido;
use App\Models\PedidoProducto;
use App\Models\Producto;
use App\Models\SubProducto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function privateCatalogFixture(): array
{
    $categoria = Categoria::create(['name' => 'Suspensión', 'image' => 'categorias/suspension.jpg']);
    $marca = MarcaProducto::create(['name' => 'Marca Uno']);
    $producto = Producto::create([
        'name' => 'PERNO DE ELÁSTICO',
        'code' => 'PE-10',
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
    ]);
    $subproducto = SubProducto::create([
        'producto_id' => $producto->id,
        'code' => 'SUB-10',
        'description' => 'Perno reforzado',
        'medida' => '700 X 750',
        'price_mayorista' => 100,
        'price_minorista' => 200,
        'price_dist' => 300,
        'price_lista_4' => 400,
    ]);

    return [$categoria, $marca, $producto, $subproducto];
}

function privateCatalogUser(int $lista): User
{
    return User::factory()->create(['cuit' => '20-12345678-9', 'lista' => $lista]);
}

test('las rutas del catalogo privado requieren autenticacion', function () {
    [$categoria, , $producto] = privateCatalogFixture();

    foreach ([
        route('index.privada.subproductos'),
        route('privada.productos.categoria', $categoria),
        route('privada.productos.show', [$categoria, $producto]),
        route('privada.productos.buscar'),
    ] as $url) {
        $this->get($url)->assertRedirect(route('login'));
    }
});

test('el catalogo privado navega de categorias a productos y conserva filtros', function () {
    [$categoria, $marca, $producto] = privateCatalogFixture();
    $this->actingAs(privateCatalogUser(1));

    $this->get(route('index.privada.subproductos'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('productosVistaPrevia')
            ->where('privateCatalog', true)
            ->where('categorias.0.id', $categoria->id));

    $this->get(route('privada.productos.categoria', [$categoria, 'marca' => $marca->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('productos')
            ->where('privateCatalog', true)
            ->where('productos.data.0.id', $producto->id)
            ->where('marca_id', (string) $marca->id));

    $this->get(route('privada.productos.buscar', [
        'codigo' => 'PERNOS',
        'categoria' => $categoria->id,
        'marca' => $marca->id,
    ]))->assertInertia(fn (Assert $page) => $page
        ->component('productos/productoSearch')
        ->where('privateCatalog', true)
        ->where('productos.data.0.id', $producto->id)
        ->where('filters.codigo', 'PERNOS'));
});

test('el detalle privado envia solo el precio de la lista del cliente', function (int $lista, int $expected) {
    [$categoria, , $producto] = privateCatalogFixture();
    $this->actingAs(privateCatalogUser($lista));

    $this->get(route('privada.productos.show', [$categoria, $producto]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('productos/productoShow')
            ->where('privateCatalog', true)
            ->where('subproductos.0.price', $expected)
            ->missing('subproductos.0.price_mayorista')
            ->missing('subproductos.0.price_minorista')
            ->missing('subproductos.0.price_dist')
            ->missing('subproductos.0.price_lista_4'));
})->with([[1, 100], [2, 200], [3, 300], [4, 400]]);

test('el detalle privado muestra variantes sin precio como consultables', function () {
    [$categoria, , $producto, $subproducto] = privateCatalogFixture();
    $subproducto->update(['price_mayorista' => 0]);
    $this->actingAs(privateCatalogUser(1));

    $this->get(route('privada.productos.show', [$categoria, $producto]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('subproductos.0.price', null)
            ->where('subproductos.0.code', 'SUB-10'));
});

test('mis pedidos permite recomprar usando solo el precio vigente de la lista del cliente', function () {
    [, , , $subproducto] = privateCatalogFixture();
    $user = privateCatalogUser(2);
    $this->actingAs($user);

    $pedido = Pedido::create(['user_id' => $user->id, 'tipo_entrega' => 'retiro cliente']);
    PedidoProducto::create([
        'pedido_id' => $pedido->id,
        'subproducto_id' => $subproducto->id,
        'cantidad' => 2,
        'subtotal_prod' => 100,
    ]);

    $this->get('/privada/mispedidos')
        ->assertInertia(fn (Assert $page) => $page
            ->component('privada/mispedidos')
            ->where('subproductos.0.price', 200)
            ->missing('subproductos.0.price_mayorista')
            ->missing('subproductos.0.price_minorista')
            ->missing('subproductos.0.price_dist')
            ->missing('subproductos.0.price_lista_4'));
});
