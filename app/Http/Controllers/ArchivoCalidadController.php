<?php

namespace App\Http\Controllers;

use App\Models\ArchivoCalidad;
use Illuminate\Http\Request;

class ArchivoCalidadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $archivos = ArchivoCalidad::all();
        return inertia('admin/archivoCalidadAdmin', [
            'archivos' => $archivos,
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
            'image' => 'nullable|file',
            'archivo' => 'required|file',
        ]);

        // Handle file upload
        if ($request->hasFile('archivo')) {
            $filePath = $request->file('archivo')->store('images', 'public');
            $data['archivo'] = $filePath;
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }

        ArchivoCalidad::create($data);
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $archivoCalidad = ArchivoCalidad::findOrFail($request->id);

        // Check if the ArchivoCalidad entry exists
        if (!$archivoCalidad) {
            return redirect()->back()->with('error', 'ArchivoCalidad not found.');
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'order' => 'sometimes|string|max:255',
            'image' => 'sometimes|file',
            'archivo' => 'sometimes|file',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($archivoCalidad->image) {
                $absolutePath = public_path('storage/' . $archivoCalidad->image);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new image
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        // Handle file upload if archivo exists
        if ($request->hasFile('archivo')) {
            // Delete the old archivo if it exists
            if ($archivoCalidad->archivo) {
                $absolutePath = public_path('storage/' . $archivoCalidad->archivo);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new archivo
            $data['archivo'] = $request->file('archivo')->store('images', 'public');
        }

        $archivoCalidad->update($data);

        return redirect()->back()->with('success', 'Archivo updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $archivoCalidad = ArchivoCalidad::findOrFail($request->id);

        // Check if the ArchivoCalidad entry exists
        if (!$archivoCalidad) {
            return redirect()->back()->with('error', 'ArchivoCalidad not found.');
        }
        // Delete the image if it exists
        if ($archivoCalidad->image) {
            $absolutePath = public_path('storage/' . $archivoCalidad->image);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        // Delete the archivo if it exists
        if ($archivoCalidad->archivo) {
            $absolutePath = public_path('storage/' . $archivoCalidad->archivo);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        $archivoCalidad->delete();

        return redirect()->back()->with('success', 'Archivo deleted successfully.');
    }
}
