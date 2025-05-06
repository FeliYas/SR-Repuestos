<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use Illuminate\Http\Request;

class ContactoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacto = Contacto::first();

        return inertia('admin/contactoAdmin', [
            'contacto' => $contacto,

        ]);
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $contacto = Contacto::first();

        // Check if the Contacto entry exists
        if (!$contacto) {
            return redirect()->back()->with('error', 'Contacto not found.');
        }

        $data = $request->validate([

            'banner' => 'sometimes|file',
            'phone' => 'sometimes|string|max:255',
            'mail' => 'sometimes|email|max:255',
            'location' => 'sometimes|string|max:255',
            'fb' => 'sometimes|string|max:255',
            'ig' => 'sometimes|string|max:255',
            'wp' => 'sometimes|string|max:255',
        ]);

        // Handle file upload if banner exists
        if ($request->hasFile('banner')) {
            // Delete the old banner if it exists
            if ($contacto->banner) {
                $absolutePath = public_path('storage/' . $contacto->banner);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new banner
            $data['banner'] = $request->file('banner')->store('images', 'public');
        }

        $contacto->update($data);

        return redirect()->back()->with('success', 'Contacto updated successfully.');
    }
}
