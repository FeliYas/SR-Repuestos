import ListaDePreciosRow from '@/components/llistadepreciosRow';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard';

export default function ListaDePreciosAdmin() {
    const { listaDePrecios } = usePage().props;

    const { data, setData, post, reset } = useForm({
        name: '',
        lista: '',
        archivo: '',
    });

    const [createView, setCreateView] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('admin.listadeprecios.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Archivo creado correctamente');
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
                                        <label htmlFor="nombree">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="nombree"
                                            id="nombree"
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        <label htmlFor="">Lista</label>

                                        <select
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            onChange={(e) => setData('lista', e.target.value)}
                                            name=""
                                            id=""
                                        >
                                            <option value="">Seleccionar lista</option>
                                            <option value="1">Lista 1</option>
                                            <option value="2">Lista 2</option>
                                            <option value="3">Lista 3</option>
                                        </select>

                                        <label htmlFor="archivo">Archivo</label>

                                        <div className="flex flex-row">
                                            <input
                                                type="file"
                                                name="archivo"
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
                    <div className="border-primary-orange flex flex-row border-b-3 py-1">
                        <h2 className="text-primary-orange text-bold w-full text-2xl">Lista de precios</h2>
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
                                    <td className="pl-4 text-center">NOMBRE</td>
                                    <td className="w-[400px] px-3 py-2 text-center">LISTA</td>
                                    <td className="text-center">ARCHIVO</td>
                                    <td className="text-center">EDITAR</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {listaDePrecios?.map((lista) => <ListaDePreciosRow key={lista.id} lista={lista} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
