<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Contacto;
use App\Models\ImagenProducto;
use App\Models\MarcaProducto;
use App\Models\Metadatos;
use App\Models\Producto;
use App\Models\SubProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Throwable;

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
        $marcas = MarcaProducto::select('id', 'name', 'order')->orderBy('order', 'asc')->get();

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

    public function indexInicio(Request $request, $id)
    {
        $marcas = MarcaProducto::select('id', 'name', 'order')->orderBy('order', 'asc')->get();

        $categorias = Categoria::select('id', 'name', 'order')
            ->orderBy('order', 'asc')
            ->get();

        $metadatos = Metadatos::where('title', 'Productos')->first();

        $query = Producto::where('categoria_id', $id)
            ->with('marca', 'imagenes')
            ->orderBy('order', 'asc')
            ->orderBy('id', 'asc');

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
        $productosRelacionados = Producto::with(['imagenes', 'marca:id,name', 'categoria:id,name'])
            ->where('marca_id', $producto->marca_id)
            ->where('categoria_id', $producto->categoria_id)
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
            $searchTerm = $request->codigo;

            $query->where(function ($searchQuery) use ($searchTerm) {
                $searchQuery->where('code', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('name', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhereHas('marca', function ($marcaQuery) use ($searchTerm) {
                        $marcaQuery->where('name', 'LIKE', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('subproductos', function ($subproductoQuery) use ($searchTerm) {
                        $subproductoQuery->where('medida', 'LIKE', '%' . $searchTerm . '%');
                    });
            });
        }

        $productos = $query->with(['categoria:id,name', 'marca:id,name', 'imagenes'])
            ->get();

        $categorias = Categoria::select('id', 'name', 'order')->orderBy('order', 'asc')->get();
        $marcas = MarcaProducto::select('id', 'name', 'order')->orderBy('order', 'asc')->get();

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
            'marca_id' => 'nullable|sometimes|exists:marca_productos,id',
            'ficha_tecnica' => 'sometimes|file',
            'aplicacion' => 'nullable|string|max:255',
            'anio' => 'nullable|string|max:255',
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
            'marca_id' => 'sometimes|nullable|exists:marca_productos,id',
            'ficha_tecnica' => 'sometimes|file',
            'aplicacion' => 'sometimes|string|max:255',
            'anio' => 'sometimes|string|max:255',
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
    public function cargaMasivaProductos()
    {
        return Inertia::render('admin/cargaMasivaProductos');
    }

    public function importarMasivoProductos(Request $request)
    {
        $request->validate([
            'archivo' => 'required|file|mimes:xlsx,xls',
        ]);

        $summary = [
            'total_rows' => 0,
            'created' => 0,
            'updated' => 0,
            'omitted' => 0,
            'errors' => [],
        ];

        try {
            $spreadsheet = IOFactory::load($request->file('archivo')->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);

            $headerRow = $rows[1] ?? [];
            $headerMapping = $this->resolveHeaderMapping($headerRow);

            $requiredFields = ['name', 'code', 'categoria_id', 'marca_id'];
            $missingFields = array_values(array_diff($requiredFields, array_keys($headerMapping)));

            if (!empty($missingFields)) {
                $summary['errors'][] = [
                    'fila' => 1,
                    'code' => null,
                    'motivo' => 'Faltan columnas obligatorias: ' . implode(', ', array_map(fn(string $field) => $this->humanHeaderLabel($field), $missingFields)),
                ];

                return redirect()->back()->with('mass_upload_summary', $summary);
            }

            $categoryNameToId = Categoria::select('id', 'name')
                ->get()
                ->mapWithKeys(fn($categoria) => [$this->normalizeExcelText((string) $categoria->name) => $categoria->id])
                ->all();

            $brandNameToId = MarcaProducto::select('id', 'name')
                ->get()
                ->mapWithKeys(fn($marca) => [$this->normalizeExcelText((string) $marca->name) => $marca->id])
                ->all();

            $optionalFields = ['aplicacion', 'anio', 'num_original', 'tonelaje', 'espigon', 'bujes'];
            $maxRow = count($rows);

            for ($rowNumber = 2; $rowNumber <= $maxRow; $rowNumber++) {
                $row = $rows[$rowNumber] ?? [];

                if ($this->isSpreadsheetRowEmpty($row)) {
                    continue;
                }

                $summary['total_rows']++;

                $code = $this->getMappedValue($row, $headerMapping, 'code');
                if ($code === '') {
                    $summary['omitted']++;
                    $summary['errors'][] = [
                        'fila' => $rowNumber,
                        'code' => null,
                        'motivo' => 'Código vacío.',
                    ];
                    continue;
                }

                $matchedProducts = Producto::where('code', $code)->get(['id']);
                if ($matchedProducts->count() > 1) {
                    $summary['omitted']++;
                    $summary['errors'][] = [
                        'fila' => $rowNumber,
                        'code' => $code,
                        'motivo' => 'Hay más de un producto en la base con ese código.',
                    ];
                    continue;
                }

                $name = $this->getMappedValue($row, $headerMapping, 'name');
                $categoriaRaw = $this->getMappedValue($row, $headerMapping, 'categoria_id');
                $marcaRaw = $this->getMappedValue($row, $headerMapping, 'marca_id');

                $categoriaId = null;
                if ($categoriaRaw !== '') {
                    $categoriaKey = $this->normalizeExcelText($categoriaRaw);
                    $categoriaId = $categoryNameToId[$categoriaKey] ?? null;

                    if ($categoriaId === null) {
                        $summary['omitted']++;
                        $summary['errors'][] = [
                            'fila' => $rowNumber,
                            'code' => $code,
                            'motivo' => 'Categoría inexistente: ' . $categoriaRaw,
                        ];
                        continue;
                    }
                }

                $marcaId = null;
                if ($marcaRaw !== '') {
                    $marcaKey = $this->normalizeExcelText($marcaRaw);
                    $marcaId = $brandNameToId[$marcaKey] ?? null;

                    if ($marcaId === null) {
                        $summary['omitted']++;
                        $summary['errors'][] = [
                            'fila' => $rowNumber,
                            'code' => $code,
                            'motivo' => 'Marca inexistente: ' . $marcaRaw,
                        ];
                        continue;
                    }
                }

                if ($matchedProducts->isEmpty()) {
                    if ($name === '' || $categoriaRaw === '' || $marcaRaw === '') {
                        $summary['omitted']++;
                        $summary['errors'][] = [
                            'fila' => $rowNumber,
                            'code' => $code,
                            'motivo' => 'Para crear producto son obligatorios nombre, categoría y marca.',
                        ];
                        continue;
                    }

                    $createData = [
                        'name' => $name,
                        'code' => $code,
                        'categoria_id' => $categoriaId,
                        'marca_id' => $marcaId,
                    ];

                    foreach ($optionalFields as $field) {
                        $createData[$field] = isset($headerMapping[$field])
                            ? ($this->getMappedValue($row, $headerMapping, $field) ?: null)
                            : null;
                    }

                    Producto::create($createData);
                    $summary['created']++;
                    continue;
                }

                $updateData = [];

                if ($name !== '') {
                    $updateData['name'] = $name;
                }

                if ($categoriaRaw !== '') {
                    $updateData['categoria_id'] = $categoriaId;
                }

                if ($marcaRaw !== '') {
                    $updateData['marca_id'] = $marcaId;
                }

                foreach ($optionalFields as $field) {
                    if (!isset($headerMapping[$field])) {
                        continue;
                    }

                    $value = $this->getMappedValue($row, $headerMapping, $field);
                    if ($value !== '') {
                        $updateData[$field] = $value;
                    }
                }

                if (empty($updateData)) {
                    $summary['omitted']++;
                    $summary['errors'][] = [
                        'fila' => $rowNumber,
                        'code' => $code,
                        'motivo' => 'Fila sin datos válidos para actualizar.',
                    ];
                    continue;
                }

                $matchedProducts->first()->update($updateData);
                $summary['updated']++;
            }
        } catch (Throwable $exception) {
            $summary['errors'][] = [
                'fila' => null,
                'code' => null,
                'motivo' => 'Error al procesar el archivo: ' . $exception->getMessage(),
            ];
        }

        return redirect()->back()->with('mass_upload_summary', $summary);
    }

    private function resolveHeaderMapping(array $headerRow): array
    {
        $aliasMap = [
            'name' => ['name', 'nombre'],
            'code' => ['code', 'codigo'],
            'categoria_id' => ['categoria', 'categoria id', 'categoria_id'],
            'marca_id' => ['marca', 'marca id', 'marca_id'],
            'aplicacion' => ['aplicacion'],
            'anio' => ['anio'],
            'num_original' => ['num original', 'numero original', 'num_original', 'numero_original'],
            'tonelaje' => ['tonelaje'],
            'espigon' => ['espigon'],
            'bujes' => ['bujes'],
        ];

        $normalizedAliasMap = [];
        foreach ($aliasMap as $field => $aliases) {
            $normalizedAliasMap[$field] = array_map(fn(string $alias) => $this->normalizeExcelText($alias), $aliases);
        }

        $mapping = [];

        foreach ($headerRow as $column => $rawHeader) {
            $normalizedHeader = $this->normalizeExcelText($this->cellToString($rawHeader));
            if ($normalizedHeader === '') {
                continue;
            }

            foreach ($normalizedAliasMap as $field => $aliases) {
                if (isset($mapping[$field])) {
                    continue;
                }

                if (in_array($normalizedHeader, $aliases, true)) {
                    $mapping[$field] = $column;
                    break;
                }
            }
        }

        return $mapping;
    }

    private function getMappedValue(array $row, array $headerMapping, string $field): string
    {
        if (!isset($headerMapping[$field])) {
            return '';
        }

        $column = $headerMapping[$field];

        return $this->cellToString($row[$column] ?? null);
    }

    private function isSpreadsheetRowEmpty(array $row): bool
    {
        foreach ($row as $value) {
            if ($this->cellToString($value) !== '') {
                return false;
            }
        }

        return true;
    }

    private function cellToString(mixed $value): string
    {
        if ($value === null) {
            return '';
        }

        if (is_string($value)) {
            return trim($value);
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        if (is_int($value)) {
            return (string) $value;
        }

        if (is_float($value)) {
            if ((float) (int) $value === $value) {
                return (string) (int) $value;
            }

            return rtrim(rtrim(sprintf('%.12F', $value), '0'), '.');
        }

        return trim((string) $value);
    }

    private function normalizeExcelText(string $value): string
    {
        return (string) Str::of($value)
            ->squish()
            ->lower()
            ->ascii();
    }

    private function humanHeaderLabel(string $field): string
    {
        $labels = [
            'name' => 'Nombre',
            'code' => 'Código',
            'categoria_id' => 'Categoría',
            'marca_id' => 'Marca',
            'aplicacion' => 'Aplicación',
            'anio' => 'Año',
            'num_original' => 'Número original',
            'tonelaje' => 'Tonelaje',
            'espigon' => 'Espigón',
            'bujes' => 'Bujes',
        ];

        return $labels[$field] ?? $field;
    }
    public function exportarExcel(): StreamedResponse
    {
        $excludedColumns = ['id', 'order', 'ficha_tecnica', 'created_at', 'updated_at'];

        $allColumns = Schema::getColumnListing('productos');

        $queryColumns = collect($allColumns)
            ->reject(fn(string $column) => in_array($column, $excludedColumns, true))
            ->values()
            ->all();

        $headerLabels = [
            'name' => 'Nombre',
            'code' => 'Codigo',
            'categoria_id' => 'Categoria',
            'marca_id' => 'Marca',
            'aplicacion' => 'Aplicacion',
            'anio' => 'Año',
            'num_original' => 'Numero original',
            'tonelaje' => 'Tonelaje',
            'espigon' => 'Espigon',
            'bujes' => 'Bujes',
        ];

        $productos = Producto::query()
            ->with(['categoria:id,name', 'marca:id,name'])
            ->select($queryColumns)
            ->orderBy('order', 'asc')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Productos');

        $displayHeaders = array_map(
            fn(string $column): string => $headerLabels[$column] ?? ucwords(str_replace('_', ' ', $column)),
            $queryColumns
        );

        $sheet->fromArray($displayHeaders, null, 'A1');

        $rowNumber = 2;
        foreach ($productos as $producto) {
            $rowData = [];

            foreach ($queryColumns as $column) {
                if ($column === 'categoria_id') {
                    $rowData[] = $producto->categoria?->name;
                    continue;
                }

                if ($column === 'marca_id') {
                    $rowData[] = $producto->marca?->name;
                    continue;
                }

                $rowData[] = $producto->{$column};
            }

            $sheet->fromArray($rowData, null, "A{$rowNumber}");
            $rowNumber++;
        }

        $lastColumn = Coordinate::stringFromColumnIndex(count($queryColumns));
        $lastRow = max($rowNumber - 1, 1);

        $headerRange = "A1:{$lastColumn}1";
        $fullRange = "A1:{$lastColumn}{$lastRow}";

        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 11,
                'color' => ['argb' => 'FFFFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF1F2937'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $sheet->getStyle($fullRange)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FFD1D5DB'],
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $numOriginalIndex = array_search('num_original', $queryColumns, true);
        if ($numOriginalIndex !== false && $lastRow >= 2) {
            $numOriginalColumn = Coordinate::stringFromColumnIndex($numOriginalIndex + 1);
            $numOriginalRange = "{$numOriginalColumn}2:{$numOriginalColumn}{$lastRow}";
            $sheet->getStyle($numOriginalRange)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        }

        $sheet->freezePane('A2');
        $sheet->setAutoFilter($headerRange);
        $sheet->getDefaultRowDimension()->setRowHeight(20);
        $sheet->getRowDimension(1)->setRowHeight(24);

        for ($columnIndex = 1; $columnIndex <= count($queryColumns); $columnIndex++) {
            $columnLetter = Coordinate::stringFromColumnIndex($columnIndex);
            $sheet->getColumnDimension($columnLetter)->setAutoSize(true);
            if ($sheet->getColumnDimension($columnLetter)->getWidth() < 16) {
                $sheet->getColumnDimension($columnLetter)->setWidth(16);
            }
        }

        $fileName = 'productos_' . now()->format('d-m-Y_Hi') . '.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
            $spreadsheet->disconnectWorksheets();
            unset($spreadsheet);
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
