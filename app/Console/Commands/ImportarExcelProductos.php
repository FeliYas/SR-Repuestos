<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\ImportarProductosDesdeExcelJob;
use Illuminate\Support\Facades\Storage;

class ImportarExcelProductos extends Command
{
    protected $signature = 'productos:importar {archivo}';
    protected $description = 'Importar productos y subproductos desde un archivo Excel';

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

        ImportarProductosDesdeExcelJob::dispatch($rutaCompleta);

        $this->info("Importación iniciada con éxito para el archivo: {$rutaCompleta}");
        return 0;
    }
}
