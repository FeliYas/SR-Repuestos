<?php

namespace App\Http\Controllers;

use App\Models\Logos;
use Illuminate\Http\Request;

class LogosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $logos = Logos::first();
        return inertia('admin/logos', [
            'logos' => $logos
        ]);
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'logo_principal' => 'sometimes|file',
            'logo_secundario' => 'sometimes|file',
        ]);

        $logos = Logos::first();

        if ($request->hasFile('logo_principal')) {
            $data['logo_principal'] = $request->file('logo_principal')->store('logos', 'public');
        }

        if ($request->hasFile('logo_secundario')) {
            $data['logo_secundario'] = $request->file('logo_secundario')->store('logos', 'public');
        }

        $logos->update($data);

        return redirect()->back()->with('success', 'Logos actualizados correctamente.');
    }
}
