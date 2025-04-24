<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use DragonCode\Support\Facades\Filesystem\File;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarcaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $perPage = $request->input('per_page', 10);

        $query = Marca::query()->orderBy('order', 'asc');

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', '%' . $searchTerm . '%');
        }

        $marcas = $query->paginate($perPage);


        return Inertia::render('admin/marcasAdmin', [
            'marcas' => $marcas,
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
            'image' => 'required|file',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }

        Marca::create($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $marca = Marca::findOrFail($request->id);
        if (!$marca) {
            return redirect()->back()->with('error', 'No se encontró la marca.');
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'order' => 'nullable|string|max:255',
            'image' => 'sometimes|file',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            $absolutePath = public_path('storage/' . $marca->image);
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
            }

            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }
        $marca->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $marca = Marca::findOrFail($request->id);
        if (!$marca) {
            return redirect()->back()->with('error', 'No se encontró la marca.');
        }

        // Eliminar la imagen del almacenamiento
        $absolutePath = public_path('storage/' . $marca->image);
        if (File::exists($absolutePath)) {
            File::delete($absolutePath);
        }

        $marca->delete();

        return redirect()->back()->with('success', 'Marca eliminada correctamente.');
    }
}
