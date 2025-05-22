<?php

namespace App\Console\Commands;

use App\Jobs\ActualizarSubProductosDesdeCSVJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ImportarSubProductosCsv extends Command
{
    protected $signature = 'subproductos:importar {archivo}';
    protected $description = 'Importar  subproductos desde un archivo Excel';

    public function handle()
    {
        $archivo = $this->argument('archivo'); // ejemplo: files/parabolico.xlsx

        // Buscar en disco 'public' (storage/app/public)
        if (!Storage::disk('public')->exists($archivo)) {
            $this->error("El archivo '{$archivo}' no se encuentra en storage/app/public");
            return 1;
        }

        // Despachar usando path relativo a storage/app
        $rutaCompleta = 'public/' . $archivo;

        ActualizarSubProductosDesdeCSVJob::dispatch($rutaCompleta);

        $this->info("Importación iniciada con éxito para el archivo: {$rutaCompleta}");
        return 0;
    }
}
