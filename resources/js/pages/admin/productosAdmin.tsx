import ProductosAdminRow from '@/components/productosAdminRow';
import { router, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard';

export default function ProductosAdmin() {
    const { productos, categorias, marcas } = usePage().props;

    const { data, setData, post, reset } = useForm({
        name: '',
        code: '',
        oreder: '',
        categoria_id: '',
        marca_id: '',
        aplicacion: '',
        anios: '',
        num_original: '',
        tonelaje: '',
        espigon: '',
        bujes: '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [createView, setCreateView] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.productos.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Producto creada correctamente');
                reset();
                setCreateView(false);
            },
            onError: (errors) => {
                toast.error('Error al crear producto');
                console.log(errors);
            },
        });
    };

    // Manejadores para la paginación del backend
    const handlePageChange = (page) => {
        router.get(
            route('admin.productos'),
            {
                page: page,
                search: searchTerm,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Función para realizar la búsqueda
    const handleSearch = () => {
        router.get(
            route('admin.productos'),
            {
                search: searchTerm,
                page: 1, // Resetear a la primera página al buscar
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
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
                            <form onSubmit={handleSubmit} method="POST" className="max-h-[90vh] overflow-y-auto text-black">
                                <div className="w-[500px] rounded-md bg-white p-4">
                                    <h2 className="mb-4 text-2xl font-semibold">Crear Producto</h2>
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
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="nombree"
                                            id="nombree"
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        <label htmlFor="code">
                                            Codigo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="code"
                                            id="code"
                                            onChange={(e) => setData('code', e.target.value)}
                                        />

                                        <label htmlFor="categoria">
                                            Categoria <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            onChange={(e) => setData('categoria_id', e.target.value)}
                                            value={data.categoria_id}
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
                                            onChange={(e) => setData('marca_id', e.target.value)}
                                            value={data.marca_id}
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
                                            onChange={(e) => setData('image', e.target.files[0])}
                                            className="file:border-primary-orange file:text-primary-orange hover:file:bg-primary-orange file:cursor-pointer file:rounded-md file:border file:px-2 file:py-1 file:transition file:duration-300 hover:file:text-white"
                                        />

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
                    <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Productos</h2>
                    <div className="flex h-fit w-full flex-row gap-5">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-primary-orange w-[200px] rounded px-4 py-1 font-bold text-white hover:bg-orange-400"
                        >
                            Buscar
                        </button>
                        <button
                            onClick={() => setCreateView(true)}
                            className="bg-primary-orange w-[200px] rounded px-4 py-1 font-bold text-white hover:bg-orange-400"
                        >
                            Crear Producto
                        </button>
                    </div>
                    <div className="flex w-full justify-center">
                        <table className="w-full border text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="bg-gray-300 text-sm font-medium text-black uppercase">
                                <tr>
                                    <td className="text-center">ORDEN</td>
                                    <td className="text-center">NOMBRE</td>
                                    <td className="text-center">CODIGO</td>
                                    <td className="text-center">CATEGORIA</td>
                                    <td className="text-center">MARCA</td>

                                    <td className="text-center">CARACTERISTICAS</td>
                                    <td className="px-3 py-2 text-center">IMAGEN</td>
                                    <td className="text-center">EDITAR</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {productos.data?.map((producto) => (
                                    <ProductosAdminRow key={producto.id} producto={producto} categorias={categorias} marcas={marcas} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación con datos del backend */}
                    <div className="mt-4 flex justify-center">
                        {productos.links && (
                            <div className="flex items-center">
                                {productos.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && handlePageChange(link.url.split('page=')[1])}
                                        disabled={!link.url}
                                        className={`px-4 py-2 ${
                                            link.active
                                                ? 'bg-primary-orange text-white'
                                                : link.url
                                                  ? 'bg-gray-300 text-black'
                                                  : 'bg-gray-200 text-gray-500 opacity-50'
                                        } ${index === 0 ? 'rounded-l-md' : ''} ${index === productos.links.length - 1 ? 'rounded-r-md' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información de paginación */}
                    <div className="mt-2 text-center text-sm text-gray-600">
                        Mostrando {productos.from || 0} a {productos.to || 0} de {productos.total} resultados
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
