<?php

namespace App\Jobs;

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
        try {
            $spreadsheet = IOFactory::load(storage_path("app/{$this->path}"));
            $rows = $spreadsheet->getActiveSheet()->toArray();

            $actualizados = 0;

            foreach ($rows as $index => $row) {
                if ($index === 0 || empty(trim($row[0]))) continue; // saltar encabezado o fila vacía

                [$codigo,, $descripcion, $medida, $comp, $carac] = array_map('trim', array_pad($row, 6, ''));

                $subproducto = SubProducto::where('code', $codigo)->first();

                if ($subproducto) {
                    $subproducto->updateQuietly([
                        'medida' => $medida,
                        'componente' => $comp,
                        'caracteristicas' => $carac,
                        'description' => $descripcion,
                    ]);
                    $actualizados++;
                }
            }

            Log::info("Importación completada. Subproductos actualizados: {$actualizados}");
        } catch (\Exception $e) {
            Log::error("Error al importar productos: " . $e->getMessage());
        }
    }
}
