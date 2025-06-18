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

        foreach ($rows as $index => $row) {
            if ($index === 0) continue; // Saltar encabezado

            $supercodigo = trim($row[0]);
            $codigo = trim($row[1]);
            $name = trim($row[2]);


            $subproducto = SubProducto::where('code', $codigo)->first();

            if ($subproducto) {
                $producto = Producto::firstOrCreate(
                    ['code' => $supercodigo],
                    [
                        'name' => $name,
                        'code' => $supercodigo,
                        //parabolico 1, convensional 2, repuestos 3
                        'categoria_id' => 1
                    ]
                );
            }

            if ($subproducto) {
                $subproducto->update(
                    [
                        'producto_id' => $producto->id,
                    ]
                );
            }
        }

        Log::info("Importación de productos y subproductos desde CSV completada.");
    }
}
