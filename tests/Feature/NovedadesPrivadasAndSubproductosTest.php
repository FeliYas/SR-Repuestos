<?php

use App\Models\Admin;
use App\Models\NovedadPrivada;
use App\Models\Producto;
use App\Models\SubProducto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function actingAsAdmin(): Admin
{
    $admin = Admin::create([
        'name' => 'Administrador de prueba',
        'password' => Hash::make('password'),
    ]);

    test()->actingAs($admin, 'admin');

    return $admin;
}

function subproductosSpreadsheetUpload(array $rows): UploadedFile
{
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->fromArray([
        ['CODIGO SUBPRODUCTO', 'NOMBRE PRODUCTO', 'DESCRIPCION'],
        ...$rows,
    ]);

    $path = tempnam(sys_get_temp_dir(), 'subproductos-');
    (new Xlsx($spreadsheet))->save($path);

    return new UploadedFile($path, 'subproductos.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);
}

test('la importacion masiva guarda las descripciones de subproductos en mayusculas', function () {
    actingAsAdmin();
    $producto = Producto::create(['name' => 'Producto de prueba']);

    $this->post(route('admin.cargamasiva.subproductos.import'), [
        'archivo' => subproductosSpreadsheetUpload([
            ['SP-001', $producto->name, 'válvula de presión'],
        ]),
    ])->assertRedirect();

    expect(SubProducto::where('code', 'SP-001')->value('description'))->toBe('VÁLVULA DE PRESIÓN');
});

test('la importacion masiva actualiza las descripciones existentes en mayusculas', function () {
    actingAsAdmin();
    $producto = Producto::create(['name' => 'Producto de prueba']);
    $subproducto = SubProducto::create([
        'producto_id' => $producto->id,
        'code' => 'SP-001',
        'description' => 'DESCRIPCIÓN ANTERIOR',
    ]);

    $this->post(route('admin.cargamasiva.subproductos.import'), [
        'archivo' => subproductosSpreadsheetUpload([
            ['sp-001', $producto->name, 'descripción actualizada'],
        ]),
    ])->assertRedirect();

    expect($subproducto->refresh()->description)->toBe('DESCRIPCIÓN ACTUALIZADA');
});

test('las novedades privadas se listan por fecha de creacion descendente e ignoran order', function () {
    actingAsAdmin();
    $older = NovedadPrivada::create([
        'order' => 'aaa',
        'image' => 'images/older.jpg',
        'title' => 'Más antigua',
        'type' => 'Tipo',
        'text' => 'Texto',
        'created_at' => now()->subDay(),
        'updated_at' => now()->subDay(),
    ]);
    $newer = NovedadPrivada::create([
        'order' => 'zzz',
        'image' => 'images/newer.jpg',
        'title' => 'Más nueva',
        'type' => 'Tipo',
        'text' => 'Texto',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->withHeader('X-Inertia', 'true')->get(route('admin.novedadesprivadas'));

    $response
        ->assertOk()
        ->assertJsonPath('props.novedadesPrivadas.data.0.id', $newer->id)
        ->assertJsonPath('props.novedadesPrivadas.data.1.id', $older->id);

    expect($response->json('props.novedadesPrivadas.data.0'))->not->toHaveKey('order');
});

test('la creacion de novedades privadas no persiste el campo order enviado por clientes antiguos', function () {
    actingAsAdmin();
    Storage::fake('public');

    $this->post(route('admin.novedadesprivadas.store'), [
        'order' => 'debe ignorarse',
        'image' => UploadedFile::fake()->image('novedad.jpg'),
        'title' => 'Novedad de prueba',
        'type' => 'Tipo',
        'text' => 'Texto',
    ])->assertRedirect();

    expect(NovedadPrivada::firstOrFail()->getRawOriginal('order'))->toBeNull();
});
