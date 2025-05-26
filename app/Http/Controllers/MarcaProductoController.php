<?php

namespace App\Http\Controllers;

use App\Models\MarcaProducto;
use Illuminate\Http\Request;

class MarcaProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $marcas = MarcaProducto::orderBy('order', 'asc')->get();

        return inertia('admin/marcasProductoAdmin', ['marcas' => $marcas]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'name' => 'required|string|max:255',

        ]);



        MarcaProducto::create($data);

        return redirect()->back()->with('success', 'Marca created successfully.');
    }





    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $marcaProducto = MarcaProducto::findOrFail($request->id);

        // Check if the MarcaProducto entry exists
        if (!$marcaProducto) {
            return redirect()->back()->with('error', 'MarcaProducto not found.');
        }

        // Validate the request data
        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'name' => 'required|string|max:255',
        ]);

        $marcaProducto->update($data);

        return redirect()->back()->with('success', 'Marca updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $marcaProducto = MarcaProducto::findOrFail($request->id);

        // Check if the MarcaProducto entry exists
        if (!$marcaProducto) {
            return redirect()->back()->with('error', 'MarcaProducto not found.');
        }

        $marcaProducto->delete();

        return redirect()->back()->with('success', 'Marca deleted successfully.');
    }
}
