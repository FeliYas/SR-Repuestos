<?php

namespace App\Http\Controllers;

use App\Models\BannerNovedades;
use Illuminate\Http\Request;

class BannerNovedadesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bannerNovedades = BannerNovedades::first();
        return inertia('admin/bannerNovedadesAdmin', [
            'bannerNovedades' => $bannerNovedades,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        $bannerNovedades = BannerNovedades::first();


        $data = $request->validate([
            'banner' => 'sometimes|file',
        ]);

        // Handle file upload if banner exists
        if ($request->hasFile('banner')) {
            // Delete the old banner if it exists
            if ($bannerNovedades->banner) {
                $absolutePath = public_path('storage/' . $bannerNovedades->banner);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new banner
            $data['banner'] = $request->file('banner')->store('images', 'public');
        }



        $bannerNovedades->update($data);

        return redirect()->back()->with('success', 'Banner Novedades updated successfully.');
    }
}
