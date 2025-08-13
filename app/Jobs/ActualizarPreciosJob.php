<?php

namespace App\Jobs;

use App\Models\MarcaProducto;
use App\Models\Producto;
use App\Models\SubProducto;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ActualizarPreciosJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $archivoPath;

    // Frases “placeholder” por campo (en minúsculas para comparar case-insensitive)
    protected array $placeholders = [
        'descripcion'     => ['sin descripción'],
        'medida'          => ['medida no disponible'],
        'marca'           => ['sin marca'],
        'componente'      => ['sin componente'],
        'caracteristicas' => ['sin características'],
        'aplicacion'      => ['sin aplicación'],
        'anio'            => ['sin año'],
        'num_original'    => ['sin número original'],
        'tonelaje'        => ['sin tonelaje'],
        'espigon'         => ['sin espigón'],
        'buje'            => ['sin bujes'],
    ];

    public function __construct(string $archivoPath)
    {
        $this->archivoPath = $archivoPath;
    }

    public function handle()
    {
        $filePath = Storage::path($this->archivoPath);
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();

        // Queremos índices numéricos (0,1,2,...) NO referencias de celda ("A","B"...)
        // toArray(nullValue=null, calculateFormulas=true, formatData=false, returnCellRef=false)
        $rows = $sheet->toArray(null, true, false, false);

        foreach ($rows as $index => $row) {
            if ($index === 0) continue; // saltar encabezado

            // Mapea columnas (ajusta si tu Excel cambia el orden)
            $super_codigo   = trim((string)($row[0]  ?? ''));
            $codigo         = trim((string)($row[1]  ?? ''));
            $nombre         = trim((string)($row[2]  ?? ''));
            $descripcion    = trim((string)($row[3]  ?? ''));
            $medida         = trim((string)($row[4]  ?? ''));
            $precio_lista1  = $row[5] ?? null;
            $precio_lista2  = $row[6] ?? null;
            $precio_lista3  = $row[7] ?? null;
            $marca          = trim((string)($row[8]  ?? ''));
            $componente     = trim((string)($row[9]  ?? ''));
            $caracteristicas = trim((string)($row[10] ?? ''));
            $aplicacion     = trim((string)($row[11] ?? ''));
            $anio           = trim((string)($row[12] ?? ''));
            $num_original   = trim((string)($row[13] ?? ''));
            $tonelaje       = trim((string)($row[14] ?? ''));
            $espigon        = trim((string)($row[15] ?? ''));
            $buje           = trim((string)($row[16] ?? ''));

            if ($super_codigo === '') {
                // Sin código maestro, no podemos identificar el producto
                continue;
            }

            // 1) Producto: crear si no existe, y luego actualizar SOLO campos válidos
            $producto = Producto::firstOrCreate(['code' => $super_codigo]);

            $productoUpdates = [];

            // name (no tiene placeholder definido; solo evita vacío)
            if ($this->cleanOrNull($nombre, []) !== null) {
                $productoUpdates['name'] = $nombre;
            }

            // marca: si es válida, resolvemos marca_id; si no, NO tocamos marca_id
            $marcaLimpia = $this->cleanOrNull($marca, $this->placeholders['marca']);
            if ($marcaLimpia !== null) {
                $marcaModel = MarcaProducto::firstOrCreate(['name' => $marcaLimpia]);
                $productoUpdates['marca_id'] = $marcaModel->id;
            }

            if (($v = $this->cleanOrNull($aplicacion,  $this->placeholders['aplicacion']))  !== null) $productoUpdates['aplicacion']  = $v;
            if (($v = $this->cleanOrNull($anio,        $this->placeholders['anio']))        !== null) $productoUpdates['anio']        = $v;
            if (($v = $this->cleanOrNull($num_original, $this->placeholders['num_original'])) !== null) $productoUpdates['num_original'] = $v;
            if (($v = $this->cleanOrNull($tonelaje,    $this->placeholders['tonelaje']))    !== null) $productoUpdates['tonelaje']    = $v;
            if (($v = $this->cleanOrNull($espigon,     $this->placeholders['espigon']))     !== null) $productoUpdates['espigon']     = $v;
            if (($v = $this->cleanOrNull($buje,        $this->placeholders['buje']))        !== null) $productoUpdates['buje']        = $v;

            if (!empty($productoUpdates)) {
                $producto->fill($productoUpdates)->save();
            }

            // 2) SubProducto: crear si no existe, y actualizar SOLO campos válidos
            if ($codigo === '') {
                // Sin código de subproducto no lo creamos/actualizamos
                continue;
            }

            $subProducto = SubProducto::firstOrCreate([
                'producto_id' => $producto->id,
                'code'        => $codigo,
            ]);

            $subUpdates = [];

            if (($v = $this->parsePrice($precio_lista1)) !== null) $subUpdates['price_mayorista'] = $v;
            if (($v = $this->parsePrice($precio_lista2)) !== null) $subUpdates['price_minorista'] = $v;
            if (($v = $this->parsePrice($precio_lista3)) !== null) $subUpdates['price_dist']      = $v;

            if (($v = $this->cleanOrNull($descripcion,    $this->placeholders['descripcion']))    !== null) $subUpdates['description']     = $v;
            if (($v = $this->cleanOrNull($componente,     $this->placeholders['componente']))     !== null) $subUpdates['componente']      = $v;
            if (($v = $this->cleanOrNull($caracteristicas, $this->placeholders['caracteristicas'])) !== null) $subUpdates['caracteristicas']  = $v;
            if (($v = $this->cleanOrNull($medida,         $this->placeholders['medida']))         !== null) $subUpdates['medida']          = $v;

            // precios: solo si son numéricos
            if (is_numeric($precio_lista1)) $subUpdates['price_mayorista'] = (float)$precio_lista1;
            if (is_numeric($precio_lista2)) $subUpdates['price_minorista'] = (float)$precio_lista2;
            if (is_numeric($precio_lista3)) $subUpdates['price_dist']      = (float)$precio_lista3;

            if (!empty($subUpdates)) {
                $subProducto->fill($subUpdates)->save();
            }
        }
    }

    protected function parsePrice($value): ?float
    {
        if ($value === null) return null;

        // A texto, limpiamos símbolos no numéricos salvo , . y -
        $s = (string)$value;
        $s = trim($s);
        if ($s === '') return null;

        // Quita todo lo que no sea dígito, coma, punto o signo -
        $s = preg_replace('/[^0-9,.\-]/u', '', $s);
        if ($s === '' || $s === '-' || $s === '-.' || $s === '-,') return null;

        // Ubicamos últimos separadores
        $lastDot   = strrpos($s, '.');
        $lastComma = strrpos($s, ',');

        // Determinamos separador decimal
        $decimalSep = null;
        if ($lastDot !== false && $lastComma !== false) {
            // Tomamos el que esté más a la derecha
            $decimalSep = ($lastDot > $lastComma) ? '.' : ',';
        } elseif ($lastDot !== false || $lastComma !== false) {
            $sep   = ($lastDot !== false) ? '.' : ',';
            $pos   = ($lastDot !== false) ? $lastDot : $lastComma;
            $right = substr($s, $pos + 1);
            // Si a la derecha hay 1–3 dígitos, asumimos decimal; si no, es miles
            if ($right !== '' && ctype_digit($right) && strlen($right) >= 1 && strlen($right) <= 3) {
                $decimalSep = $sep;
            }
        }

        // Armamos un número "limpio":
        // 1) eliminamos todos los separadores que NO son el decimal
        $tmp = $s;
        if ($decimalSep === '.') {
            $tmp = str_replace(',', '', $tmp); // coma como miles
        } elseif ($decimalSep === ',') {
            $tmp = str_replace('.', '', $tmp); // punto como miles
        } else {
            // Sin separador decimal: quitamos todos los , y . como miles
            $tmp = str_replace([',', '.'], '', $tmp);
        }

        // 2) reemplazamos el separador decimal por punto
        if ($decimalSep !== null && $decimalSep !== '.') {
            $tmp = str_replace($decimalSep, '.', $tmp);
        }

        // Validamos forma final: opcional -, dígitos, opcional .dígitos
        if (!preg_match('/^-?\d+(\.\d+)?$/', $tmp)) {
            return null;
        }

        return (float)$tmp;
    }

    /**
     * Devuelve el valor limpio si es válido; si está vacío o coincide con
     * algún placeholder (case-insensitive), devuelve null para "no actualizar".
     */
    protected function cleanOrNull(?string $value, array $placeholders): ?string
    {
        $v = trim((string) $value);
        if ($v === '') return null;

        $lv = mb_strtolower($v, 'UTF-8');
        foreach ($placeholders as $p) {
            if ($lv === mb_strtolower($p, 'UTF-8')) {
                return null;
            }
        }
        return $v;
    }
}
