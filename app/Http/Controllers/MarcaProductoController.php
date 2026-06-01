<?php

namespace App\Http\Controllers;

use App\Models\MarcaProducto;
use DragonCode\Support\Facades\Filesystem\File;
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
            'image' => 'required|file',

        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }

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
            'image' => 'sometimes|file',
        ]);

        if ($request->hasFile('image')) {
            $rawImagePath = $marcaProducto->getRawOriginal('image');
            $absolutePath = $rawImagePath ? public_path('storage/' . $rawImagePath) : null;
            if ($absolutePath && File::exists($absolutePath)) {
                File::delete($absolutePath);
            }

            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }

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

        $rawImagePath = $marcaProducto->getRawOriginal('image');
        if ($rawImagePath) {
            $absolutePath = public_path('storage/' . $rawImagePath);
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
            }
        }

        $marcaProducto->delete();

        return redirect()->back()->with('success', 'Marca deleted successfully.');
    }
}
