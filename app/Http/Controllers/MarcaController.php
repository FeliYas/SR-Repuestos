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
    public function index()
    {
        $marca = Marca::first();
        if ($marca && $marca->image) {
            $marca->image = url("storage/" . $marca->image);
        }

        return Inertia::render('admin/marca', ['marca' => $marca]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $data = $request->validate([
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

        $marca = Marca::first();
        if (!$marca) {
            return redirect()->back()->with('error', 'No se encontró la marca.');
        }

        $data = $request->validate([
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
    public function destroy(Marca $marca)
    {
        //
    }
}
