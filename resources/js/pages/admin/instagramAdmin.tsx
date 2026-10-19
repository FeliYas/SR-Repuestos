import InstagramAdminRow, { type InstagramPublication } from '@/components/instagramAdminRow';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard';

type SyncStatus = {
    last_attempt_at: string | null;
    last_success_at: string | null;
    result: 'success' | 'failed' | null;
    message: string | null;
    count: number;
};

export default function InstagramAdmin() {
    const { publicaciones, syncStatus } = usePage<{
        publicaciones: InstagramPublication[];
        syncStatus: SyncStatus;
    }>().props;

    const { post: syncNow, processing: syncing } = useForm({});
    const { data: importData, setData: setImportData, post: importPost, processing: importing, reset: resetImport } = useForm({ url: '' });

    const { data, setData, post, reset } = useForm<{ link: string; order: string; image: File | null }>({
        link: '',
        order: '',
        image: null,
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [createView, setCreateView] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('admin.instagram.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Publicacion creada correctamente');
                reset();
                setCreateView(false);
            },
            onError: (errors) => {
                toast.error('Error al crear publicacion');
                console.log(errors);
            },
        });
    };

    const handleImport = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        importPost(route('admin.instagram.import'), {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash as { instagram_import_success?: string; instagram_import_error?: string } | undefined;
                if (flash?.instagram_import_error) {
                    toast.error(flash.instagram_import_error);
                } else if (flash?.instagram_import_success) {
                    toast.success(flash.instagram_import_success);
                    resetImport();
                }
            },
            onError: () => toast.error('Ingresá un enlace válido de Instagram.'),
        });
    };

    return (
        <Dashboard>
            <div className="flex w-full flex-col p-6">
                <AnimatePresence>
                    {createView && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 text-left"
                        >
                            <form onSubmit={handleSubmit} method="POST" className="text-black">
                                <div className="w-[500px] rounded-md bg-white p-4">
                                    <h2 className="mb-4 text-2xl font-semibold">Crear Marca</h2>
                                    <div className="flex flex-col gap-4">
                                        <label htmlFor="ordennn">Orden</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="ordennn"
                                            id="ordennn"
                                            onChange={(e) => setData('order', e.target.value)}
                                        />
                                        <label htmlFor="nombree">
                                            Link <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="nombree"
                                            id="nombree"
                                            onChange={(e) => setData('link', e.target.value)}
                                        />
                                        <label htmlFor="imagenn">Imagen</label>

                                        <span className="text-base font-normal">Resolucion recomendada: 501x181px</span>
                                        <div className="flex flex-row">
                                            <input
                                                type="file"
                                                name="imagen"
                                                id="imagenn"
                                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                                className="hidden"
                                            />
                                            <label
                                                className="border-primary-orange text-primary-orange hover:bg-primary-orange cursor-pointer rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                                htmlFor="imagenn"
                                            >
                                                Elegir imagen
                                            </label>
                                            <p className="self-center px-2">{data?.image?.name}</p>
                                        </div>

                                        <div className="flex justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setCreateView(false)}
                                                className="border-primary-orange text-primary-orange hover:bg-primary-orange rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="border-primary-orange text-primary-orange hover:bg-primary-orange rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="mx-auto flex w-full flex-col gap-3">
                    <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Publicaciones</h2>
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-300 bg-white p-4">
                        <div className="text-sm text-gray-700" role="status">
                            <p>Último intento: {syncStatus?.last_attempt_at ? new Date(syncStatus.last_attempt_at).toLocaleString('es-AR') : 'Nunca'}</p>
                            <p>Última actualización: {syncStatus?.last_success_at ? new Date(syncStatus.last_success_at).toLocaleString('es-AR') : 'Nunca'}</p>
                            {syncStatus?.message && (
                                <p className={syncStatus.result === 'success' ? 'text-green-700' : 'text-red-700'}>
                                    {syncStatus.message} {syncStatus.result === 'success' ? `(${syncStatus.count} publicaciones)` : ''}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            disabled={syncing}
                            onClick={() => syncNow(route('admin.instagram.sync'), { preserveScroll: true })}
                            className="bg-primary-orange rounded px-4 py-2 font-bold text-white disabled:opacity-60"
                        >
                            {syncing ? 'Actualizando...' : 'Actualizar ahora'}
                        </button>
                    </div>
                    <form onSubmit={handleImport} className="flex flex-wrap items-center gap-3 rounded-md border border-gray-300 bg-white p-4">
                        <label htmlFor="instagram-import-url" className="text-sm font-medium text-gray-700">
                            ¿Falta una publicación? Pegá su enlace de Instagram:
                        </label>
                        <input
                            id="instagram-import-url"
                            type="url"
                            required
                            maxLength={500}
                            placeholder="https://www.instagram.com/p/.../"
                            value={importData.url}
                            onChange={(e) => setImportData('url', e.target.value)}
                            className="min-w-[280px] flex-1 rounded-md border border-gray-300 px-3 py-2"
                        />
                        <button type="submit" disabled={importing} className="bg-primary-orange rounded px-4 py-2 font-bold text-white disabled:opacity-60">
                            {importing ? 'Importando...' : 'Importar publicación'}
                        </button>
                    </form>
                    <div className="flex h-fit w-full flex-row gap-5">
                        <input
                            type="text"
                            placeholder="Buscar publicacion..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3"
                        />
                        <button
                            onClick={() => setCreateView(true)}
                            className="bg-primary-orange w-[200px] rounded px-4 py-1 font-bold text-white hover:bg-orange-400"
                        >
                            Crear Publicacion
                        </button>
                    </div>

                    <div className="flex w-full justify-center">
                        <table className="w-full border text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="bg-gray-300 text-sm font-medium text-black uppercase">
                                <tr>
                                    <td className="text-center">ORDEN</td>

                                    <td className="text-center">LINK</td>
                                    <td className="w-[400px] px-3 py-2 text-center">IMAGEN</td>

                                    <td className="text-center">EDITAR</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {publicaciones?.map((publicacion) => <InstagramAdminRow key={publicacion.id} publicacion={publicacion} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
