<?php

namespace App\Http\Controllers;

use App\Models\Novedades;
use Illuminate\Http\Request;

class NovedadesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $perPage = $request->input('per_page', 10);

        $query = Novedades::query()->orderBy('order', 'asc');

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', '%' . $searchTerm . '%');
        }

        $novedades = $query->paginate($perPage);


        return inertia('admin/novedadesAdmin', [
            'novedades' => $novedades,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'image' => 'required|file',
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'text' => 'required|string|max:255',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        Novedades::create($data);

        return redirect()->back()->with('success', 'Novedad created successfully.');
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $novedad = Novedades::findOrFail($request->id);

        // Check if the Novedad entry exists
        if (!$novedad) {
            return redirect()->back()->with('error', 'Novedad not found.');
        }

        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'image' => 'sometimes|file',
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:255',
            'text' => 'sometimes|string|max:255',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($novedad->image) {
                $absolutePath = public_path('storage/' . $novedad->image);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new image
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        $novedad->update($data);

        return redirect()->back()->with('success', 'Novedad updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $novedad = Novedades::findOrFail($request->id);

        // Check if the Novedad entry exists
        if (!$novedad) {
            return redirect()->back()->with('error', 'Novedad not found.');
        }

        // Delete the image if it exists
        if ($novedad->image) {
            $absolutePath = public_path('storage/' . $novedad->image);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        $novedad->delete();

        return redirect()->back()->with('success', 'Novedad deleted successfully.');
    }
}
