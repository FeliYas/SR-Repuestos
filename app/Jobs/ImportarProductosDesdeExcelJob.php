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

            $modelo = trim($row[0]);
            $aplicacion = trim($row[1]);
            $anio = trim($row[2]);
            $num_original = trim($row[3]);
            $espigon = trim($row[4]);
            $tonelaje = trim($row[5]);
            $codigoFormat = trim($row[6]);

            $codigoFormat = str_replace('"', '', $codigoFormat);
            $codigoFormat = str_replace('-', '', $codigoFormat);
            $codigoFormat = preg_replace('/\..*/', '', $codigoFormat);

            $codigo = trim($row[6]);
            $codigo = str_replace('"', '', $codigo);
            $codigo = str_replace('-', '', $codigo);
            $codigo = str_replace('.', '0', $codigo);
            $medida = trim($row[7]);
            $componente = trim($row[8]);
            $caracteristicas = trim($row[9]) . ' ' . trim($row[10]);


            // Buscar o crear el producto
            $producto = Producto::updateOrCreate(
                ['name' => $modelo],
                [
                    'code' => $codigoFormat,
                    'aplicacion' => $aplicacion,
                    'anio' => $anio,
                    'num_original' => $num_original,
                    'espigon' => $espigon,
                    'tonelaje' => $tonelaje,
                    'categoria_id' => 1
                ]
            );


            SubProducto::updateOrCreate(
                ['code' => $codigo],
                [
                    'producto_id' => $producto->id,
                    'medida' => $medida,
                    'componente' => $componente,
                    'caracteristicas' => $caracteristicas
                ]
            );
        }

        Log::info("Importación de productos y subproductos desde CSV completada.");
    }
}
