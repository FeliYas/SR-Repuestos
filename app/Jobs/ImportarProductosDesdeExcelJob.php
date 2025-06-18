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

        $actualizados = 0;

        foreach ($rows as $index => $row) {
            if ($index === 0) continue; // Saltar encabezado

            $codigo = $this->formatearCodigo(trim($row[0]));
            $bitola = trim($row[1]);
            $medida = trim($row[2]);
            $comp = trim($row[3]);
            $carac = trim($row[4]);

            $subproducto = SubProducto::where('code', $codigo)->first();

            if ($subproducto) {
                $subproducto->update([
                    'medida' => $medida,
                    'componente' => $comp,
                    'caracteristicas' => $carac,
                ]);

                $actualizados++;
            }
        }

        Log::info("Importación completada. Subproductos actualizados: $actualizados");
    }

    protected function formatearCodigo($codigo)
    {
        $codigo = str_replace('-', '', $codigo);

        // Si contiene un punto
        if (strpos($codigo, '.') !== false) {
            [$parteEntera, $parteDecimal] = explode('.', $codigo);

            // Agregar un 0 si la parte decimal tiene solo 1 dígito
            if (strlen($parteDecimal) === 1) {
                $parteDecimal = '0' . $parteDecimal;
            }

            return $parteEntera . '.' . $parteDecimal;
        }

        // Si no contiene punto, retornar tal cual sin guiones
        return $codigo;
    }
}
