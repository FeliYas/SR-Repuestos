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
        $subproductos = SubProducto::whereIn('id', $subproductoIds)
            ->with(['producto' => function ($query) {
                $query->select('id', 'name', 'marca_id')->with('marca');
            }])
            ->get();

        return inertia('privada/mispedidos', [
            'pedidos' => $pedidos,
            'subproductos' => $subproductos,
        ]);
    }

    public function misPedidosAdmin(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $query = Pedido::query()->with(['productos', 'user'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('id',  $searchTerm);
        }

        $subProductos = SubProducto::with(['producto' => function ($query) {
            $query->select('id', 'name', 'marca_id')->with('marca');
        }])
            ->get();;

        $pedidos = $query->paginate($perPage);
        return inertia('admin/pedidosAdmin', [
            'pedidos' => $pedidos,
            'subProductos' => $subProductos,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $pedido = Pedido::find($request->id);

        if (!$pedido) {
            return redirect()->back()->with('error', 'Pedido not found.');
        }

        // Toggle the current value of entregado
        $pedido->entregado = !$pedido->entregado;
        $pedido->save();

        return redirect()->back()->with('success', 'Pedido updated successfully.');
    }
}
