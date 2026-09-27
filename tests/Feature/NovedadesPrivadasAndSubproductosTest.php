<?php

use App\Models\Admin;
use App\Models\NovedadPrivada;
use App\Models\Producto;
use App\Models\SubProducto;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
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
    test()->withoutMiddleware(ValidateCsrfToken::class);

    return $admin;
}

function subproductosSpreadsheetUpload(array $rows, array $headers = ['CODIGO SUBPRODUCTO', 'NOMBRE PRODUCTO', 'DESCRIPCION']): UploadedFile
{
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->fromArray([
        $headers,
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

test('la importacion no actualiza precios que solo difieren en ceros decimales', function () {
    actingAsAdmin();
    $producto = Producto::create(['name' => 'Producto de prueba']);

    SubProducto::create([
        'producto_id' => $producto->id,
        'code' => 'PRECIO-001',
        'description' => 'DESCRIPCIÓN',
        'price_mayorista' => '51029.30',
        'order' => 'zzz',
    ]);

    $response = $this->post(route('admin.cargamasiva.subproductos.import'), [
        'archivo' => subproductosSpreadsheetUpload(
            [['PRECIO-001', $producto->name, 'descripción', 51029.3]],
            ['CODIGO SUBPRODUCTO', 'NOMBRE PRODUCTO', 'DESCRIPCION', 'LISTA 1'],
        ),
    ]);

    $response
        ->assertRedirect()
        ->assertSessionHas('mass_upload_subproductos_summary', fn (array $summary) => $summary['updated'] === 0 && $summary['unchanged'] === 1);
});

test('la importacion masiva separa filas sin cambios de filas rechazadas', function () {
    actingAsAdmin();
    $producto = Producto::create(['name' => 'Producto de prueba']);

    SubProducto::create([
        'producto_id' => $producto->id,
        'code' => 'SIN-CAMBIOS',
        'description' => 'DESCRIPCIÓN IGUAL',
        'order' => 'zzz',
    ]);
    SubProducto::create([
        'producto_id' => $producto->id,
        'code' => 'ACTUALIZAR',
        'description' => 'DESCRIPCIÓN ANTERIOR',
    ]);

    $response = $this->post(route('admin.cargamasiva.subproductos.import'), [
        'archivo' => subproductosSpreadsheetUpload([
            ['SIN-CAMBIOS', $producto->name, 'descripción igual'],
            ['ACTUALIZAR', $producto->name, 'descripción nueva'],
            ['NUEVO', $producto->name, 'descripción nueva'],
            ['SIN-PRODUCTO', 'Producto inexistente', 'descripción rechazada'],
        ]),
    ]);

    $response
        ->assertRedirect()
        ->assertSessionHas('mass_upload_subproductos_summary', function (array $summary) {
            return $summary['total_rows'] === 4
                && $summary['created'] === 1
                && $summary['updated'] === 1
                && $summary['unchanged'] === 1
                && $summary['rejected'] === 1
                && str_contains($summary['errors'][0]['motivo'], 'No existe un producto');
        });
});

test('la importacion rechaza productos con nombres duplicados e informa sus ids', function () {
    actingAsAdmin();
    $first = Producto::create(['name' => 'Producto repetido']);
    $second = Producto::create(['name' => 'Producto repetido']);

    $response = $this->post(route('admin.cargamasiva.subproductos.import'), [
        'archivo' => subproductosSpreadsheetUpload([
            ['AMBIGUO-001', 'Producto repetido', 'descripción'],
        ]),
    ]);

    $response
        ->assertRedirect()
        ->assertSessionHas('mass_upload_subproductos_summary', function (array $summary) use ($first, $second) {
            return $summary['rejected'] === 1
                && str_contains($summary['errors'][0]['motivo'], 'Se encontraron 2 productos')
                && str_contains($summary['errors'][0]['motivo'], (string) $first->id)
                && str_contains($summary['errors'][0]['motivo'], (string) $second->id);
        });

    expect(SubProducto::where('code', 'AMBIGUO-001')->exists())->toBeFalse();
});

test('un administrador puede descargar el csv con todos los rechazos de su importacion', function () {
    Storage::fake('local');
    actingAsAdmin();

    $response = $this->post(route('admin.cargamasiva.subproductos.import'), [
        'archivo' => subproductosSpreadsheetUpload([
            ['SIN-PRODUCTO', 'Producto inexistente', 'descripción rechazada'],
        ]),
    ]);

    $summary = session('mass_upload_subproductos_summary');

    $download = $this->get(route('admin.cargamasiva.subproductos.errors.download', $summary['error_report_token']))
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');

    expect($download->streamedContent())
        ->toContain('SIN-PRODUCTO')
        ->toContain('Producto inexistente');
});

test('un administrador no puede descargar el reporte de rechazos de otro administrador', function () {
    Storage::fake('local');
    actingAsAdmin();

    $response = $this->post(route('admin.cargamasiva.subproductos.import'), [
        'archivo' => subproductosSpreadsheetUpload([
            ['SIN-PRODUCTO', 'Producto inexistente', 'descripción rechazada'],
        ]),
    ]);

    $summary = session('mass_upload_subproductos_summary');
    $otherAdmin = Admin::create([
        'name' => 'Otro administrador',
        'password' => Hash::make('password'),
    ]);
    $this->actingAs($otherAdmin, 'admin');

    $this->get(route('admin.cargamasiva.subproductos.errors.download', $summary['error_report_token']))
        ->assertNotFound();
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

    $this->get(route('admin.novedadesprivadas'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/novedadesPrivadasAdmin')
            ->where('novedadesPrivadas.data.0.id', $newer->id)
            ->where('novedadesPrivadas.data.1.id', $older->id)
            ->missing('novedadesPrivadas.data.0.order'));
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
