import { useForm, usePage } from '@inertiajs/react';
import type { ChangeEvent, FormEvent, InputHTMLAttributes } from 'react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard';

type ImageUploadError = {
    file: string | null;
    code: string | null;
    motivo: string;
};

type ImageUploadSummary = {
    target: 'productos' | 'subproductos';
    total_files: number;
    created: number;
    updated: number;
    omitted: number;
    errors: ImageUploadError[];
};

export default function CargaMasivaImagenes() {
    const { flash } = usePage().props as {
        flash?: {
            mass_upload_images_summary?: ImageUploadSummary;
        };
    };

    const summary = flash?.mass_upload_images_summary;

    const { data, setData, post, processing, reset } = useForm<{
        target: 'productos' | 'subproductos';
        archivos: File[];
    }>({
        target: 'productos',
        archivos: [],
    });

    const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        setData('archivos', files);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(route('admin.cargamasiva.imagenes.import'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Carga de imágenes finalizada.');
                reset('archivos');
            },
            onError: () => {
                toast.error('No se pudo procesar la carpeta.');
            },
        });
    };

    return (
        <Dashboard>
            <div className="flex w-full flex-col gap-6 p-6">
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 pb-1 text-2xl">Carga masiva de imágenes</h2>

                <div className="rounded-md border border-gray-300 bg-white p-4">
                    <h3 className="mb-3 text-lg font-semibold">Guía rápida</h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm text-gray-700">
                        <li>Primero elegí si la carpeta corresponde a Productos o Subproductos.</li>
                        <li>La carpeta debe contener solo imágenes válidas (.jpg, .jpeg, .png, .webp, .gif, .bmp, .avif, .svg).</li>
                        <li>El nombre de cada archivo debe ser el código del producto/subproducto.</li>
                        <li>Si el código no existe en la base, se omite y se informa en el reporte final.</li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="rounded-md border border-gray-300 bg-white p-4">
                    <h3 className="mb-3 text-lg font-semibold">Subir carpeta</h3>

                    <div className="mb-4 flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="target"
                                checked={data.target === 'productos'}
                                onChange={() => setData('target', 'productos')}
                            />
                            <span>Imágenes para Productos</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="target"
                                checked={data.target === 'subproductos'}
                                onChange={() => setData('target', 'subproductos')}
                            />
                            <span>Imágenes para Subproductos</span>
                        </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="file"
                            multiple
                            onChange={handleFilesChange}
                            className="file:border-primary-orange file:text-primary-orange hover:file:bg-primary-orange file:cursor-pointer file:rounded-md file:border file:px-2 file:py-1 file:transition file:duration-300 hover:file:text-white"
                            {...({ webkitdirectory: 'true', directory: '' } as InputHTMLAttributes<HTMLInputElement>)}
                        />

                        <button
                            type="submit"
                            disabled={processing || data.archivos.length === 0}
                            className="bg-primary-orange disabled:bg-primary-orange/60 rounded px-4 py-2 font-bold text-white"
                        >
                            {processing ? 'Procesando...' : 'Importar imágenes'}
                        </button>

                        <p className="text-sm text-gray-600">Archivos seleccionados: {data.archivos.length}</p>
                    </div>
                </form>

                {summary && (
                    <div className="rounded-md border border-gray-300 bg-white p-4">
                        <h3 className="mb-3 text-lg font-semibold">Resumen de importación</h3>

                        <p className="mb-3 text-sm text-gray-700">
                            Tipo: <strong>{summary.target === 'productos' ? 'Productos' : 'Subproductos'}</strong>
                        </p>

                        <div className="grid gap-3 md:grid-cols-4">
                            <div className="rounded border p-3 text-center">
                                <p className="text-xs uppercase text-gray-500">Archivos leídos</p>
                                <p className="text-xl font-bold">{summary.total_files}</p>
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
                                            <th className="border px-3 py-2">Archivo</th>
                                            <th className="border px-3 py-2">Código</th>
                                            <th className="border px-3 py-2">Motivo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.errors.map((error, index) => (
                                            <tr key={index}>
                                                <td className="border px-3 py-2">{error.file ?? '-'}</td>
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
