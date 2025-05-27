<?php

namespace App\Jobs;

use App\Models\Categoria;
use App\Models\GrupoDeProductos;
use App\Models\ImageGrupo;
use App\Models\Productos;
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

    protected $archivoPath;

    public function __construct($archivoPath)
    {
        $this->archivoPath = $archivoPath;
    }

    public function handle()
    {
        $filePath = Storage::path($this->archivoPath);
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $index => $row) {

            if ($index === 0) continue;

            $codigo = trim($row[0]);
            $price_mayorista = trim($row[3]);
            $price_minorista = trim($row[4]);
            $price_dist = trim($row[5]);

            $subproducto = SubProducto::where('code', $codigo)->first();

            if ($subproducto) {
                $subproducto->update([
                    'price_mayorista' => $price_mayorista,
                    'price_minorista' => $price_minorista,
                    'price_dist' => $price_dist,
                ]);
            }
        }
    }
}
