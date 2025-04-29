<?php

namespace App\Http\Controllers;

use App\Models\Metadatos;
use Illuminate\Http\Request;

class MetadatosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $metadatos = Metadatos::all();

        return inertia('admin/metadatosAdmin', [
            'metadatos' => $metadatos,
        ]);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $metadatos = Metadatos::findOrFail($request->id);
        // Check if the Metadatos entry exists
        if (!$metadatos) {
            return redirect()->back()->with('error', 'Metadatos not found.');
        }

        $data = $request->validate([
            'title' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string|max:255',
            'keywords' => 'sometimes|nullable|string|max:255',
        ]);


        $metadatos->update($data);

        return redirect()->back()->with('success', 'Metadatos updated successfully.');
    }
}
