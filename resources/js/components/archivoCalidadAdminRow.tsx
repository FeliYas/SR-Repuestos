import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ArchivoCalidadAdminRow({ archivo }) {
    const [edit, setEdit] = useState(false);

    const updateForm = useForm({
        order: archivo?.order,
        name: archivo?.name,

        id: archivo?.id,
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateForm.post(route('admin.archivos.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Archivo actualizada correctamente');
                setEdit(false);
            },
            onError: (errors) => {
                toast.error('Error al actualizar archivo');
                console.log(errors);
            },
        });
    };

    const deleteMarca = () => {
        if (confirm('¿Estas seguro de eliminar esta publicacion?')) {
            updateForm.delete(route('admin.archivos.destroy'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Archivo eliminada correctamente');
                },
                onError: (errors) => {
                    toast.error('Error al eliminar archivo');
                    console.log(errors);
                },
            });
        }
    };

    const handleDownload = async () => {
        try {
            const filename = archivo?.archivo.split('/').pop();
            // Make a GET request to the download endpoint
            const response = await axios.get(`/descargar/archivo/${filename}`, {
                responseType: 'blob', // Important for file downloads
            });

            // Create a link element to trigger the download
            const fileType = response.headers['content-type'] || 'application/octet-stream';
            const blob = new Blob([response.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'Catalogo'; // Descargar con el nombre original
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);

            // Optional: show user-friendly error message
            alert('Failed to download the file. Please try again.');
        }
    };

    return (
        <tr className={`border text-black odd:bg-gray-100 even:bg-white`}>
            <td className="align-middle">{archivo?.order}</td>
            <td className="align-middle">{archivo?.name}</td>

            <td className="h-[90px] w-[90px] px-8">
                <img className="h-full w-full object-contain" src={archivo?.image} alt="" />
            </td>

            <td className="align-middle">
                <button className="text-blue-500" onClick={handleDownload}>
                    Archivo
                </button>
            </td>

            <td className="w-[140px] text-center">
                <div className="flex flex-row justify-center gap-3">
                    <button onClick={() => setEdit(true)} className="h-10 w-10 rounded-md border border-blue-500 px-2 py-1 text-white">
                        <FontAwesomeIcon icon={faPen} size="lg" color="#3b82f6" />
                    </button>
                    <button onClick={deleteMarca} className="h-10 w-10 rounded-md border border-red-500 px-2 py-1 text-white">
                        <FontAwesomeIcon icon={faTrash} size="lg" color="#fb2c36" />
                    </button>
                </div>
            </td>
            <AnimatePresence>
                {edit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 text-left"
                    >
                        <form onSubmit={handleUpdate} method="POST" className="text-black">
                            <div className="w-[500px] rounded-md bg-white p-4">
                                <h2 className="mb-4 text-2xl font-semibold">Actualizar Archivo</h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="ordennn">Orden</label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="ordennn"
                                        id="ordennn"
                                        value={updateForm?.data?.order}
                                        onChange={(e) => updateForm.setData('order', e.target.value)}
                                    />
                                    <label htmlFor="nombree">
                                        name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="nombree"
                                        id="nombree"
                                        value={updateForm?.data?.name}
                                        onChange={(e) => updateForm.setData('name', e.target.value)}
                                    />
                                    <label htmlFor="imagenn">Imagen</label>

                                    <span className="text-base font-normal">Resolucion recomendada: 501x181px</span>
                                    <div className="flex flex-row">
                                        <input
                                            type="file"
                                            name="imagen"
                                            id="imagenn"
                                            onChange={(e) => updateForm.setData('image', e.target.files[0])}
                                            className="hidden"
                                        />
                                        <label
                                            className="border-primary-orange text-primary-orange hover:bg-primary-orange cursor-pointer rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                            htmlFor="imagenn"
                                        >
                                            Elegir imagen
                                        </label>
                                        <p className="self-center px-2">{updateForm?.data?.image?.name}</p>
                                    </div>

                                    <label htmlFor="archivo">Archivo</label>

                                    <div className="flex flex-row">
                                        <input
                                            type="file"
                                            name="imagen"
                                            id="archivo"
                                            onChange={(e) => updateForm.setData('archivo', e.target.files[0])}
                                            className="hidden"
                                        />
                                        <label
                                            className="border-primary-orange text-primary-orange hover:bg-primary-orange cursor-pointer rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                            htmlFor="archivo"
                                        >
                                            Elegir imagen
                                        </label>
                                        <p className="self-center px-2">{updateForm?.data?.archivo?.name}</p>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setEdit(false)}
                                            className="border-primary-orange text-primary-orange hover:bg-primary-orange rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="border-primary-orange text-primary-orange hover:bg-primary-orange rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                        >
                                            Actualizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </tr>
    );
}
