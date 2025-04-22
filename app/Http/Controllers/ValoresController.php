<?php

namespace App\Http\Controllers;

use App\Models\Valores;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ValoresController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $valores = Valores::first();
        return Inertia::render('admin/valores', [
            'valores' => $valores,
        ]);
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'first_title' => 'required|string|max:255',
            'second_title' => 'required|string|max:255',
            'third_title' => 'required|string|max:255',
            'first_text' => 'required|string',
            'second_text' => 'required|string',
            'third_text' => 'required|string',
        ]);

        $valores = Valores::first();
        $valores->update($data);

        return redirect()->back()->with('success', 'Valores updated successfully.');
    }
}
