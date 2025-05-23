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


            $codigo = trim($row[1]);
            $descripcion = trim($row[3]);
            $precio_mayorista = trim($row[5]);
            $precio_minorista = trim($row[6]);
            $precio_dist = trim($row[7]);


            SubProducto::updateOrCreate(
                ['code' => $codigo],
                [
                    'price_mayorista' => $precio_mayorista,
                    'price_minorista' => $precio_minorista,
                    'price_dist' => $precio_dist,
                    'description' => $descripcion,
                ]
            );
        }

        Log::info("Importación de productos y subproductos desde CSV completada.");
    }
}
