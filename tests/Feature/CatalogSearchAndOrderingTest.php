<?php

use App\Models\Admin;
use App\Models\Categoria;
use App\Models\MarcaProducto;
use App\Models\Novedades;
use App\Models\Producto;
use App\Models\SubProducto;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function catalogAdmin(): Admin
{
    $admin = Admin::create([
        'name' => 'Administrador del catálogo',
        'password' => Hash::make('password'),
    ]);

    test()->actingAs($admin, 'admin');
    test()->withoutMiddleware(ValidateCsrfToken::class);

    return $admin;
}

test('el buscador encuentra productos por plural y por medidas con separadores distintos', function () {
    $categoria = Categoria::create(['name' => 'Suspensión']);
    $marca = MarcaProducto::create(['name' => 'Acme']);
    $perno = Producto::create([
        'name' => 'PERNO DE ELÁSTICO',
        'code' => 'PE-10',
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
    ]);
    $amortiguador = Producto::create([
        'name' => 'AMORTIGUADOR',
        'code' => 'AM-20',
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
    ]);
    SubProducto::create([
        'producto_id' => $amortiguador->id,
        'description' => 'Trasero reforzado',
        'code' => 'SUB-20',
        'medida' => '700 X 750 MM',
    ]);

    $this->get(route('searchproducts', ['codigo' => 'PERNOS']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('productos/productoSearch')
            ->has('productos.data', 1)
            ->where('productos.data.0.id', $perno->id));

    $this->get(route('searchproducts', ['codigo' => '700-750']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('productos/productoSearch')
            ->has('productos.data', 1)
            ->where('productos.data.0.id', $amortiguador->id));

    $this->get(route('searchproducts', ['codigo' => '700x750']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('productos/productoSearch')
            ->has('productos.data', 1)
            ->where('productos.data.0.id', $amortiguador->id));
});

test('el buscador combina filtros conserva su estado y pagina de a doce', function () {
    $categoria = Categoria::create(['name' => 'Filtros']);
    $otraCategoria = Categoria::create(['name' => 'Suspensión']);
    $marca = MarcaProducto::create(['name' => 'Bosch']);
    $otraMarca = MarcaProducto::create(['name' => 'Otra']);

    foreach (range(1, 13) as $number) {
        Producto::create([
            'name' => sprintf('FILTRO %02d', $number),
            'code' => sprintf('F-%02d', $number),
            'categoria_id' => $categoria->id,
            'marca_id' => $marca->id,
        ]);
    }

    Producto::create([
        'name' => 'FILTRO FUERA DE CATEGORÍA',
        'categoria_id' => $otraCategoria->id,
        'marca_id' => $marca->id,
    ]);
    Producto::create([
        'name' => 'FILTRO FUERA DE MARCA',
        'categoria_id' => $categoria->id,
        'marca_id' => $otraMarca->id,
    ]);

    $response = $this->get(route('searchproducts', [
        'categoria' => $categoria->id,
        'marca' => $marca->id,
        'codigo' => 'FILTROS',
    ]));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('productos/productoSearch')
        ->has('productos.data', 12)
        ->where('productos.total', 13)
        ->where('filters.categoria', (string) $categoria->id)
        ->where('filters.marca', (string) $marca->id)
        ->where('filters.codigo', 'FILTROS'));
});

test('los alcances del catalogo ordenan alfabeticamente con desempates estables', function () {
    Categoria::create(['name' => 'Zapata', 'order' => 'aaa']);
    Categoria::create(['name' => 'Amortiguador', 'order' => 'zzz']);
    MarcaProducto::create(['name' => 'Volvo', 'order' => 'aaa']);
    MarcaProducto::create(['name' => 'Bosch', 'order' => 'zzz']);
    Producto::create(['name' => 'Perno', 'code' => 'B', 'order' => 'aaa']);
    Producto::create(['name' => 'Amortiguador', 'code' => 'A', 'order' => 'zzz']);
    SubProducto::create(['description' => 'Tope', 'code' => 'B', 'order' => 'aaa']);
    SubProducto::create(['description' => 'Buje', 'code' => 'A', 'order' => 'zzz']);

    expect(Categoria::alphabetical()->pluck('name')->all())->toBe(['Amortiguador', 'Zapata'])
        ->and(MarcaProducto::alphabetical()->pluck('name')->all())->toBe(['Bosch', 'Volvo'])
        ->and(Producto::alphabetical()->pluck('name')->all())->toBe(['Amortiguador', 'Perno'])
        ->and(SubProducto::alphabetical()->pluck('description')->all())->toBe(['Buje', 'Tope']);
});

test('las novedades publicas se muestran y administran de mas nueva a mas antigua', function () {
    $older = Novedades::create([
        'title' => 'Más antigua',
        'order' => 'aaa',
        'created_at' => now()->subDay(),
        'updated_at' => now()->subDay(),
    ]);
    $newer = Novedades::create([
        'title' => 'Más nueva',
        'order' => 'zzz',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->get('/novedades')
        ->assertInertia(fn (Assert $page) => $page
            ->component('novedades')
            ->where('novedades.0.id', $newer->id)
            ->where('novedades.1.id', $older->id));

    catalogAdmin();

    $this->get(route('admin.novedades'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/novedadesAdmin')
            ->where('novedades.data.0.id', $newer->id)
            ->where('novedades.data.1.id', $older->id));
});

test('los formularios ignoran order y permiten crear entidades sin enviarlo', function () {
    catalogAdmin();
    Storage::fake('public');

    $this->post(route('admin.categorias.store'), [
        'name' => 'Categoría nueva',
        'order' => 'valor legado',
    ])->assertSessionHasNoErrors();

    $this->post(route('admin.marcasProducto.store'), [
        'name' => 'Marca nueva',
        'image' => UploadedFile::fake()->image('marca.jpg'),
    ])->assertSessionHasNoErrors();

    $categoria = Categoria::where('name', 'Categoría nueva')->firstOrFail();
    $marca = MarcaProducto::where('name', 'Marca nueva')->firstOrFail();

    $this->post(route('admin.productos.store'), [
        'name' => 'Producto nuevo',
        'code' => 'PROD-NUEVO',
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'order' => 'valor legado',
    ])->assertSuccessful();

    $producto = Producto::where('code', 'PROD-NUEVO')->firstOrFail();

    $this->post(route('admin.subproductos.store'), [
        'code' => 'SUB-NUEVO',
        'producto_id' => $producto->id,
        'description' => 'Subproducto nuevo',
        'price_mayorista' => 1,
        'price_minorista' => 2,
        'price_dist' => 3,
        'price_lista_4' => 4,
    ])->assertSessionHasNoErrors();

    $this->post(route('admin.novedades.store'), [
        'title' => 'Novedad nueva',
        'type' => 'Institucional',
        'text' => 'Texto de la novedad',
        'image' => UploadedFile::fake()->image('novedad.jpg'),
        'order' => 'valor legado',
    ])->assertSessionHasNoErrors();

    expect($categoria->refresh()->order)->toBe('zzz')
        ->and($marca->refresh()->order)->toBe('zzz')
        ->and($producto->refresh()->order)->toBe('zzz')
        ->and(SubProducto::where('code', 'SUB-NUEVO')->value('order'))->toBe('zzz')
        ->and(Novedades::where('title', 'Novedad nueva')->value('order'))->toBeNull();
});
