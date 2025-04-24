<?php

namespace App\Http\Controllers;

use App\Models\Instagram;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstagramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $instagrams = Instagram::orderBy('order', 'asc')->get();

        return Inertia::render('admin/instagramAdmin', ['publicaciones' => $instagrams]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'image' => 'required|file',
            'link' => 'required|string|max:255',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        Instagram::create($data);

        return redirect()->back()->with('success', 'Instagram created successfully.');
    }





    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $instagram = Instagram::findOrFail($request->id);

        // Check if the Instagram entry exists
        if (!$instagram) {
            return redirect()->back()->with('error', 'Instagram not found.');
        }

        // Validate the request data
        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'image' => 'sometimes|file',
            'link' => 'sometimes|string|max:255',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($instagram->image) {
                $absolutePath = public_path('storage/' . $instagram->image);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        $instagram->update($data);

        return redirect()->back()->with('success', 'Instagram updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $instagram = Instagram::findOrFail($request->id);

        // Check if the Instagram entry exists
        if (!$instagram) {
            return redirect()->back()->with('error', 'Instagram not found.');
        }
        // Delete the image if it exists
        if ($instagram->image) {
            $absolutePath = public_path('storage/' . $instagram->image);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        $instagram->delete();

        return redirect()->back()->with('success', 'Instagram deleted successfully.');
    }
}
