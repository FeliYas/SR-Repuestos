import { useForm, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard';

type MassUploadError = {
    fila: number | null;
    code: string | null;
    motivo: string;
};

type MassUploadSummary = {
    total_rows: number;
    created: number;
    updated: number;
    omitted: number;
    errors: MassUploadError[];
};

export default function CargaMasivaSubproductos() {
    const { flash } = usePage().props as {
        flash?: {
            mass_upload_subproductos_summary?: MassUploadSummary;
        };
    };

    const summary = flash?.mass_upload_subproductos_summary;

    const { data, setData, post, processing, reset } = useForm<{
        archivo: File | null;
    }>({
        archivo: null,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(route('admin.cargamasiva.subproductos.import'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Importación finalizada.');
                reset('archivo');
            },
            onError: () => {
                toast.error('No se pudo importar el archivo.');
            },
        });
    };

    return (
        <Dashboard>
            <div className="flex w-full flex-col gap-6 p-6">
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 pb-1 text-2xl">Carga masiva de subproductos</h2>

                <div className="rounded-md border border-gray-300 bg-white p-4">
                    <h3 className="mb-3 text-lg font-semibold">Guía rápida del Excel</h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm text-gray-700">
                        <li>La primera fila debe ser de encabezados.</li>
                        <li>Columnas obligatorias: Código, Producto y Descripción.</li>
                        <li>Columnas opcionales: Medida, Componente, Características, Lista 1, Lista 2, Lista 3, Lista 4 y Orden.</li>
                        <li>El orden de columnas no importa: se reconocen por nombre normalizado (trim, minúsculas y sin acentos).</li>
                        <li>Producto debe existir previamente en la base de datos (se busca por nombre exacto normalizado).</li>
                        <li>Si el código ya existe, se actualiza solo con los campos que traen valor en el Excel.</li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="rounded-md border border-gray-300 bg-white p-4">
                    <h3 className="mb-3 text-lg font-semibold">Subir archivo</h3>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(event) => setData('archivo', event.target.files?.[0] ?? null)}
                            className="file:border-primary-orange file:text-primary-orange hover:file:bg-primary-orange file:cursor-pointer file:rounded-md file:border file:px-2 file:py-1 file:transition file:duration-300 hover:file:text-white"
                        />

                        <button
                            type="submit"
                            disabled={processing || !data.archivo}
                            className="bg-primary-orange disabled:bg-primary-orange/60 rounded px-4 py-2 font-bold text-white"
                        >
                            {processing ? 'Procesando...' : 'Importar subproductos'}
                        </button>
                    </div>
                </form>

                {summary && (
                    <div className="rounded-md border border-gray-300 bg-white p-4">
                        <h3 className="mb-3 text-lg font-semibold">Resumen de importación</h3>

                        <div className="grid gap-3 md:grid-cols-4">
                            <div className="rounded border p-3 text-center">
                                <p className="text-xs uppercase text-gray-500">Filas leídas</p>
                                <p className="text-xl font-bold">{summary.total_rows}</p>
                            </div>
                            <div className="rounded border p-3 text-center">
                                <p className="text-xs uppercase text-gray-500">Creados</p>
                                <p className="text-xl font-bold text-green-600">{summary.created}</p>
                            </div>
                            <div className="rounded border p-3 text-center">
                                <p className="text-xs uppercase text-gray-500">Actualizados</p>
                                <p className="text-xl font-bold text-blue-600">{summary.updated}</p>
                            </div>
                            <div className="rounded border p-3 text-center">
                                <p className="text-xs uppercase text-gray-500">Omitidos</p>
                                <p className="text-xl font-bold text-red-600">{summary.omitted}</p>
                            </div>
                        </div>

                        {summary.errors.length > 0 && (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full border text-left text-sm text-gray-700">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-3 py-2">Fila</th>
                                            <th className="border px-3 py-2">Código</th>
                                            <th className="border px-3 py-2">Motivo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.errors.map((error, index) => (
                                            <tr key={index}>
                                                <td className="border px-3 py-2">{error.fila ?? '-'}</td>
                                                <td className="border px-3 py-2">{error.code ?? '-'}</td>
                                                <td className="border px-3 py-2">{error.motivo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Dashboard>
    );
}
