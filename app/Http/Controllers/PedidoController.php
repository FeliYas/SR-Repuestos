<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\SubProducto;
use Illuminate\Http\Request;

class PedidoController extends Controller
{




    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'nullable | exists:users,id',
            'tipo_entrega' => 'nullable | string',
            'mensaje' => 'sometimes | string',
            'archivo' => 'sometimes | file',
            'subtotal' => 'nullable | numeric',
            'iva' => 'nullable | numeric',
            'iibb' => 'nullable | numeric',
            'total' => 'nullable | numeric',
            'entregado' => 'nullable | boolean',
        ]);

        // Guardar la nueva imagen
        if ($request->hasFile('archivo')) {
            $archivoPath = $request->file('archivo')->store('files', 'public');
            $data["archivo"] = $archivoPath;
        }

        $pedido = Pedido::create($data);

        return redirect()->back()->with([
            'pedido_id' => $pedido->id,
            'message' => 'Pedido creado exitosamente'
        ]);
    }

    public function misPedidos()
    {
        $pedidos = Pedido::where('user_id', auth()->user()->id)
            ->with('productos')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get all subproducto_ids from all pedidos
        $subproductoIds = [];
        foreach ($pedidos as $pedido) {
            foreach ($pedido->productos as $producto) {
                if (isset($producto->subproducto_id)) {
                    $subproductoIds[] = $producto->subproducto_id;
                }
            }
        }

        // Get subproductos using the collected ids
        $subproductos = SubProducto::whereIn('id', $subproductoIds)->get();

        return inertia('privada/mispedidos', [
            'pedidos' => $pedidos,
            'subproductos' => $subproductos,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pedido $pedido)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pedido $pedido)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pedido $pedido)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedido $pedido)
    {
        //
    }
}
