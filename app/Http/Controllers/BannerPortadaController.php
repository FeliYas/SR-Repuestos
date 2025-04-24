<?php

namespace App\Http\Controllers;

use App\Models\BannerPortada;
use DragonCode\Support\Facades\Filesystem\File;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerPortadaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banner = BannerPortada::first();

        return Inertia::render('admin/bannerPortadaAdmin', ['banner' => $banner]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        $bannerPortada = BannerPortada::first();
        if (!$bannerPortada) {
            return redirect()->back()->with('error', 'No se encontró el banner de portada.');
        }
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'sometimes|file',
            'image' => 'sometimes|file',
            'logo_banner' => 'sometimes|file',
            'desc' => 'sometimes|string|max:255',
        ]);


        // Handle file upload if video exists
        if ($request->hasFile('video')) {

            if ($bannerPortada->video) {
                $absolutePath = public_path('storage/' . $bannerPortada->video);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            $videoPath = $request->file('video')->store('images', 'public');
            $data['video'] = $videoPath;
        }

        if ($request->hasFile('logo_banner')) {

            if ($bannerPortada->logo_banner) {
                $absolutePath = public_path('storage/' . $bannerPortada->logo_banner);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            $videoPath = $request->file('logo_banner')->store('images', 'public');
            $data['logo_banner'] = $videoPath;
        }

        if ($request->hasFile('image')) {

            if ($bannerPortada->image) {
                $absolutePath = public_path('storage/' . $bannerPortada->image);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            $videoPath = $request->file('image')->store('images', 'public');
            $data['image'] = $videoPath;
        }

        // Save the changes
        $bannerPortada->update($data);

        // Return a response (for API) or redirect
        return redirect()->back()->with('success', 'Banner actualizado correctamente');
    }
}
