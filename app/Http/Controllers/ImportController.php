<?php

namespace App\Http\Controllers;

use App\Jobs\ActualizarPreciosJob;
use Illuminate\Http\Request;

class ImportController extends Controller
{
    public function importar(Request $request)
    {
        $request->validate([
            'archivo' => 'required|mimes:xlsx,xls'
        ]);
        // Guardar archivo en almacenamiento temporal
        $archivoPath = $request->file('archivo')->store('importaciones');

        // Encolar el Job
        ActualizarPreciosJob::dispatch($archivoPath);
    }
}
