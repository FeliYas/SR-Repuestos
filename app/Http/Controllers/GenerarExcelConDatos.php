<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\SubProducto;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class GenerarExcelConDatos extends Controller
{
    public function actualizarExcelMaestro()
    {
        $nombreArchivo = 'productos.xlsx';
        $rutaCompleta = storage_path('app/public/archivos/' . $nombreArchivo);

        // Crear directorio si no existe
        if (!file_exists(dirname($rutaCompleta))) {
            mkdir(dirname($rutaCompleta), 0755, true);
        }

        $spreadsheet = null;

        // Verificar si el archivo ya existe
        if (file_exists($rutaCompleta)) {
            // Cargar el Excel existente
            $spreadsheet = IOFactory::load($rutaCompleta);
            $sheet = $spreadsheet->getActiveSheet();

            // Encontrar la siguiente fila vacía
            $ultimaFila = $sheet->getHighestRow();
            $siguienteFila = $ultimaFila + 1;
        } else {
            // Crear nuevo Excel si no existe
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Productos');

            // Crear encabezados
            $this->crearEncabezados($sheet);
            $siguienteFila = 2; // Primera fila de datos después de encabezados
        }

        // Agregar los productos del nuevo pedido
        $subproductos = SubProducto::with('producto.marca')->get();

        foreach ($subproductos as $subproducto) {
            $this->agregarFilaPedido($sheet, $siguienteFila, $subproducto);
            $siguienteFila++;
        }

        // Autoajustar columnas
        foreach (range('A', 'Q') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Guardar el archivo actualizado
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save($rutaCompleta);

        // Limpiar memoria
        $spreadsheet->disconnectWorksheets();
        unset($spreadsheet);

        return $nombreArchivo;
    }

    public function crearEncabezados($sheet)
    {
        $encabezados = [
            'A1' => 'SUPER CODIGO',
            'B1' => 'CODIGO',
            'C1' => 'NOMBRE',
            'D1' => 'DESCRIPCIÓN',
            'E1' => 'MEDIDA',
            'F1' => 'PRECIO LISTA 1',
            'G1' => 'PRECIO LISTA 2',
            'H1' => 'PRECIO LISTA 3',
            'I1' => 'MARCA',
            'J1' => 'COMPONENTE',
            'K1' => 'CARACTERISTICAS',
            'L1' => 'APLICACIÓN',
            'M1' => 'AÑO',
            'N1' => 'Nº ORIGINAL',
            'O1' => 'TONELAJE',
            'P1' => 'ESPIGÓN',
            'Q1' => 'BUJES',

        ];

        // Establecer encabezados
        foreach ($encabezados as $celda => $valor) {
            $sheet->setCellValue($celda, $valor);
        }

        // Estilo para encabezados
        $sheet->getStyle('A1:Q1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => ['rgb' => '4472C4']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);
    }

    public function agregarFilaPedido($sheet, $fila, $subproducto)
    {
        $sheet->setCellValue('A' . $fila, $subproducto->producto->code);
        $sheet->setCellValue('B' . $fila, $subproducto->code);
        $sheet->setCellValue('C' . $fila, $subproducto->producto->name ?? 'no disponible');
        $sheet->setCellValue('D' . $fila, $subproducto->description ?? 'Sin descripción');
        $sheet->setCellValue('E' . $fila, $subproducto->medida ?? 'Medida no disponible');
        $sheet->setCellValue('F' . $fila, $subproducto->price_mayorista ? '$' . number_format($subproducto->price_mayorista, 2) : 'Sin precio');
        $sheet->setCellValue('G' . $fila, $subproducto->price_minorista ? '$' . number_format($subproducto->price_minorista, 2) : 'Sin precio');
        $sheet->setCellValue('H' . $fila, $subproducto->price_dist ? '$' . number_format($subproducto->price_dist, 2) : 'Sin precio');
        $sheet->setCellValue('I' . $fila, $subproducto->producto->marca->name ?? 'Sin marca');
        $sheet->setCellValue('J' . $fila, $subproducto->componente ?? 'Sin componente');
        $sheet->setCellValue('K' . $fila, $subproducto->caracteristicas ?? 'Sin características');
        $sheet->setCellValue('L' . $fila, $subproducto->producto->aplicacion ?? 'Sin aplicación');
        $sheet->setCellValue('M' . $fila, $subproducto->producto->anio ?? 'Sin año');
        $sheet->setCellValue('N' . $fila, $subproducto->producto->num_original ?? 'Sin número original');
        $sheet->setCellValue('O' . $fila, $subproducto->producto->tonelaje ?? 'Sin tonelaje');
        $sheet->setCellValue('P' . $fila, $subproducto->producto->espigon ?? 'Sin espigón');
        $sheet->setCellValue('Q' . $fila, $subproducto->producto->bujes ?? 'Sin bujes');


        // Aplicar bordes a la nueva fila
        $sheet->getStyle('A' . $fila . ':Q' . $fila)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);
    }
}
