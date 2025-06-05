<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Producto;
use App\Models\SubProducto;
use DragonCode\Support\Facades\Filesystem\File;
use Illuminate\Http\Request;

class SubProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $productos = Producto::select('id', 'name')->get();

        $perPage = $request->input('per_page', 10);

        $query = SubProducto::with([
            'producto' => function ($query) {
                $query->select('id', 'name', 'marca_id')
                    ->with(['marca' => function ($q) {
                        $q->select('id', 'name');
                    }]);
            }
        ])->orderBy('order', 'asc');

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('code', 'LIKE', '%' . $searchTerm . '%');
        }

        $subProductos = $query->paginate($perPage);



        return inertia('admin/subProductosAdmin', [
            'subProductos' => $subProductos,
            'productos' => $productos,
        ]);
    }

    public function indexPrivada(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $categoria = $request->input('categoria');
        $marca = $request->input('marca');
        $codigo = $request->input('codigo');


        $marcas = Marca::select('id', 'name')->get();
        $categorias = Categoria::select('id', 'name')->get();

        $query = SubProducto::with([
            'producto' => function ($query) {
                $query->select('id', 'name', 'marca_id', 'categoria_id')
                    ->with(['marca' => function ($q) {
                        $q->select('id', 'name');
                    }])
                    ->with(['categoria' => function ($q) {
                        $q->select('id', 'name');
                    }]);
            }
        ])->orderBy('order', 'asc');

        // Filtrar por código del subproducto
        if ($codigo) {
            $query->where('code', 'like', "%{$codigo}%");
        }

        // Filtrar por marca del producto
        if ($marca) {
            $query->whereHas('producto', function ($q) use ($marca) {
                $q->where('marca_id', $marca);
            });
        }

        // Filtrar por categoría del producto
        if ($categoria) {
            $query->whereHas('producto', function ($q) use ($categoria) {
                $q->where('categoria_id', $categoria);
            });
        }

        $subProductos = $query->paginate(perPage: $perPage);

        return inertia('privada/productosPrivada', [
            'subProductos' => $subProductos,
            'categorias' => $categorias,
            'marcas' => $marcas,
        ]);
    }

    public function cargarSubProductos()
    {
        $subproductos = SubProducto::whereNull('producto_id');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order' => 'nullable|string|max:255',
            'code' => 'required|string|max:255',
            'producto_id' => 'required|exists:productos,id',
            'description' => 'nullable|sometimes|string|max:255',
            'medida' => 'nullable|string|max:255',
            'componente' => 'nullable|string|max:255',
            'caracteristicas' => 'nullable|string|max:255',
            'price_mayorista' => 'required|numeric',
            'price_minorista' => 'required|numeric',
            'price_dist' => 'required|numeric',
            'image' => 'nullable|sometimes|file',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }

        SubProducto::create($data);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $subProducto = SubProducto::findOrFail($request->id);
        if (!$subProducto) {
            return redirect()->back()->with('error', 'No se encontró el subproducto.');
        }

        $data = $request->validate([
            'order' => 'nullable|string|max:255',
            'code' => 'required|string|max:255',
            'producto_id' => 'required|exists:productos,id',
            'description' => 'nullable|sometimes|string|max:255',
            'medida' => 'nullable|string|max:255',
            'componente' => 'nullable|string|max:255',
            'caracteristicas' => 'nullable|string|max:255',
            'price_mayorista' => 'required|numeric',
            'price_minorista' => 'required|numeric',
            'price_dist' => 'required|numeric',
            'image' => 'sometimes|nullable|file',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }

        $subProducto->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        $subProducto = SubProducto::findOrFail(request()->id);
        if (!$subProducto) {
            return redirect()->back()->with('error', 'No se encontró el subproducto.');
        }

        $absolutePath = public_path('storage/' . $subProducto->image);
        if (File::exists($absolutePath)) {
            File::delete($absolutePath);
        }

        $subProducto->delete();
    }
}
