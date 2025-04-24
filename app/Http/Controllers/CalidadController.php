<?php

namespace App\Http\Controllers;

use App\Models\Calidad;
use Illuminate\Http\Request;

class CalidadController extends Controller
{

    public function index()
    {
        $calidad = Calidad::first();


        return inertia('admin/calidadAdmin', ['calidad' => $calidad]);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        $calidad = Calidad::first();

        // Check if the Calidad entry exists
        if (!$calidad) {
            return redirect()->back()->with('error', 'Calidad not found.');
        }

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'text' => 'sometimes',
            'image' => 'sometimes|file',
            'banner' => 'sometimes|file',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($calidad->image) {
                $absolutePath = public_path('storage/' . $calidad->image);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new image
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        // Handle file upload if banner exists
        if ($request->hasFile('banner')) {
            // Delete the old banner if it exists
            if ($calidad->banner) {
                $absolutePath = public_path('storage/' . $calidad->banner);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new banner
            $data['banner'] = $request->file('banner')->store('images', 'public');
        }

        $calidad->update($data);

        return redirect()->back()->with('success', 'Calidad updated successfully.');
    }
}
