<?php

namespace App\Http\Controllers;

use App\Models\ImagenProducto;
use App\Models\Producto;
use App\Models\SubProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ImagenProductoController extends Controller
{
    public function cargaMasivaImagenes()
    {
        return Inertia::render('admin/cargaMasivaImagenes');
    }

    public function importarMasivoImagenes(Request $request)
    {
        $validated = $request->validate([
            'target' => 'required|in:productos,subproductos',
            'archivos' => 'required|array|min:1',
            'archivos.*' => 'required|file|max:10240',
        ]);

        $target = $validated['target'];
        $files = $request->file('archivos', []);

        $summary = [
            'target' => $target,
            'total_files' => count($files),
            'created' => 0,
            'updated' => 0,
            'omitted' => 0,
            'errors' => [],
        ];

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif', 'svg'];

        $invalidFiles = [];
        foreach ($files as $file) {
            $extension = Str::lower($file->getClientOriginalExtension());
            if (!in_array($extension, $allowedExtensions, true)) {
                $invalidFiles[] = $file->getClientOriginalName();
            }
        }

        if (!empty($invalidFiles)) {
            $summary['omitted'] = $summary['total_files'];
            $summary['errors'][] = [
                'file' => null,
                'code' => null,
                'motivo' => 'La carpeta contiene archivos no válidos. Solo se aceptan extensiones de imagen: ' . implode(', ', $allowedExtensions),
            ];

            foreach ($invalidFiles as $invalidFileName) {
                $summary['errors'][] = [
                    'file' => $invalidFileName,
                    'code' => pathinfo($invalidFileName, PATHINFO_FILENAME) ?: null,
                    'motivo' => 'Extensión no permitida.',
                ];
            }

            return redirect()->back()->with('mass_upload_images_summary', $summary);
        }

        foreach ($files as $file) {
            $originalName = $file->getClientOriginalName();
            $code = trim((string) pathinfo($originalName, PATHINFO_FILENAME));

            if ($code === '') {
                $summary['omitted']++;
                $summary['errors'][] = [
                    'file' => $originalName,
                    'code' => null,
                    'motivo' => 'No se pudo obtener el código desde el nombre del archivo.',
                ];
                continue;
            }

            if ($target === 'productos') {
                $matchedProducts = Producto::where('code', $code)->get(['id']);

                if ($matchedProducts->isEmpty()) {
                    $summary['omitted']++;
                    $summary['errors'][] = [
                        'file' => $originalName,
                        'code' => $code,
                        'motivo' => 'No existe producto con ese código.',
                    ];
                    continue;
                }

                if ($matchedProducts->count() > 1) {
                    $summary['omitted']++;
                    $summary['errors'][] = [
                        'file' => $originalName,
                        'code' => $code,
                        'motivo' => 'Hay más de un producto con ese código.',
                    ];
                    continue;
                }

                $imagePath = $file->store('images', 'public');
                $productoId = $matchedProducts->first()->id;

                $existingImage = ImagenProducto::where('producto_id', $productoId)->orderBy('id')->first();

                if ($existingImage) {
                    $oldPath = $existingImage->getRawOriginal('image');
                    if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }

                    $existingImage->update([
                        'image' => $imagePath,
                    ]);

                    $summary['updated']++;
                } else {
                    ImagenProducto::create([
                        'producto_id' => $productoId,
                        'image' => $imagePath,
                    ]);

                    $summary['created']++;
                }

                continue;
            }

            $matchedSubproductos = SubProducto::where('code', $code)->get(['id', 'image']);

            if ($matchedSubproductos->isEmpty()) {
                $summary['omitted']++;
                $summary['errors'][] = [
                    'file' => $originalName,
                    'code' => $code,
                    'motivo' => 'No existe subproducto con ese código.',
                ];
                continue;
            }

            if ($matchedSubproductos->count() > 1) {
                $summary['omitted']++;
                $summary['errors'][] = [
                    'file' => $originalName,
                    'code' => $code,
                    'motivo' => 'Hay más de un subproducto con ese código.',
                ];
                continue;
            }

            $imagePath = $file->store('images', 'public');
            $subproducto = $matchedSubproductos->first();
            $oldPath = $subproducto->getRawOriginal('image');

            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }

            $wasEmpty = $oldPath === null || trim((string) $oldPath) === '';

            $subproducto->update([
                'image' => $imagePath,
            ]);

            if ($wasEmpty) {
                $summary['created']++;
            } else {
                $summary['updated']++;
            }
        }

        return redirect()->back()->with('mass_upload_images_summary', $summary);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'order' => 'nullable|string|max:255',
            'image' => 'required|file',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }

        ImagenProducto::create($data);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        $imagenProducto = ImagenProducto::findOrFail($request->id);
        if (!$imagenProducto) {
            return redirect()->back()->with('error', 'No se encontró la imagen del producto.');
        }

        $data = $request->validate([
            'order' => 'nullable|string|max:255',
            'producto_id' => 'sometimes|exists:productos,id',
            'image' => 'sometimes|file',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            $oldPath = $imagenProducto->getRawOriginal('image');
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            // Store the new image
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        $imagenProducto->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $imagenProducto = ImagenProducto::findOrFail($request->id);
        if (!$imagenProducto) {
            return redirect()->back()->with('error', 'No se encontró la imagen del producto.');
        }

        // Delete the old image if it exists
        $oldPath = $imagenProducto->getRawOriginal('image');
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $imagenProducto->delete();
    }
}
