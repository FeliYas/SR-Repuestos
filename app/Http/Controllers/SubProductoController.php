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
                    ->select('id', 'name', 'marca_id', 'categoria_id', 'aplicacion', 'anio', 'num_original', 'tonelaje', 'espigon', 'bujes')
                    ->with(['marca' => function ($q) {
                        $q->select('id', 'name');
                    }])
                    ->with(['categoria' => function ($q) {
                        $q->select('id', 'name');
                    }])
                    ->with(['imagenes' => function ($q) {
                        $q->select('id', 'producto_id', 'image')
                            ->orderBy('order', 'asc')
                            ->orderBy('id', 'asc');
                    }]);
            }
        ])->orderBy('order', 'asc');

        if ($codigo) {
            $query->where(function ($q) use ($codigo) {
                $q->where('code', 'like', "%{$codigo}%")
                    ->orWhere('description', 'like', "%{$codigo}%");
            });
        }

        if ($marca) {
            $query->whereHas('producto', function ($q) use ($marca) {
                $q->where('marca_id', $marca);
            });
        }

        if ($categoria) {
            $query->whereHas('producto', function ($q) use ($categoria) {
                $q->where('categoria_id', $categoria);
            });
        }

        $subProductos = $query->paginate($perPage)->withQueryString();

        return inertia('privada/productosPrivada', [
            'subProductos' => $subProductos,
            'categorias' => $categorias,
            'marcas' => $marcas,
            'filters' => [
                'categoria' => $categoria ?? '',
                'marca' => $marca ?? '',
                'codigo' => $codigo ?? '',
            ],
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
            'price_lista_4' => 'required|numeric',
            'image' => 'nullable|sometimes|file',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image'] = $imagePath;
        }

        SubProducto::create($data);

        return redirect()->back()->with('success', 'Subproducto creado correctamente.');
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
            'price_lista_4' => 'required|numeric',
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

                $productNameToIds[$key][] = (int) $producto->id;
            }

            $seenCodes = [];

            foreach ($rows as $index => $row) {
                if ($index === 1) {
                    continue;
                }

                $summary['total_rows']++;
                $rowNumber = $index;
                $mappedRow = $this->mapSubproductosRow($row, $headerMapping);

                if ($this->isSubproductosRowEmpty($mappedRow)) {
                    $summary['omitted']++;
                    continue;
                }

                $normalizedCode = $this->normalizeSubproductoCode($mappedRow['code'] ?? null);
                if ($normalizedCode === null) {
                    $summary['errors'][] = [
                        'fila' => $rowNumber,
                        'code' => null,
                        'motivo' => 'La fila no tiene código de subproducto.',
                    ];
                    $summary['omitted']++;
                    continue;
                }

                if (isset($seenCodes[$normalizedCode])) {
                    $summary['errors'][] = [
                        'fila' => $rowNumber,
                        'code' => $normalizedCode,
                        'motivo' => 'Código repetido dentro del mismo archivo.',
                    ];
                    $summary['omitted']++;
                    continue;
                }
                $seenCodes[$normalizedCode] = true;

                $resolvedProductoId = $this->resolveSubproductoProductoId($mappedRow['producto_id'] ?? null, $productNameToIds);
                if ($resolvedProductoId === null) {
                    $summary['errors'][] = [
                        'fila' => $rowNumber,
                        'code' => $normalizedCode,
                        'motivo' => 'No se pudo resolver el producto asociado.',
                    ];
                    $summary['omitted']++;
                    continue;
                }

                $description = $this->normalizeExcelText($mappedRow['description'] ?? null);
                if ($description === '') {
                    $summary['errors'][] = [
                        'fila' => $rowNumber,
                        'code' => $normalizedCode,
                        'motivo' => 'La fila no tiene descripción.',
                    ];
                    $summary['omitted']++;
                    continue;
                }

                $payload = [
                    'producto_id' => $resolvedProductoId,
                    'code' => $normalizedCode,
                    'description' => $description,
                    'medida' => $this->nullableNormalizedExcelText($mappedRow['medida'] ?? null),
                    'componente' => $this->nullableNormalizedExcelText($mappedRow['componente'] ?? null),
                    'caracteristicas' => $this->nullableNormalizedExcelText($mappedRow['caracteristicas'] ?? null),
                    'price_mayorista' => $this->normalizeOptionalNumeric($mappedRow['price_mayorista'] ?? null),
                    'price_minorista' => $this->normalizeOptionalNumeric($mappedRow['price_minorista'] ?? null),
                    'price_dist' => $this->normalizeOptionalNumeric($mappedRow['price_dist'] ?? null),
                    'price_lista_4' => $this->normalizeOptionalNumeric($mappedRow['price_lista_4'] ?? null) ?? 0,
                    'order' => $this->normalizeOptionalNumeric($mappedRow['order'] ?? null),
                ];

                $subProducto = SubProducto::where('code', $normalizedCode)->first();

                if ($subProducto) {
                    $subProducto->fill($payload);
                    if ($subProducto->isDirty()) {
                        $subProducto->save();
                        $summary['updated']++;
                    } else {
                        $summary['omitted']++;
                    }
                } else {
                    SubProducto::create($payload);
                    $summary['created']++;
                }
            }
        } catch (Throwable $e) {
            $summary['errors'][] = [
                'fila' => null,
                'code' => null,
                'motivo' => 'Error al procesar el archivo: ' . $e->getMessage(),
            ];
        }

        return redirect()->back()->with('mass_upload_subproductos_summary', $summary);
    }

    public function descargarPlantillaSubproductos()
    {
        $headers = [
            'CODIGO SUBPRODUCTO',
            'NOMBRE PRODUCTO',
            'DESCRIPCION',
            'MEDIDA',
            'COMPONENTE',
            'CARACTERISTICAS',
            'LISTA 1',
            'LISTA 2',
            'LISTA 3',
            'LISTA 4',
            'ORDEN',
        ];

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Subproductos');

        foreach ($headers as $index => $header) {
            $column = Coordinate::stringFromColumnIndex($index + 1);
            $sheet->setCellValue($column . '1', $header);
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $headerRange = 'A1:' . Coordinate::stringFromColumnIndex(count($headers)) . '1';
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => ['rgb' => 'F97316'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'D1D5DB'],
                ],
            ],
        ]);

        $sheet->freezePane('A2');

        $writer = new Xlsx($spreadsheet);
        $filename = 'plantilla_subproductos.xlsx';

        return new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    private function resolveSubproductosHeaderMapping(array $headerRow): array
    {
        $knownHeaders = [
            'code' => ['codigo subproducto', 'codigo', 'cod subproducto', 'cod'],
            'producto_id' => ['nombre producto', 'producto', 'nombre', 'producto id'],
            'description' => ['descripcion', 'descripción'],
            'medida' => ['medida'],
            'componente' => ['componente'],
            'caracteristicas' => ['caracteristicas', 'características'],
            'price_mayorista' => ['lista 1', 'precio mayorista', 'mayorista'],
            'price_minorista' => ['lista 2', 'precio minorista', 'minorista'],
            'price_dist' => ['lista 3', 'precio distribuidor', 'precio distribucion', 'distribuidor', 'distribucion'],
            'price_lista_4' => ['lista 4', 'precio lista 4'],
            'order' => ['orden', 'order'],
        ];

        $mapping = [];

        foreach ($headerRow as $column => $header) {
            $normalizedHeader = $this->normalizeExcelText((string) $header);
            if ($normalizedHeader === '') {
                continue;
            }

            foreach ($knownHeaders as $field => $aliases) {
                foreach ($aliases as $alias) {
                    if ($normalizedHeader === $this->normalizeExcelText($alias)) {
                        $mapping[$field] = $column;
                        break 2;
                    }
                }
            }
        }

        return $mapping;
    }

    private function humanSubproductosHeaderLabel(string $field): string
    {
        return match ($field) {
            'code' => 'CODIGO SUBPRODUCTO',
            'producto_id' => 'NOMBRE PRODUCTO',
            'description' => 'DESCRIPCION',
            'medida' => 'MEDIDA',
            'componente' => 'COMPONENTE',
            'caracteristicas' => 'CARACTERISTICAS',
            'price_mayorista' => 'LISTA 1',
            'price_minorista' => 'LISTA 2',
            'price_dist' => 'LISTA 3',
            'price_lista_4' => 'LISTA 4',
            'order' => 'ORDEN',
            default => strtoupper($field),
        };
    }

    private function mapSubproductosRow(array $row, array $mapping): array
    {
        $mapped = [];
        foreach ($mapping as $field => $column) {
            $mapped[$field] = $row[$column] ?? null;
        }

        return $mapped;
    }

    private function isSubproductosRowEmpty(array $row): bool
    {
        foreach ($row as $value) {
            if ($this->normalizeExcelText($value) !== '') {
                return false;
            }
        }

        return true;
    }

    private function normalizeSubproductoCode($value): ?string
    {
        $code = $this->normalizeExcelText($value);
        return $code === '' ? null : $code;
    }

    private function resolveSubproductoProductoId($value, array $productNameToIds): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            $productId = (int) $value;
            return Producto::whereKey($productId)->exists() ? $productId : null;
        }

        $normalizedName = $this->normalizeExcelText((string) $value);
        if ($normalizedName === '') {
            return null;
        }

        $ids = $productNameToIds[$normalizedName] ?? null;
        if (!$ids || count($ids) !== 1) {
            return null;
        }

        return $ids[0];
    }

    private function normalizeExcelText($value): string
    {
        if ($value === null) {
            return '';
        }

        $text = trim((string) $value);
        if ($text === '') {
            return '';
        }

        $ascii = Str::of($text)->ascii()->lower()->toString();
        $ascii = preg_replace('/\s+/', ' ', $ascii) ?? $ascii;

        return trim($ascii);
    }

    private function nullableNormalizedExcelText($value): ?string
    {
        $text = trim((string) ($value ?? ''));
        return $text === '' ? null : $text;
    }

    private function normalizeOptionalNumeric($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_string($value)) {
            $normalized = str_replace(['.', ','], ['', '.'], $value);
            if (is_numeric($normalized)) {
                return (float) $normalized;
            }
        }

        return is_numeric($value) ? (float) $value : null;
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
            'price_mayorista' => 'Lista 1',
            'price_minorista' => 'Lista 2',
            'price_dist' => 'Lista 3',
            'price_lista_4' => 'Lista 4',
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
