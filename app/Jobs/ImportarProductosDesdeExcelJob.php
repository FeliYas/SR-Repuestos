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
                $producto = Producto::firstOrCreate(
                    ['code' => $superCodigo],
                    [
                        'name' => $nombre,
                        'categoria_id' => 1
                    ]

                );
                $productos[$superCodigo] = $producto->id;
            }

            // Crear el subproducto
            SubProducto::create([
                'producto_id'     => $productos[$superCodigo],
                'code'            => $codigo,
                'description' => $descripcion,
                'price_mayorista' => floatval(str_replace(',', '.', str_replace('.', '', $lista1))),
                'price_minorista' => floatval(str_replace(',', '.', str_replace('.', '', $lista2))),
                'price_dist'      => floatval(str_replace(',', '.', str_replace('.', '', $lista3))),
            ]);
        }

        Log::info("Importación completada correctamente.");
    }
}
