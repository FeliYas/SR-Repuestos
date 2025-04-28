<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use App\Models\InformacionImportante;
use Illuminate\Http\Request;

class PrivadaController extends Controller
{
    public function carrito()
    {
        $contacto = Contacto::first();
        $informacion = InformacionImportante::first();

        return inertia('privada/carrito', [
            'informacion' => $informacion,
            'contacto' => $contacto,
        ]);
    }

    public function carritoAdmin()
    {

        $informacion = InformacionImportante::first();

        return inertia('admin/carritoAdmin', [
            'informacion' => $informacion,
        ]);
    }
}
