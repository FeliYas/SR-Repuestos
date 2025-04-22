import ArchivoCalidadAdminRow from '@/components/archivoCalidadAdminRow';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard';

export default function MarcasAdmin() {
    const { archivos } = usePage().props;

    const { data, setData, post, reset } = useForm({
        name: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;
    const [createView, setCreateView] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('admin.archivos.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Archivo creada correctamente');
                reset();
                setCreateView(false);
            },
            onError: (errors) => {
                toast.error('Error al crear archivo');
                console.log(errors);
            },
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
                                    <h2 className="mb-4 text-2xl font-semibold">Cargar archivo</h2>
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
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        <label htmlFor="imagenn">Imagen</label>

                                        <span className="text-base font-normal">Resolucion recomendada: 501x181px</span>
                                        <div className="flex flex-row">
                                            <input
                                                type="file"
                                                name="imagen"
                                                id="imagenn"
                                                onChange={(e) => setData('image', e.target.files[0])}
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

                                        <label htmlFor="archivo">Archivo</label>

                                        <div className="flex flex-row">
                                            <input
                                                type="file"
                                                name="imagen"
                                                id="archivo"
                                                onChange={(e) => setData('archivo', e.target.files[0])}
                                                className="hidden"
                                            />
                                            <label
                                                className="border-primary-orange text-primary-orange hover:bg-primary-orange cursor-pointer rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                                htmlFor="archivo"
                                            >
                                                Elegir Archivo
                                            </label>
                                            <p className="self-center px-2">{data?.archivo?.name}</p>
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
                    <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Archivos</h2>
                    <div className="flex h-fit w-full flex-row gap-5">
                        <input
                            type="text"
                            placeholder="Buscar archivos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3"
                        />
                        <button
                            onClick={() => setCreateView(true)}
                            className="bg-primary-orange w-[200px] rounded px-4 py-1 font-bold text-white hover:bg-orange-400"
                        >
                            Cargar Archivo
                        </button>
                    </div>

                    <div className="flex w-full justify-center">
                        <table className="w-full border text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="bg-gray-300 text-sm font-medium text-black uppercase">
                                <tr>
                                    <td className="text-center">ORDEN</td>

                                    <td className="text-center">NOMBRE</td>
                                    <td className="w-[400px] px-3 py-2 text-center">IMAGEN</td>
                                    <td className="text-center">ARCHIVO</td>

                                    <td className="text-center">EDITAR</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {archivos?.map((archivo) => <ArchivoCalidadAdminRow key={archivo.id} archivo={archivo} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
