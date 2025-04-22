<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = Producto::with(['categorias:id,name', 'marcas:id,name', 'imagenes'])->get();
        return Inertia::render('admin/productosAdmin', [
            'productos' => $productos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'nullable|string|max:255',
            'code' => 'required|string|max:255',
            'categoria_id' => 'required|exists:categorias,id',
            'marca_id' => 'required|exists:marcas,id',
            'ficha_tecnica' => 'nullable|file',
            'aplicacion' => 'nullable|string|max:255',
            'anios' => 'nullable|string|max:255',
            'num_original' => 'nullable|string|max:255',
            'tonelaje' => 'nullable|string|max:255',
            'espigon' => 'nullable|string|max:255',
            'bujes' => 'nullable|string|max:255',


        ]);

        // Handle file upload
        if ($request->hasFile('ficha_tecnica')) {
            $imagePath = $request->file('ficha_tecnica')->store('images', 'public');
            $data['ficha_tecnica'] = $imagePath;
        }

        Producto::create($data);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $producto = Producto::findOrFail($request->id);

        // Check if the product entry exists
        if (!$producto) {
            return redirect()->back()->with('error', 'Producto no encontrado.');
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'order' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:255',
            'categoria_id' => 'sometimes|exists:categorias,id',
            'marca_id' => 'sometimes|exists:marcas,id',
            'ficha_tecnica' => 'sometimes|file',
            'aplicacion' => 'sometimes|string|max:255',
            'anios' => 'sometimes|string|max:255',
            'num_original' => 'sometimes|string|max:255',
            'tonelaje' => 'sometimes|string|max:255',
            'espigon' => 'sometimes|string|max:255',
            'bujes' => 'sometimes|string|max:255',
        ]);

        // Handle file upload
        if ($request->hasFile('ficha_tecnica')) {
            // Delete the old image if it exists
            if ($producto->ficha_tecnica) {
                $absolutePath = public_path('storage/' . $producto->ficha_tecnica);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new image
            $data['ficha_tecnica'] = $request->file('ficha_tecnica')->store('images', 'public');
        }

        $producto->update($data);

        return redirect()->back()->with('success', 'Producto actualizado correctamente.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $producto = Producto::findOrFail($request->id);

        // Check if the product entry exists
        if (!$producto) {
            return redirect()->back()->with('error', 'Producto no encontrado.');
        }

        // Delete the image if it exists
        if ($producto->ficha_tecnica) {
            $absolutePath = public_path('storage/' . $producto->ficha_tecnica);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        $producto->delete();

        return redirect()->back()->with('success', 'Producto eliminado correctamente.');
    }
}
