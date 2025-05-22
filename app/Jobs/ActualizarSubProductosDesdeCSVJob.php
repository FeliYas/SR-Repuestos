<?php

namespace App\Jobs;

use App\Models\SubProducto;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ActualizarSubProductosDesdeCSVJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $path;

    public function __construct($path)
    {
        $this->path = $path;
    }

    public function handle()
    {
        $fullPath = storage_path("app/" . $this->path);

        if (!file_exists($fullPath)) {
            Log::error("Archivo no encontrado: {$fullPath}");
            return;
        }

        $file = fopen($fullPath, 'r');
        $header = fgetcsv($file, 0, ','); // Leer cabecera

        while (($row = fgetcsv($file, 0, ',')) !== false) {
            // Asegurarse que la columna del código existe y no está vacía
            if (!isset($row[6]) || trim($row[6]) === '') {
                Log::warning("Fila ignorada por falta de código: " . json_encode($row));
                continue;
            }

            $codigoCsv = $this->limpiarCodigo($row[6]);

            $subProducto = SubProducto::where('code', $codigoCsv)->first();

            if ($subProducto) {
                $subProducto->update([
                    'medida'          => $row[7] ?? null,               // columna H
                    'componente'      => $row[8] ?? null,               // columna I
                    'caracteristicas' => trim(($row[9] ?? '') . ' ' . ($row[10] ?? '')) // columnas J + K
                ]);

                Log::info("SubProducto actualizado: {$codigoCsv}");
            } else {
                Log::warning("No se encontró SubProducto con código: {$codigoCsv}");
            }
        }



        fclose($file);
        Log::info("Actualización de SubProductos finalizada.");
    }

    private function limpiarCodigo($codigo)
    {
        return trim(str_replace(['"', "'"], '', $codigo));
    }
}
