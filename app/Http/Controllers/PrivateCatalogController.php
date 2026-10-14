<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\MarcaProducto;
use App\Models\Producto;
use App\Models\SubProducto;
use App\Services\CustomerPrice;
use App\Services\ProductSearchService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrivateCatalogController extends Controller
{
    public function index()
    {
        return Inertia::render('productosVistaPrevia', [
            'privateCatalog' => true,
            'categorias' => Categoria::whereNotNull('image')->alphabetical()->get(),
            'allcategorias' => Categoria::alphabetical()->get(),
            'marcas' => MarcaProducto::select('id', 'name')->alphabetical()->get(),
        ]);
    }

    public function category(Request $request, Categoria $categoria)
    {
        $filters = $request->validate([
            'marca' => ['nullable', 'integer', 'exists:marca_productos,id'],
        ]);

        $query = Producto::where('categoria_id', $categoria->id)
            ->with(['categoria:id,name', 'marca:id,name', 'imagenes'])
            ->alphabetical();

        if (isset($filters['marca'])) {
            $query->where('marca_id', $filters['marca']);
        }

        return Inertia::render('productos', [
            'privateCatalog' => true,
            'productos' => $query->paginate(12)->withQueryString(),
            'categorias' => Categoria::select('id', 'name')->alphabetical()->get(),
            'marcas' => MarcaProducto::select('id', 'name')->alphabetical()->get(),
            'id' => $categoria->id,
            'marca_id' => $filters['marca'] ?? null,
            'filters' => [
                'categoria' => (string) $categoria->id,
                'marca' => (string) ($filters['marca'] ?? ''),
                'codigo' => '',
            ],
        ]);
    }

    public function search(Request $request, ProductSearchService $searchService)
    {
        $filters = $request->validate([
            'categoria' => ['nullable', 'integer', 'exists:categorias,id'],
            'marca' => ['nullable', 'integer', 'exists:marca_productos,id'],
            'codigo' => ['nullable', 'string', 'max:120'],
        ]);

        $query = Producto::query();

        if (isset($filters['categoria'])) {
            $query->where('categoria_id', $filters['categoria']);
        }
        if (isset($filters['marca'])) {
            $query->where('marca_id', $filters['marca']);
        }

        $searchService->apply($query, $filters['codigo'] ?? null);

        return Inertia::render('productos/productoSearch', [
            'privateCatalog' => true,
            'productos' => $query->with(['categoria:id,name', 'marca:id,name', 'imagenes'])
                ->alphabetical()->paginate(12)->withQueryString(),
            'categorias' => Categoria::select('id', 'name')->alphabetical()->get(),
            'marcas' => MarcaProducto::select('id', 'name')->alphabetical()->get(),
            'filters' => [
                'categoria' => (string) ($filters['categoria'] ?? ''),
                'marca' => (string) ($filters['marca'] ?? ''),
                'codigo' => trim((string) ($filters['codigo'] ?? '')),
            ],
        ]);
    }

    public function show(Request $request, Categoria $categoria, Producto $producto, CustomerPrice $prices)
    {
        abort_unless($producto->categoria_id === $categoria->id, 404);

        $producto->load(['categoria:id,name', 'marca:id,name', 'imagenes']);

        $subproductos = SubProducto::where('producto_id', $producto->id)
            ->with('producto.marca')
            ->alphabetical()
            ->get()
            ->map(fn (SubProducto $subproducto) => $prices->publicData($request->user(), $subproducto));

        $relacionados = Producto::with(['imagenes', 'marca:id,name', 'categoria:id,name'])
            ->where('id', '!=', $producto->id)
            ->where('categoria_id', $categoria->id)
            ->alphabetical()
            ->limit(3)
            ->get();

        $back = $request->query('back');
        $backUrl = is_string($back) && str_starts_with($back, '/privada/') && ! str_starts_with($back, '//')
            ? $back
            : route('privada.productos.categoria', $categoria, false);

        return Inertia::render('productos/productoShow', [
            'privateCatalog' => true,
            'producto' => $producto,
            'subproductos' => $subproductos,
            'categorias' => Categoria::select('id', 'name')->alphabetical()->get(),
            'productosRelacionados' => $relacionados,
            'backUrl' => $backUrl,
        ]);
    }
}
