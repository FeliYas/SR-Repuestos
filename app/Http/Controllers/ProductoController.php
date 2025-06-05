<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Contacto;
use App\Models\ImagenProducto;
use App\Models\Marca;
use App\Models\MarcaProducto;
use App\Models\Metadatos;
use App\Models\Producto;
use App\Models\SubProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $categorias = Categoria::select('id', 'name')->get();
        $marcas = MarcaProducto::select('id', 'name')->get();

        $perPage = $request->input('per_page', default: 10);

        $query = Producto::query()->orderBy('order', 'asc')->with(['categoria:id,name', 'marca:id,name', 'imagenes']);

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', '%' . $searchTerm . '%')->orWhere('code', 'LIKE', '%' . $searchTerm . '%');
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
        $marcas = MarcaProducto::select('id', 'name')->get();


        return Inertia::render('productosVistaPrevia', [
            'categorias' => $categorias,
            'marcas' => $marcas,
            'productos' => $productos,
        ]);
    }

    /* public function indexInicio(Request $request, $id)
    {
        $marcas = Marca::select('id', 'name', 'order')->orderBy('order', 'asc')->get();

        $categorias = Categoria::select('id', 'name', 'order')
            ->orderBy('order', 'asc')
            ->get();
        $metadatos = Metadatos::where('title', 'Productos')->first();
        if ($request->has('marca') && !empty($request->marca)) {
            $productos = Producto::where('categoria_id', $id)->whereHas('subproductos')->whereHas('imagenes')->where('marca_id', $request->marca)->with('marca', 'imagenes')->orderBy('order', 'asc')->get();
        } else {
            $productos = Producto::where('categoria_id', $id)->whereHas('subproductos')->whereHas('imagenes')->with('marca', 'imagenes')->orderBy('order', 'asc')->get();
        }
        $subproductos = SubProducto::orderBy('order', 'asc')->get();

        return Inertia::render('productos', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
            'metadatos' => $metadatos,
            'id' => $id,
            'marca_id' => $request->marca,
            'subproductos' => $subproductos,

        ]);
    } */

    public function indexInicio(Request $request, $id)
    {
        $marcas = MarcaProducto::select('id', 'name', 'order')->orderBy('order', 'asc')->get();

        $categorias = Categoria::select('id', 'name', 'order')
            ->orderBy('order', 'asc')
            ->get();

        $metadatos = Metadatos::where('title', 'Productos')->first();

        $query = Producto::where('categoria_id', $id)
            ->with('marca', 'imagenes')
            ->orderBy('order', 'asc');

        if ($request->filled('marca')) {
            $query->where('marca_id', $request->marca);
        }

        $productos = $query->paginate(12)->withQueryString(); // 12 por página, mantiene filtros

        // Opcional: solo subproductos de productos actuales (más eficiente)
        $productoIds = $productos->pluck('id');
        $subproductos = SubProducto::whereIn('producto_id', $productoIds)
            ->orderBy('order', 'asc')
            ->get();

        return Inertia::render('productos', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
            'metadatos' => $metadatos,
            'id' => $id,
            'marca_id' => $request->marca,
            'subproductos' => $subproductos,
        ]);
    }

    public function imagenesProducto()
    {
        $fotos = Storage::disk('public')->files('repuestos');

        foreach ($fotos as $foto) {
            $path = pathinfo(basename($foto), PATHINFO_FILENAME);

            $producto = Producto::where('code', $path)->first();
            if (!$producto) {
                continue; // Skip if the product is not found
            }
            $url = Storage::url($foto);
            ImagenProducto::create([
                'producto_id' => $producto->id,
                'image' => $url,
            ]);
        }
    }

    public function agregarMarca()
    {
        $productos = Producto::all();



        foreach ($productos as $producto) {
            // Extraer las letras iniciales del código
            $prefijo = preg_match('/^[A-Za-z]+/', $producto->code, $matches) ? $matches[0] : '';

            // Verificar si el prefijo coincide con el que querés
            if ($prefijo === 'AG' || $prefijo === 'AGP') {
                $producto->marca_id = 1;
            } else if ($prefijo === 'C' || $prefijo === 'CHP') {
                $producto->marca_id = 2;
            } else if ($prefijo === 'DO') {
                $producto->marca_id = 3;
            } else if ($prefijo === 'FI' || $prefijo === 'FIP') {
                $producto->marca_id = 4;
            } else if ($prefijo === 'FO' || $prefijo === 'FOP') {
                $producto->marca_id = 5;
            } else if ($prefijo === 'HY') {
                $producto->marca_id = 6;
            } else if ($prefijo === 'IVP' || $prefijo === 'IV') {
                $producto->marca_id = 7;
            } else if ($prefijo === 'MB' || $prefijo === 'MBP') {
                $producto->marca_id = 8;
            } else if ($prefijo === 'MTB') {
                $producto->marca_id = 9;
            } else if ($prefijo === 'NF') {
                $producto->marca_id = 10;
            } else if ($prefijo === 'SR') {
                $producto->marca_id = 11;
            } else if ($prefijo === 'SV' || $prefijo === 'SVP') {
                $producto->marca_id = 12;
            } else if ($prefijo === 'TO') {
                $producto->marca_id = 13;
            } else if ($prefijo === 'VL' || $prefijo === 'VLP') {
                $producto->marca_id = 14;
            } else if ($prefijo === 'VW' || $prefijo === 'VWP') {
                $producto->marca_id = 15;
            } else if ($prefijo === 'RAP') {
                $producto->marca_id = 16;
            } else if ($prefijo === 'REP') {
                $producto->marca_id = 17;
            } else if ($prefijo === 'ZLP') {
                $producto->marca_id = 18;
            } else {
                continue;
            }

            // Guardar el producto con la nueva marca
            $producto->save();
        }
    }



    public function show($id, $producto_id)
    {

        $subproductos = SubProducto::where('producto_id', $producto_id)->orderBy('order', 'asc')->get();
        $producto = Producto::with(['categoria:id,name', 'marca:id,name', 'imagenes'])->findOrFail($producto_id);
        $categorias = Categoria::select('id', 'name', 'order')->orderBy('order', 'asc')->get();
        $productosRelacionados = Producto::with(['imagenes'])
            ->where('marca_id', $producto->marca_id)
            ->where('id', '!=', $producto_id)
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

    public function fixImagePath()
    {
        # Quitar /storage/ de las rutas de las imágenes
        $imagenes = ImagenProducto::all();
        foreach ($imagenes as $imagen) {
            if (strpos($imagen->image, '/storage/') === 0) {
                $imagen->image = str_replace('/storage/', '', $imagen->image);
                $imagen->save();
            }
        }

        return response()->json(['message' => 'Rutas de imágenes actualizadas correctamente.']);
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
            'marca_id' => 'required|exists:marcas_productos,id',
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
            'marca_id' => 'sometimes|exists:marca_productos,id',
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
