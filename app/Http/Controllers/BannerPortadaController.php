<?php

namespace App\Http\Controllers;

use App\Models\BannerPortada;
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
    public function update(Request $request, $id)
    {
        $bannerPortada = BannerPortada::findOrFail($id);
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'video' => 'nullable|file',
        ]);

        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('images', 'public');
            $bannerPortada->video = $videoPath;
        }

        $bannerPortada->update();
    }
}
