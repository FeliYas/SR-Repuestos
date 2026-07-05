<?php

namespace App\Http\Controllers;

use App\Models\NovedadPrivada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NovedadesPrivadasController extends Controller
{
    public function indexAdmin(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $query = NovedadPrivada::query()->orderBy('order', 'asc');

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('title', 'LIKE', '%' . $searchTerm . '%');
        }

        $novedadesPrivadas = $query->paginate($perPage);

        return inertia('admin/novedadesPrivadasAdmin', [
            'novedadesPrivadas' => $novedadesPrivadas,
        ]);
    }

    public function indexPrivada()
    {
        $novedadesPrivadas = NovedadPrivada::orderBy('order', 'asc')->get();

        return inertia('privada/novedades', [
            'novedadesPrivadas' => $novedadesPrivadas,
        ]);
    }

    public function showPrivada($id)
    {
        $novedadPrivada = NovedadPrivada::findOrFail($id);

        return inertia('privada/novedadesShow', [
            'novedadPrivada' => $novedadPrivada,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'image' => 'required|file',
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'text' => 'required|string',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        NovedadPrivada::create($data);

        return redirect()->back()->with('success', 'Novedad privada creada correctamente.');
    }

    public function update(Request $request)
    {
        $novedadPrivada = NovedadPrivada::findOrFail($request->id);

        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'image' => 'sometimes|file',
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:255',
            'text' => 'sometimes|string',
        ]);

        if ($request->hasFile('image')) {
            $currentImage = $novedadPrivada->getRawOriginal('image');

            if ($currentImage) {
                Storage::disk('public')->delete($currentImage);
            }

            $data['image'] = $request->file('image')->store('images', 'public');
        }

        $novedadPrivada->update($data);

        return redirect()->back()->with('success', 'Novedad privada actualizada correctamente.');
    }

    public function destroy(Request $request)
    {
        $novedadPrivada = NovedadPrivada::findOrFail($request->id);
        $currentImage = $novedadPrivada->getRawOriginal('image');

        if ($currentImage) {
            Storage::disk('public')->delete($currentImage);
        }

        $novedadPrivada->delete();

        return redirect()->back()->with('success', 'Novedad privada eliminada correctamente.');
    }
}
