<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Producto;
use App\Models\MarcaProducto;
use App\Models\SubProducto;
use App\Services\ProductSearchService;
use DragonCode\Support\Facades\Filesystem\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
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
    private const MAX_SUBPRODUCT_PRICE = 99999999.99;
    private const SUBPRODUCT_IMPORT_REPORT_DIRECTORY = 'import-reports/subproductos';
    private const SUBPRODUCT_IMPORT_REPORT_TTL_HOURS = 24;
    private const SUBPRODUCT_IMPORT_ERROR_PREVIEW_LIMIT = 50;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ProductSearchService $searchService)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
        ]);

        $productos = Producto::select('id', 'name', 'categoria_id')
            ->with(['categoria' => function ($query) {
                $query->select('id', 'name');
            }])
            ->alphabetical()
            ->get();

        $perPage = $request->input('per_page', 10);

        $query = SubProducto::with([
            'producto' => function ($query) {
                $query->select('id', 'name', 'marca_id')
                    ->with(['marca' => function ($q) {
                        $q->select('id', 'name');
                    }]);
            }
        ])->alphabetical();

        $searchService->applyToSubproducts($query, $filters['search'] ?? null);

        $subProductos = $query->paginate($perPage);

        return inertia('admin/subProductosAdmin', [
            'subProductos' => $subProductos,
            'productos' => $productos,
        ]);
    }

    public function indexPrivada(Request $request, ProductSearchService $searchService)
    {
        $filters = $request->validate([
            'per_page' => ['nullable', 'integer', 'between:1,100'],
            'categoria' => ['nullable', 'integer', 'exists:categorias,id'],
            'marca' => ['nullable', 'integer', 'exists:marca_productos,id'],
            'codigo' => ['nullable', 'string', 'max:120'],
        ]);
        $perPage = $filters['per_page'] ?? 10;
        $categoria = $filters['categoria'] ?? null;
        $marca = $filters['marca'] ?? null;
        $codigo = trim((string) ($filters['codigo'] ?? ''));

        $marcas = MarcaProducto::select('id', 'name')->alphabetical()->get();
        $categorias = Categoria::select('id', 'name')->alphabetical()->get();

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
        ])->alphabetical();

        $searchService->applyToSubproducts($query, $codigo);

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
            'unchanged' => 0,
            'rejected' => 0,
            'errors' => [],
            'error_counts' => [],
            'error_report_token' => null,
        ];
        $reportErrors = [];

        try {
            $spreadsheet = IOFactory::load($request->file('archivo')->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);

            $headerRow = $rows[1] ?? [];
            $headerMapping = $this->resolveSubproductosHeaderMapping($headerRow);

            $requiredFields = ['code', 'producto_id', 'description'];
            $missingFields = array_values(array_diff($requiredFields, array_keys($headerMapping)));

            if (!empty($missingFields)) {
                $this->recordSubproductoImportError($summary, $reportErrors, [
                    'fila' => 1,
                    'code' => null,
                    'producto' => null,
                    'descripcion' => null,
                    'motivo' => 'Faltan columnas obligatorias: ' . implode(', ', array_map(fn(string $field) => $this->humanSubproductosHeaderLabel($field), $missingFields)),
                ]);

                $this->attachSubproductoImportErrorReport($request, $summary, $reportErrors);
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
                    $this->recordSubproductoImportError($summary, $reportErrors, $this->subproductoImportError($rowNumber, null, $mappedRow, 'La fila está vacía.'));
                    continue;
                }

                $code = $this->formatSubproductoCode($mappedRow['code'] ?? null);
                $normalizedCode = $code === null ? null : $this->normalizeExcelText($code);
                if ($normalizedCode === null) {
                    $this->recordSubproductoImportError($summary, $reportErrors, $this->subproductoImportError($rowNumber, null, $mappedRow, 'La fila no tiene código de subproducto.'));
                    continue;
                }

                if (isset($seenCodes[$normalizedCode])) {
                    $this->recordSubproductoImportError($summary, $reportErrors, $this->subproductoImportError($rowNumber, $code, $mappedRow, 'Código repetido dentro del mismo archivo.'));
                    continue;
                }
                $seenCodes[$normalizedCode] = true;

                $productoResolution = $this->resolveSubproductoProductoId($mappedRow['producto_id'] ?? null, $productNameToIds);
                if ($productoResolution['status'] !== 'resolved') {
                    $productName = trim((string) ($mappedRow['producto_id'] ?? ''));
                    $reason = $productoResolution['status'] === 'ambiguous'
                        ? sprintf('Se encontraron %d productos con el nombre "%s" (IDs: %s).', count($productoResolution['ids']), $productName, implode(', ', $productoResolution['ids']))
                        : sprintf('No existe un producto con el nombre o ID "%s".', $productName);

                    $this->recordSubproductoImportError($summary, $reportErrors, $this->subproductoImportError($rowNumber, $code, $mappedRow, $reason));
                    continue;
                }

                $description = $this->uppercaseSubproductoDescription($mappedRow['description'] ?? null);
                if ($description === '') {
                    $this->recordSubproductoImportError($summary, $reportErrors, $this->subproductoImportError($rowNumber, $code, $mappedRow, 'La fila no tiene descripción.'));
                    continue;
                }

                $payload = [
                    'producto_id' => $productoResolution['id'],
                    'code' => $code,
                    'description' => $description,
                ];

                $optionalPayload = [
                    'medida' => $this->nullableNormalizedExcelText($mappedRow['medida'] ?? null),
                    'componente' => $this->nullableNormalizedExcelText($mappedRow['componente'] ?? null),
                    'caracteristicas' => $this->nullableNormalizedExcelText($mappedRow['caracteristicas'] ?? null),
                    'price_mayorista' => $this->formatOptionalPriceForStorage($mappedRow['price_mayorista'] ?? null),
                    'price_minorista' => $this->formatOptionalPriceForStorage($mappedRow['price_minorista'] ?? null),
                    'price_dist' => $this->formatOptionalPriceForStorage($mappedRow['price_dist'] ?? null),
                    'price_lista_4' => $this->formatOptionalPriceForStorage($mappedRow['price_lista_4'] ?? null),
                ];

                foreach ($optionalPayload as $field => $value) {
                    if ($value !== null) {
                        $payload[$field] = $value;
                    }
                }

                $subProducto = SubProducto::whereRaw('LOWER(code) = ?', [$normalizedCode])->first();

                if ($subProducto) {
                    $subProducto->fill($payload);
                    if ($this->subproductoHasMeaningfulChanges($subProducto)) {
                        $subProducto->save();
                        $summary['updated']++;
                    } else {
                        $summary['unchanged']++;
                    }
                } else {
                    SubProducto::create($payload);
                    $summary['created']++;
                }
            }
        } catch (Throwable $e) {
            $this->recordSubproductoImportError($summary, $reportErrors, [
                'fila' => null,
                'code' => null,
                'producto' => null,
                'descripcion' => null,
                'motivo' => 'Error al procesar el archivo: ' . $e->getMessage(),
            ]);
        }

        $this->attachSubproductoImportErrorReport($request, $summary, $reportErrors);
        return redirect()->back()->with('mass_upload_subproductos_summary', $summary);
    }

    public function descargarErroresImportacionSubproductos(Request $request, string $reportToken): StreamedResponse
    {
        $report = $request->session()->get('subproducto_import_reports.' . $reportToken);
        $admin = $request->user('admin');

        abort_unless(
            is_array($report)
                && ($report['admin_id'] ?? null) === $admin?->id
                && ($report['expires_at'] ?? 0) >= now()->timestamp
                && Storage::disk('local')->exists($report['path'] ?? ''),
            404,
        );

        return response()->streamDownload(
            fn () => print(Storage::disk('local')->get($report['path'])),
            'errores_importacion_subproductos.csv',
            ['Content-Type' => 'text/csv; charset=UTF-8'],
        );
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

    private function formatSubproductoCode($value): ?string
    {
        $code = trim((string) ($value ?? ''));

        return $code === '' ? null : Str::upper($code);
    }

    private function resolveSubproductoProductoId($value, array $productNameToIds): array
    {
        if ($value === null || $value === '') {
            return ['status' => 'missing', 'id' => null, 'ids' => []];
        }

        if (is_numeric($value)) {
            $productId = (int) $value;
            return Producto::whereKey($productId)->exists()
                ? ['status' => 'resolved', 'id' => $productId, 'ids' => [$productId]]
                : ['status' => 'missing', 'id' => null, 'ids' => []];
        }

        $normalizedName = $this->normalizeExcelText((string) $value);
        if ($normalizedName === '') {
            return ['status' => 'missing', 'id' => null, 'ids' => []];
        }

        $ids = $productNameToIds[$normalizedName] ?? null;
        if (!$ids) {
            return ['status' => 'missing', 'id' => null, 'ids' => []];
        }

        if (count($ids) !== 1) {
            return ['status' => 'ambiguous', 'id' => null, 'ids' => $ids];
        }

        return ['status' => 'resolved', 'id' => $ids[0], 'ids' => $ids];
    }

    private function subproductoImportError(int|null $rowNumber, ?string $code, array $row, string $reason): array
    {
        return [
            'fila' => $rowNumber,
            'code' => $code,
            'producto' => trim((string) ($row['producto_id'] ?? '')) ?: null,
            'descripcion' => trim((string) ($row['description'] ?? '')) ?: null,
            'motivo' => $reason,
        ];
    }

    private function recordSubproductoImportError(array &$summary, array &$reportErrors, array $error): void
    {
        $summary['rejected']++;
        $summary['error_counts'][$error['motivo']] = ($summary['error_counts'][$error['motivo']] ?? 0) + 1;
        $reportErrors[] = $error;

        if (count($summary['errors']) < self::SUBPRODUCT_IMPORT_ERROR_PREVIEW_LIMIT) {
            $summary['errors'][] = $error;
        }
    }

    private function attachSubproductoImportErrorReport(Request $request, array &$summary, array $reportErrors): void
    {
        if ($reportErrors === []) {
            return;
        }

        $disk = Storage::disk('local');
        $directory = self::SUBPRODUCT_IMPORT_REPORT_DIRECTORY;
        $expiration = now()->subHours(self::SUBPRODUCT_IMPORT_REPORT_TTL_HOURS)->timestamp;

        foreach ($disk->allFiles($directory) as $path) {
            if ($disk->lastModified($path) < $expiration) {
                $disk->delete($path);
            }
        }

        $admin = $request->user('admin');
        $token = (string) Str::uuid();
        $path = sprintf('%s/%d/%s.csv', $directory, $admin->id, $token);
        $stream = fopen('php://temp', 'r+');
        fwrite($stream, "\xEF\xBB\xBF");
        fputcsv($stream, ['Fila', 'Código', 'Producto', 'Descripción', 'Motivo']);

        foreach ($reportErrors as $error) {
            fputcsv($stream, [
                $error['fila'] ?? '',
                $error['code'] ?? '',
                $error['producto'] ?? '',
                $error['descripcion'] ?? '',
                $error['motivo'],
            ]);
        }

        rewind($stream);
        $disk->put($path, stream_get_contents($stream));
        fclose($stream);

        $request->session()->put('subproducto_import_reports.' . $token, [
            'admin_id' => $admin->id,
            'path' => $path,
            'expires_at' => now()->addHours(self::SUBPRODUCT_IMPORT_REPORT_TTL_HOURS)->timestamp,
        ]);
        $summary['error_report_token'] = $token;
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

    private function uppercaseSubproductoDescription($value): string
    {
        $description = trim((string) ($value ?? ''));
        $description = preg_replace('/\s+/', ' ', $description) ?? $description;

        return Str::upper($description);
    }

    private function normalizeOptionalNumeric($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_string($value)) {
            $number = preg_replace('/[^0-9,.\-]/', '', trim($value));
            if ($number === null || $number === '' || $number === '-') {
                return null;
            }

            $lastDot = strrpos($number, '.');
            $lastComma = strrpos($number, ',');

            if ($lastDot !== false && $lastComma !== false) {
                if ($lastDot > $lastComma) {
                    $number = str_replace(',', '', $number);
                } else {
                    $number = str_replace(['.', ','], ['', '.'], $number);
                }
            } elseif ($lastDot !== false || $lastComma !== false) {
                $separator = $lastDot !== false ? '.' : ',';
                $lastSeparator = $lastDot !== false ? $lastDot : $lastComma;
                $decimalDigits = strlen($number) - $lastSeparator - 1;

                $number = $decimalDigits <= 2
                    ? str_replace($separator, '.', $number)
                    : str_replace($separator, '', $number);
            }

            $value = $number;
        }

        if (! is_numeric($value)) {
            return null;
        }

        $number = (float) $value;

        return abs($number) > self::MAX_SUBPRODUCT_PRICE && abs($number / 100) <= self::MAX_SUBPRODUCT_PRICE
            ? $number / 100
            : $number;
    }

    private function formatOptionalPriceForStorage($value): ?string
    {
        $price = $this->normalizeOptionalNumeric($value);

        return $price === null ? null : number_format($price, 2, '.', '');
    }

    private function subproductoHasMeaningfulChanges(SubProducto $subProducto): bool
    {
        $dirty = $subProducto->getDirty();

        foreach (['price_mayorista', 'price_minorista', 'price_dist', 'price_lista_4'] as $field) {
            if (!array_key_exists($field, $dirty)) {
                continue;
            }

            $original = $subProducto->getRawOriginal($field);
            $current = $subProducto->getAttribute($field);

            if ($original !== null && $current !== null && number_format((float) $original, 2, '.', '') === number_format((float) $current, 2, '.', '')) {
                unset($dirty[$field]);
            }
        }

        return $dirty !== [];
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
            ->alphabetical()
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
