<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Producto;
use App\Models\MarcaProducto;
use App\Models\SubProducto;
use DragonCode\Support\Facades\Filesystem\File;
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
use Inertia\Inertia;
use Throwable;

class SubProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $productos = Producto::select('id', 'name', 'categoria_id')
            ->with(['categoria' => function ($query) {
                $query->select('id', 'name');
            }])
            ->get();

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


        $marcas = MarcaProducto::select('id', 'name')->get();
        $categorias = Categoria::select('id', 'name')->get();

        $query = SubProducto::with([
            'producto' => function ($query) {
                $query
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
            $query->where('code', 'like', "%{$codigo}%")->orWhere('description', 'like', "%{$codigo}%");
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

    public function cargaMasivaSubproductos()
    {
        return Inertia::render('admin/cargaMasivaSubproductos');
    }

    public function importarMasivoSubproductos(Request $request)
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
            $headerMapping = $this->resolveSubproductosHeaderMapping($headerRow);

            $requiredFields = ['code', 'producto_id', 'description'];
            $missingFields = array_values(array_diff($requiredFields, array_keys($headerMapping)));

            if (!empty($missingFields)) {
                $summary['errors'][] = [
                    'fila' => 1,
                    'code' => null,
                    'motivo' => 'Faltan columnas obligatorias: ' . implode(', ', array_map(fn(string $field) => $this->humanSubproductosHeaderLabel($field), $missingFields)),
                ];

                return redirect()->back()->with('mass_upload_subproductos_summary', $summary);
            }

            $productNameToIds = [];
            foreach (Producto::select('id', 'name')->get() as $producto) {
                $key = $this->normalizeExcelText((string) $producto->name);
                if ($key === '') {
                    continue;
                }

                if (!isset($productNameToIds[$key])) {
                    $productNameToIds[$key] = [];
                }

                $productNameToIds[$key][] = $producto->id;
            }

            $optionalTextFields = ['medida', 'componente', 'caracteristicas'];
            $optionalPriceFields = ['price_mayorista', 'price_minorista', 'price_dist'];
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

                $matchedSubproductos = SubProducto::where('code', $code)->get(['id']);
                if ($matchedSubproductos->count() > 1) {
                    $summary['omitted']++;
                    $summary['errors'][] = [
                        'fila' => $rowNumber,
                        'code' => $code,
                        'motivo' => 'Hay más de un subproducto en la base con ese código.',
                    ];
                    continue;
                }

                $productoRaw = $this->getMappedValue($row, $headerMapping, 'producto_id');
                $description = $this->getMappedValue($row, $headerMapping, 'description');

                $productoId = null;
                if ($productoRaw !== '') {
                    $productoKey = $this->normalizeExcelText($productoRaw);
                    $matchedIds = $productNameToIds[$productoKey] ?? null;

                    if ($matchedIds === null) {
                        $summary['omitted']++;
                        $summary['errors'][] = [
                            'fila' => $rowNumber,
                            'code' => $code,
                            'motivo' => 'Producto inexistente: ' . $productoRaw,
                        ];
                        continue;
                    }

                    if (count($matchedIds) > 1) {
                        $summary['omitted']++;
                        $summary['errors'][] = [
                            'fila' => $rowNumber,
                            'code' => $code,
                            'motivo' => 'Nombre de producto ambiguo (coincide con más de un producto): ' . $productoRaw,
                        ];
                        continue;
                    }

                    $productoId = $matchedIds[0];
                }

                if ($matchedSubproductos->isEmpty()) {
                    if ($productoRaw === '' || $description === '') {
                        $summary['omitted']++;
                        $summary['errors'][] = [
                            'fila' => $rowNumber,
                            'code' => $code,
                            'motivo' => 'Para crear subproducto son obligatorios producto y descripción.',
                        ];
                        continue;
                    }

                    $createData = [
                        'code' => $code,
                        'producto_id' => $productoId,
                        'description' => $description,
                    ];

                    foreach ($optionalTextFields as $field) {
                        if (!isset($headerMapping[$field])) {
                            continue;
                        }

                        $value = $this->getMappedValue($row, $headerMapping, $field);
                        $createData[$field] = $value !== '' ? $value : null;
                    }

                    foreach ($optionalPriceFields as $field) {
                        if (!isset($headerMapping[$field])) {
                            continue;
                        }

                        $rawValue = $this->getMappedValue($row, $headerMapping, $field);
                        if ($rawValue === '') {
                            continue;
                        }

                        $parsedValue = $this->parsePriceValue($rawValue);
                        if ($parsedValue === null) {
                            $summary['omitted']++;
                            $summary['errors'][] = [
                                'fila' => $rowNumber,
                                'code' => $code,
                                'motivo' => 'Valor inválido en ' . $this->humanSubproductosHeaderLabel($field) . ': ' . $rawValue,
                            ];
                            continue 2;
                        }

                        $createData[$field] = $parsedValue;
                    }

                    SubProducto::create($createData);
                    $summary['created']++;
                    continue;
                }

                $updateData = [];

                if ($productoRaw !== '') {
                    $updateData['producto_id'] = $productoId;
                }

                if ($description !== '') {
                    $updateData['description'] = $description;
                }

                foreach ($optionalTextFields as $field) {
                    if (!isset($headerMapping[$field])) {
                        continue;
                    }

                    $value = $this->getMappedValue($row, $headerMapping, $field);
                    if ($value !== '') {
                        $updateData[$field] = $value;
                    }
                }

                foreach ($optionalPriceFields as $field) {
                    if (!isset($headerMapping[$field])) {
                        continue;
                    }

                    $rawValue = $this->getMappedValue($row, $headerMapping, $field);
                    if ($rawValue === '') {
                        continue;
                    }

                    $parsedValue = $this->parsePriceValue($rawValue);
                    if ($parsedValue === null) {
                        $summary['omitted']++;
                        $summary['errors'][] = [
                            'fila' => $rowNumber,
                            'code' => $code,
                            'motivo' => 'Valor inválido en ' . $this->humanSubproductosHeaderLabel($field) . ': ' . $rawValue,
                        ];
                        continue 2;
                    }

                    $updateData[$field] = $parsedValue;
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

                $matchedSubproductos->first()->update($updateData);
                $summary['updated']++;
            }
        } catch (Throwable $exception) {
            $summary['errors'][] = [
                'fila' => null,
                'code' => null,
                'motivo' => 'Error al procesar el archivo: ' . $exception->getMessage(),
            ];
        }

        return redirect()->back()->with('mass_upload_subproductos_summary', $summary);
    }

    private function resolveSubproductosHeaderMapping(array $headerRow): array
    {
        $aliasMap = [
            'code' => ['code', 'codigo', 'cod'],
            'producto_id' => ['producto', 'producto id', 'producto_id', 'nombre producto', 'producto nombre'],
            'description' => ['descripcion', 'descripción', 'description', 'detalle'],
            'medida' => ['medida'],
            'componente' => ['componente', 'largo total', 'largo_total', 'largo'],
            'caracteristicas' => ['caracteristicas', 'características', 'caracteristica', 'característica'],
            'price_mayorista' => ['price_mayorista', 'precio mayorista', 'precio mayorista lista 1', 'precio lista 1', 'mayorista', 'precio mayorista (lista 1)'],
            'price_minorista' => ['price_minorista', 'precio minorista', 'precio minorista lista 2', 'precio lista 2', 'minorista', 'precio minorista (lista 2)'],
            'price_dist' => ['price_dist', 'precio distribuidor', 'precio distribucion', 'precio distribución', 'precio dist', 'distribuidor', 'precio distribuidor (lista 3)', 'precio lista 3'],
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
            ->replace(['_', '-'], ' ')
            ->squish()
            ->lower()
            ->ascii();
    }

    private function parsePriceValue(string $rawValue): ?float
    {
        $normalized = str_replace(['$', ' '], '', trim($rawValue));
        if ($normalized === '') {
            return null;
        }

        if (str_contains($normalized, ',') && str_contains($normalized, '.')) {
            $lastComma = strrpos($normalized, ',');
            $lastDot = strrpos($normalized, '.');

            if ($lastComma !== false && $lastDot !== false && $lastComma > $lastDot) {
                $normalized = str_replace('.', '', $normalized);
                $normalized = str_replace(',', '.', $normalized);
            } else {
                $normalized = str_replace(',', '', $normalized);
            }
        } elseif (str_contains($normalized, ',')) {
            $normalized = str_replace(',', '.', $normalized);
        }

        if (!is_numeric($normalized)) {
            return null;
        }

        return (float) $normalized;
    }

    private function humanSubproductosHeaderLabel(string $field): string
    {
        $labels = [
            'code' => 'Código',
            'producto_id' => 'Producto',
            'description' => 'Descripción',
            'medida' => 'Medida',
            'componente' => 'Componente',
            'caracteristicas' => 'Características',
            'price_mayorista' => 'Precio mayorista',
            'price_minorista' => 'Precio minorista',
            'price_dist' => 'Precio distribuidor',
        ];

        return $labels[$field] ?? $field;
    }

    public function exportarExcel(): StreamedResponse
    {
        $excludedColumns = ['id', 'order', 'image', 'created_at', 'updated_at'];

        $columns = collect(Schema::getColumnListing('sub_productos'))
            ->reject(fn(string $column) => in_array($column, $excludedColumns, true))
            ->values()
            ->all();

        $headerLabels = [
            'code' => 'Codigo',
            'producto_id' => 'Producto',
            'description' => 'Descripcion',
            'medida' => 'Medida',
            'componente' => 'Componente',
            'caracteristicas' => 'Caracteristicas',
            'price_mayorista' => 'Precio mayorista',
            'price_minorista' => 'Precio minorista',
            'price_dist' => 'Precio distribuidor',
        ];

        $subProductos = SubProducto::query()
            ->with('producto:id,name')
            ->select($columns)
            ->orderBy('order', 'asc')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Subproductos');

        $displayHeaders = array_map(
            fn(string $column): string => $headerLabels[$column] ?? ucwords(str_replace('_', ' ', $column)),
            $columns
        );

        $sheet->fromArray($displayHeaders, null, 'A1');

        $rowNumber = 2;
        foreach ($subProductos as $subProducto) {
            $rowData = [];

            foreach ($columns as $column) {
                if ($column === 'producto_id') {
                    $rowData[] = $subProducto->producto?->name;
                    continue;
                }

                $rowData[] = $subProducto->{$column};
            }

            $sheet->fromArray($rowData, null, "A{$rowNumber}");
            $rowNumber++;
        }

        $lastColumn = Coordinate::stringFromColumnIndex(count($columns));
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

        $sheet->freezePane('A2');
        $sheet->setAutoFilter($headerRange);
        $sheet->getDefaultRowDimension()->setRowHeight(20);
        $sheet->getRowDimension(1)->setRowHeight(24);

        for ($columnIndex = 1; $columnIndex <= count($columns); $columnIndex++) {
            $columnLetter = Coordinate::stringFromColumnIndex($columnIndex);
            $sheet->getColumnDimension($columnLetter)->setAutoSize(true);
            if ($sheet->getColumnDimension($columnLetter)->getWidth() < 16) {
                $sheet->getColumnDimension($columnLetter)->setWidth(16);
            }
        }

        $fileName = 'subproductos_' . now()->format('Ymd_His') . '.xlsx';

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
