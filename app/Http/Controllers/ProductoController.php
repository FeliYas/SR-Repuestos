<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Contacto;
use App\Models\Marca;
use App\Models\Producto;
use App\Models\SubProducto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $categorias = Categoria::select('id', 'name')->get();
        $marcas = Marca::select('id', 'name')->get();

        $perPage = $request->input('per_page', default: 10);

        $query = Producto::query()->orderBy('order', 'asc')->with(['categoria:id,name', 'marca:id,name', 'imagenes']);

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', '%' . $searchTerm . '%');
        }

        $productos = $query->paginate($perPage);



        return Inertia::render('admin/productosAdmin', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
        ]);
    }

    public function indexVistaPrevia()
    {
        $productos = Producto::select('id', 'code')->get();
        $categorias = Categoria::orderBy('order', 'asc')->get();
        $marcas = Marca::select('id', 'name')->get();


        return Inertia::render('productosVistaPrevia', [
            'categorias' => $categorias,
            'marcas' => $marcas,
            'productos' => $productos,
        ]);
    }

    public function indexInicio($id)
    {

        $productos = Producto::where('categoria_id', $id)->orderBy('order', 'asc')->get();
        $categorias = Categoria::select('id', 'name', 'order')
            ->orderBy('order', 'asc')
            ->get();


        return Inertia::render('productos', [
            'productos' => $productos,
            'categorias' => $categorias,
            'id' => $id,

        ]);
    }

    public function show($id)
    {
        $subproductos = SubProducto::where('producto_id', $id)->orderBy('order', 'asc')->get();
        $producto = Producto::with(['categoria:id,name', 'marca:id,name', 'imagenes'])->findOrFail($id);
        $categorias = Categoria::select('id', 'name', 'order')->orderBy('order', 'asc')->get();
        $productosRelacionados = Producto::with(['imagenes'])
            ->where('marca_id', $producto->marca_id)
            ->where('id', '!=', $id)
            ->inRandomOrder()
            ->limit(3)
            ->get();


        return Inertia::render('productos/productoShow', [
            'producto' => $producto,
            'subproductos' => $subproductos,
            'categorias' => $categorias,
            'productosRelacionados' => $productosRelacionados,
        ]);
    }

    public function SearchProducts(Request $request)
    {
        $query = Producto::query();

        // Aplicar filtros solo si existen
        if ($request->filled('categoria')) {
            $query->where('categoria_id', $request->categoria);
        }

        if ($request->filled('marca')) {
            $query->where('marca_id', $request->marca);
        }

        if ($request->filled('codigo')) {
            $query->where('code', 'LIKE', '%' . $request->codigo . '%');
        }

        $productos = $query->with(['categoria:id,name', 'marca:id,name', 'imagenes'])
            ->get();

        $categorias = Categoria::select('id', 'name', 'order')->orderBy('order', 'asc')->get();
        $marcas = Marca::select('id', 'name', 'order')->orderBy('order', 'asc')->get();

        return Inertia::render('productos/productoSearch', [
            'productos' => $productos, // Cambié 'producto' a 'productos' (plural)
            'categorias' => $categorias,
            'marcas' => $marcas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'sometimes|string|max:255',
            'code' => 'required|string|max:255',
            'categoria_id' => 'required|exists:categorias,id',
            'marca_id' => 'required|exists:marcas,id',
            'ficha_tecnica' => 'sometimes|file',
            'aplicacion' => 'nullable|string|max:255',
            'anios' => 'nullable|string|max:255',
            'num_original' => 'nullable|string|max:255',
            'tonelaje' => 'nullable|string|max:255',
            'espigon' => 'nullable|string|max:255',
            'bujes' => 'nullable|string|max:255',


        ]);

        // Handle file upload
        if ($request->hasFile('ficha_tecnica')) {
            $imagePath = $request->file('ficha_tecnica')->store('images', 'public');
            $data['ficha_tecnica'] = $imagePath;
        }

        Producto::create($data);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $producto = Producto::findOrFail($request->id);

        // Check if the product entry exists
        if (!$producto) {
            return redirect()->back()->with('error', 'Producto no encontrado.');
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'order' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:255',
            'categoria_id' => 'sometimes|exists:categorias,id',
            'marca_id' => 'sometimes|exists:marcas,id',
            'ficha_tecnica' => 'sometimes|file',
            'aplicacion' => 'sometimes|string|max:255',
            'anios' => 'sometimes|string|max:255',
            'num_original' => 'sometimes|string|max:255',
            'tonelaje' => 'sometimes|string|max:255',
            'espigon' => 'sometimes|string|max:255',
            'bujes' => 'sometimes|string|max:255',
        ]);

        // Handle file upload
        if ($request->hasFile('ficha_tecnica')) {
            // Delete the old image if it exists
            if ($producto->ficha_tecnica) {
                $absolutePath = public_path('storage/' . $producto->ficha_tecnica);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            // Store the new image
            $data['ficha_tecnica'] = $request->file('ficha_tecnica')->store('images', 'public');
        }

        $producto->update($data);

        return redirect()->back()->with('success', 'Producto actualizado correctamente.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $producto = Producto::findOrFail($request->id);

        // Check if the product entry exists
        if (!$producto) {
            return redirect()->back()->with('error', 'Producto no encontrado.');
        }

        // Delete the image if it exists
        if ($producto->ficha_tecnica) {
            $absolutePath = public_path('storage/' . $producto->ficha_tecnica);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        $producto->delete();

        return redirect()->back()->with('success', 'Producto eliminado correctamente.');
    }
}
