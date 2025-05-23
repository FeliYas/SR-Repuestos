<?php

namespace App\Jobs;

use App\Models\Producto;
use App\Models\SubProducto;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Log;

class ImportarProductosDesdeExcelJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $path;

    public function __construct($path)
    {
        $this->path = $path;
    }

    public function handle()
    {
        $spreadsheet = IOFactory::load(storage_path("app/" . $this->path));
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        $productos = [];

        foreach ($rows as $index => $row) {
            if ($index === 0) continue; // Saltar encabezado

            [$superCodigo, $codigo, $nombre, $descripcion, $_, $lista1, $lista2, $lista3] = $row;

            if (!$superCodigo || !$codigo) continue;

            // Crear o encontrar el producto
            if (!isset($productos[$superCodigo])) {
                $producto = Producto::where('code', $superCodigo)->first();

                if ($producto) {
                    $producto->update([
                        'name' => $nombre,
                        'categoria_id' => 1, // o usar un valor dinámico si lo querés configurable
                    ]);
                    Log::info("Producto actualizado: {$superCodigo}");
                } else {
                    $producto = Producto::create([
                        'code' => $superCodigo,
                        'name' => $nombre,
                        'categoria_id' => 1,
                    ]);
                    Log::info("Producto creado: {$superCodigo}");
                }

                $productos[$superCodigo] = $producto->id;
            }


            // Crear el subproducto
            $subProducto = SubProducto::where('code', $codigo)->first();

            if ($subProducto) {
                $subProducto->update([
                    'producto_id'     => $productos[$superCodigo],
                    'description'     => $descripcion,
                    'price_mayorista' => $lista1,
                    'price_minorista' => $lista2,
                    'price_dist'      => $lista3,
                ]);
                Log::info("SubProducto actualizado: {$codigo}");
            } else {
                SubProducto::create([
                    'producto_id'     => $productos[$superCodigo],
                    'code'            => $codigo,
                    'description'     => $descripcion,
                    'price_mayorista' => $lista1,
                    'price_minorista' => $lista2,
                    'price_dist'      => $lista3,
                ]);
                Log::info("SubProducto creado: {$codigo}");
            }
        }

        Log::info("Importación completada correctamente.");
    }
}
