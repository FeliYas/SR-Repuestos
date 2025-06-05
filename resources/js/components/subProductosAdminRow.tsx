import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SubProdcutosAdminRow({ subprod, productos }) {
    const [edit, setEdit] = useState(false);

    const updateForm = useForm({
        code: subprod?.code,
        producto_id: subprod?.producto_id,
        order: subprod?.order,
        description: subprod?.description,
        medida: subprod?.medida,
        componente: subprod?.componente,
        caracteristicas: subprod?.caracteristicas,
        price_mayorista: subprod?.price_mayorista,
        price_minorista: subprod?.price_minorista,
        price_dist: subprod?.price_dist,
        id: subprod?.id,
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateForm.post(route('admin.subproductos.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Sub-producto actualizada correctamente');
                setEdit(false);
            },
            onError: (errors) => {
                toast.error('Error al actualizar sub-producto');
                console.log(errors);
            },
        });
    };

    const deleteMarca = () => {
        if (confirm('¿Estas seguro de eliminar este sub-producto?')) {
            updateForm.delete(route('admin.subproductos.destroy'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Sub-producto eliminada correctamente');
                },
                onError: (errors) => {
                    toast.error('Error al eliminar sub-producto');
                    console.log(errors);
                },
            });
        }
    };

    return (
        <tr className={`border text-black odd:bg-gray-100 even:bg-white`}>
            <td className="align-middle">{subprod?.order}</td>
            <td className="align-middle">{subprod?.code}</td>
            <td className="align-middle">{subprod?.producto?.name}</td>
            <td className="align-middle">{subprod?.description}</td>

            <td className="align-middle">
                ${' '}
                {subprod?.price_mayorista
                    ? Number(subprod?.price_mayorista)?.toLocaleString('es-AR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                    : 0}
            </td>
            <td className="align-middle">
                ${' '}
                {subprod?.price_minorista
                    ? Number(subprod?.price_minorista)?.toLocaleString('es-AR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                    : 0}
            </td>
            <td className="align-middle">
                ${' '}
                {subprod?.price_dist
                    ? Number(subprod?.price_dist)?.toLocaleString('es-AR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                    : 0}
            </td>

            <td className="h-[90px] w-[90px] px-8">
                <img className="h-full w-full object-contain" src={subprod?.image} alt="" />
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
                        <form onSubmit={handleUpdate} method="POST" className="max-h-[90vh] overflow-x-auto text-black">
                            <div className="w-[500px] rounded-md bg-white p-4">
                                <h2 className="mb-4 text-2xl font-semibold">Actualizar Sub-producto</h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="ordennn">Orden</label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="ordennn"
                                        id="ordennn"
                                        defaultValue={subprod?.order}
                                        onChange={(e) => updateForm.setData('order', e.target.value)}
                                    />
                                    <label htmlFor="code">Codigo</label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="code"
                                        id="code"
                                        defaultValue={subprod?.code}
                                        onChange={(e) => updateForm.setData('code', e.target.value)}
                                    />
                                    <label htmlFor="prod">Producto relacionado</label>
                                    <select
                                        defaultValue={subprod?.producto_id}
                                        onChange={(e) => updateForm.setData('producto_id', e.target.value)}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        name="prod"
                                        id="prod"
                                    >
                                        <option value="">Seleccionar producto</option>
                                        {productos?.map((prod) => (
                                            <option key={prod.id} value={prod.id}>
                                                {prod.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="desc">Descripcion</label>
                                    <input
                                        defaultValue={subprod?.description}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="desc"
                                        id="desc"
                                        onChange={(e) => updateForm.setData('description', e.target.value)}
                                    />
                                    <label htmlFor="imagenn">Imagen</label>

                                    <label htmlFor="medida">Medida</label>
                                    <input
                                        defaultValue={subprod?.medida}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="medida"
                                        id="medida"
                                        onChange={(e) => updateForm.setData('medida', e.target.value)}
                                    />
                                    <label htmlFor="comp">Componente</label>
                                    <input
                                        defaultValue={subprod?.componente}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="comp"
                                        id="comp"
                                        onChange={(e) => updateForm.setData('componente', e.target.value)}
                                    />
                                    <label htmlFor="carac">Caracteristicas</label>
                                    <input
                                        defaultValue={subprod?.caracteristicas}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="text"
                                        name="carac"
                                        id="carac"
                                        onChange={(e) => updateForm.setData('caracteristicas', e.target.value)}
                                    />

                                    <label htmlFor="mayo">Precio mayorista {'(Lista 1)'}</label>
                                    <input
                                        defaultValue={subprod?.price_mayorista}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="number"
                                        name="mayo"
                                        id="mayo"
                                        onChange={(e) => updateForm.setData('price_mayorista', e.target.value)}
                                    />

                                    <label htmlFor="min">Precio minorista {'(Lista 2)'}</label>
                                    <input
                                        defaultValue={subprod?.price_minorista}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="number"
                                        name="min"
                                        id="min"
                                        onChange={(e) => updateForm.setData('price_minorista', e.target.value)}
                                    />

                                    <label htmlFor="dist">Precio distribuidor {'(Lista 3)'}</label>
                                    <input
                                        defaultValue={subprod?.price_dist}
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="number"
                                        name="dist"
                                        id="dist"
                                        onChange={(e) => updateForm.setData('price_dist', e.target.value)}
                                    />

                                    <label htmlFor="imagenn">Imagen</label>
                                    <span className="text-base font-normal">Resolucion recomendada: 286px x 286px</span>
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
