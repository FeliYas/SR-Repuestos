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

            $codigo = trim($row[0]);
            $descripcion = trim($row[1]);
            $familia = trim($row[2]);
            $precio_mayorista = trim($row[3]);
            $precio_minorista = trim($row[4]);
            $precio_dist = trim($row[5]);



            $producto = Producto::firstOrCreate(
                ['name' => $familia],
                [
                    'code' => $codigo,
                    //parabolico 1, convensional 2, repuestos 3
                    'categoria_id' => 3
                ]
            );


            SubProducto::updateOrCreate([
                'producto_id' => $producto->id,
                'price_mayorista' => $precio_mayorista,
                'price_minorista' => $precio_minorista,
                'price_dist' => $precio_dist,
                'code' => $codigo,
            ]);
        }

        Log::info("Importación de productos y subproductos desde CSV completada.");
    }
}
