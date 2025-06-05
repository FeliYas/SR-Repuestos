import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProductosAdminRow({ producto, marcas, categorias }) {
    const [edit, setEdit] = useState(false);
    const [caracteristicasView, setCaracteristicasView] = useState(false);
    const [imagenesView, setImagenesView] = useState(false);

    const imagesForm = useForm({
        order: '',
        producto_id: producto?.id,
        id: '',
    });

    const caracForm = useForm({
        aplicacion: producto?.aplicacion,
        anio: producto?.anio,
        num_original: producto?.num_original,
        tonelaje: producto?.tonelaje,
        espigon: producto?.espigon,
        bujes: producto?.bujes,
        id: producto?.id,
    });

    const updateForm = useForm({
        name: producto?.name,
        code: producto?.code,
        order: producto?.order,
        categoria_id: producto?.categoria_id,
        marca_id: producto?.marca_id,
        id: producto?.id,
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateForm.post(route('admin.productos.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Producto actualizada correctamente');
                setEdit(false);
            },
            onError: (errors) => {
                toast.error('Error al actualizar producto');
                console.log(errors);
            },
        });
    };

    const deleteMarca = () => {
        if (confirm('¿Estas seguro de eliminar este producto?')) {
            updateForm.delete(route('admin.productos.destroy'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Producto eliminada correctamente');
                },
                onError: (errors) => {
                    toast.error('Error al eliminar producto');
                    console.log(errors);
                },
            });
        }
    };

    const handleImageStore = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        imagesForm.post(route('admin.imagenes.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Imagen guardada correctamente');
            },
            onError: (errors) => {
                toast.error('Error al gurdar imagen');
                console.log(errors);
            },
        });
    };

    const deleteImage = (id) => {
        if (confirm('¿Estas seguro de eliminar esta imagen?')) {
            router.delete(route('admin.imagenes.destroy', { id: id }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Imagen eliminada correctamente');
                },
                onError: (errors) => {
                    toast.error('Error al eliminar imagen');
                    console.log(errors);
                },
            });
        }
    };

    return (
        <tr className={`border text-black odd:bg-gray-100 even:bg-white`}>
            <td className="align-middle">{producto?.order}</td>
            <td className="align-middle">{producto?.name}</td>
            <td className="align-middle">{producto?.code}</td>
            <td className="align-middle">{producto?.categoria?.name}</td>
            <td className="align-middle">{producto?.marca?.name}</td>

            <td>
                <button onClick={() => setCaracteristicasView(true)} className="h-10 w-10 rounded-md border border-blue-500 px-2 py-1 text-white">
                    <FontAwesomeIcon icon={faPen} size="lg" color="#3b82f6" />
                </button>
            </td>

            <td className="h-[90px] w-[90px] px-8">
                <button onClick={() => setImagenesView(true)} className="h-10 w-10 rounded-md border border-blue-500 px-2 py-1 text-white">
                    <FontAwesomeIcon icon={faPen} size="lg" color="#3b82f6" />
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
                {caracteristicasView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 text-left"
                    >
                        <form onSubmit={handleUpdate} method="POST" className="max-h-[90vh] overflow-y-auto text-black">
                            <div className="w-[500px] rounded-md bg-white p-4">
                                <h2 className="mb-4 text-2xl font-semibold">Actualizar caracteristicas</h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="nombree">
                                        Aplicacion <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="nombree"
                                        id="nombree"
                                        value={caracForm.data.aplicacion}
                                        onChange={(e) => caracForm.setData('aplicacion', e.target.value)}
                                    />
                                    <label htmlFor="code">
                                        Años <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="code"
                                        id="code"
                                        value={caracForm.data.anio}
                                        onChange={(e) => caracForm.setData('anio', e.target.value)}
                                    />

                                    <label htmlFor="numor">
                                        Nº Original <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="numor"
                                        id="numor"
                                        value={caracForm.data.num_original}
                                        onChange={(e) => caracForm.setData('num_original', e.target.value)}
                                    />

                                    <label htmlFor="tonelaje">
                                        Tonelaje <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="tonelaje"
                                        id="tonelaje"
                                        value={caracForm.data.num_original}
                                        onChange={(e) => caracForm.setData('num_original', e.target.value)}
                                    />

                                    <label htmlFor="espigon">
                                        Espigón <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="espigon"
                                        id="espigon"
                                        value={caracForm.data.num_original}
                                        onChange={(e) => caracForm.setData('num_original', e.target.value)}
                                    />

                                    <label htmlFor="bujes">
                                        Bujes <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="bujes"
                                        id="bujes"
                                        value={caracForm.data.num_original}
                                        onChange={(e) => caracForm.setData('num_original', e.target.value)}
                                    />

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setCaracteristicasView(false)}
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
            <AnimatePresence>
                {edit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 text-left"
                    >
                        <form onSubmit={handleUpdate} method="POST" className="max-h-[90vh] overflow-y-auto text-black">
                            <div className="w-[500px] rounded-md bg-white p-4">
                                <h2 className="mb-4 text-2xl font-semibold">Actualizar Producto</h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="ordennn">Orden</label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="ordennn"
                                        id="ordennn"
                                        value={updateForm.data.order}
                                        onChange={(e) => updateForm.setData('order', e.target.value)}
                                    />
                                    <label htmlFor="nombree">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="nombree"
                                        id="nombree"
                                        value={updateForm.data.name}
                                        onChange={(e) => updateForm.setData('name', e.target.value)}
                                    />
                                    <label htmlFor="code">
                                        Codigo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="code"
                                        id="code"
                                        value={updateForm.data.code}
                                        onChange={(e) => updateForm.setData('code', e.target.value)}
                                    />

                                    <label htmlFor="categoria">
                                        Categoria <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        onChange={(e) => updateForm.setData('categoria_id', e.target.value)}
                                        value={updateForm.data.categoria_id}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        name="categoria"
                                        id="categoria"
                                    >
                                        <option value="">Seleccionar categoria</option>
                                        {categorias?.map((categoria) => (
                                            <option key={categoria?.id} value={categoria?.id}>
                                                {categoria?.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="marca">
                                        Marca <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        onChange={(e) => updateForm.setData('marca_id', e.target.value)}
                                        value={updateForm.data.marca_id}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        name="marca"
                                        id="marca"
                                    >
                                        <option value="">Seleccionar marca</option>
                                        {marcas?.map((marca) => (
                                            <option key={marca?.id} value={marca?.id}>
                                                {marca?.name}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="imagenn">Imagen</label>
                                    <span className="text-base font-normal">Resolucion recomendada: 286px x 286px</span>

                                    <input
                                        type="file"
                                        name="imagen"
                                        id="imagenn"
                                        onChange={(e) => updateForm.setData('image', e.target.files[0])}
                                        className="file:border-primary-orange file:text-primary-orange hover:file:bg-primary-orange file:cursor-pointer file:rounded-md file:border file:px-2 file:py-1 file:transition file:duration-300 hover:file:text-white"
                                    />

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
            <AnimatePresence>
                {imagenesView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 text-left"
                    >
                        <form onSubmit={handleImageStore} method="POST" className="max-h-[90vh] overflow-y-auto text-black">
                            <div className="w-[500px] rounded-md bg-white p-4">
                                <h2 className="mb-4 text-2xl font-semibold">Cargar imagenes</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="grid w-full grid-cols-5 gap-3">
                                        {producto?.imagenes?.map((image) => (
                                            <div className="relative h-20 w-20 border">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteImage(image.id)}
                                                    className="absolute top-0 left-0 h-full w-full bg-black/20"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} size="lg" color="#fb2c36" />
                                                </button>
                                                <img className="h-full w-full object-cover" src={image?.image} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                    <label htmlFor="ordennn">Orden</label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="ordennn"
                                        id="ordennn"
                                        value={imagesForm.data.order}
                                        onChange={(e) => imagesForm.setData('order', e.target.value)}
                                    />
                                    <span className="text-base font-normal">Resolucion recomendada: 286px x 286px</span>
                                    <label htmlFor="imagen">Imagen:</label>
                                    <input
                                        type="file"
                                        name="imagen"
                                        id="imagenn"
                                        onChange={(e) => imagesForm.setData('image', e.target.files[0])}
                                        className="file:border-primary-orange file:text-primary-orange hover:file:bg-primary-orange file:cursor-pointer file:rounded-md file:border file:px-2 file:py-1 file:transition file:duration-300 hover:file:text-white"
                                    />

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setImagenesView(false)}
                                            className="border-primary-orange text-primary-orange hover:bg-primary-orange rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="border-primary-orange text-primary-orange hover:bg-primary-orange rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                        >
                                            Cargar
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
