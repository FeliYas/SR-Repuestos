import { router, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SubProductosAdminRow from '../../components/subProductosAdminRow';
import Dashboard from './dashboard';

export default function SubProductosAdmin() {
    const { subProductos, productos } = usePage().props;

    const { data, setData, post, reset } = useForm({
        code: '',
        producto_id: '',
        description: '',
        medida: '',
        componente: '',
        caracteristicas: '',
        price_mayorista: '',
        price_minorista: '',
        price_dist: '',
    });

    const excelForm = useForm();

    const [searchTerm, setSearchTerm] = useState('');
    const [createView, setCreateView] = useState(false);
    const [importar, setImportar] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.subproductos.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Marca creada correctamente');
                reset();
                setCreateView(false);
            },
            onError: (errors) => {
                toast.error('Error al crear marca');
                console.log(errors);
            },
        });
    };

    const handleImport = (e) => {
        e.preventDefault();

        excelForm.post(route('importar.excel'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Archivo importado correctamente');
                excelForm.reset();
                setImportar(false);
            },
            onError: (errors) => {
                toast.error('Error al importar archivo');
                console.log(errors);
            },
        });
        setImportar(false);
        reset();
    };

    // Manejadores para la paginación del backend
    const handlePageChange = (page) => {
        router.get(
            route('admin.subproductos'),
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
            route('admin.subproductos'),
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
                            <form onSubmit={handleSubmit} method="POST" className="max-h-[90vh] overflow-x-auto text-black">
                                <div className="w-[500px] rounded-md bg-white p-4">
                                    <h2 className="mb-4 text-2xl font-semibold">Crear Sub-producto</h2>
                                    <div className="flex flex-col gap-4">
                                        <label htmlFor="ordennn">Orden</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="ordennn"
                                            id="ordennn"
                                            onChange={(e) => setData('order', e.target.value)}
                                        />
                                        <label htmlFor="code">Codigo</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="code"
                                            id="code"
                                            onChange={(e) => setData('code', e.target.value)}
                                        />
                                        <label htmlFor="prod">Producto relacionado</label>
                                        <select
                                            onChange={(e) => setData('producto_id', e.target.value)}
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
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="desc"
                                            id="desc"
                                            onChange={(e) => setData('description', e.target.value)}
                                        />

                                        <label htmlFor="medida">Medida</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="medida"
                                            id="medida"
                                            onChange={(e) => setData('medida', e.target.value)}
                                        />
                                        <label htmlFor="comp">Componente</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="comp"
                                            id="comp"
                                            onChange={(e) => setData('componente', e.target.value)}
                                        />
                                        <label htmlFor="carac">Caracteristicas</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="text"
                                            name="carac"
                                            id="carac"
                                            onChange={(e) => setData('caracteristicas', e.target.value)}
                                        />

                                        <label htmlFor="mayo">Precio mayorista {'(Lista 1)'}</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="number"
                                            name="mayo"
                                            id="mayo"
                                            onChange={(e) => setData('price_mayorista', e.target.value)}
                                        />

                                        <label htmlFor="min">Precio minorista {'(Lista 2)'}</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="number"
                                            name="min"
                                            id="min"
                                            onChange={(e) => setData('price_minorista', e.target.value)}
                                        />

                                        <label htmlFor="dist">Precio distribuidor {'(Lista 3)'}</label>
                                        <input
                                            className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                            type="number"
                                            name="dist"
                                            id="dist"
                                            onChange={(e) => setData('price_dist', e.target.value)}
                                        />

                                        <label htmlFor="imagenn">Imagen</label>
                                        <span className="text-base font-normal">Resolucion recomendada: 286px x 286px</span>
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
                <AnimatePresence>
                    {importar && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 text-left"
                        >
                            <form onSubmit={handleImport} method="POST" className="max-h-[90vh] overflow-x-auto text-black">
                                <div className="w-[500px] rounded-md bg-white p-4">
                                    <h2 className="mb-4 text-2xl font-semibold">Cargar archivo Excel</h2>
                                    <div className="flex flex-col gap-4">
                                        <label htmlFor="imagenn">Archivo</label>

                                        <div className="flex flex-row">
                                            <input
                                                type="file"
                                                name="imagen"
                                                id="imagenn"
                                                onChange={(e) => excelForm.setData('archivo', e.target.files[0])}
                                                className="hidden"
                                            />
                                            <label
                                                className="border-primary-orange text-primary-orange hover:bg-primary-orange cursor-pointer rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                                htmlFor="imagenn"
                                            >
                                                Elegir Archivo
                                            </label>
                                            <p className="self-center px-2">{excelForm?.data?.archivo?.name}</p>
                                        </div>

                                        <div className="flex justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setImportar(false)}
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
                    <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Sub-productos</h2>
                    <div className="flex h-fit w-full flex-row gap-5">
                        <input
                            type="text"
                            placeholder="Buscar sub-producto..."
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
                            className="bg-primary-orange w-[400px] rounded px-4 py-1 font-bold text-white hover:bg-orange-400"
                        >
                            Crear Sub-producto
                        </button>
                        <button
                            onClick={() => setImportar(true)}
                            className="bg-primary-orange w-[300px] rounded px-4 py-1 font-bold text-white hover:bg-orange-400"
                        >
                            Actualizar precios
                        </button>
                    </div>

                    <div className="flex w-full justify-center">
                        <table className="w-full border text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="bg-gray-300 text-sm font-medium text-black uppercase">
                                <tr>
                                    <td className="text-center">ORDEN</td>
                                    <td className="text-center">CODIGO</td>
                                    <td className="text-center">PRODUCTO</td>
                                    <td className="text-center">DESCRIPCION</td>

                                    <td className="text-center">PRECIO MAYORISTA</td>
                                    <td className="text-center">PRECIO MINORISTA</td>
                                    <td className="text-center">PRECIO DISTRIBUIDOR</td>
                                    <td className="py-2 text-center">IMAGEN</td>
                                    <td className="text-center">EDITAR</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {subProductos.data?.map((subprod) => (
                                    <SubProductosAdminRow key={subprod.id} productos={productos} subprod={subprod} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación con datos del backend */}
                    <div className="mt-4 flex justify-center">
                        {subProductos.links && (
                            <div className="flex items-center">
                                {subProductos.links.map((link, index) => (
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
                                        } ${index === 0 ? 'rounded-l-md' : ''} ${index === subProductos.links.length - 1 ? 'rounded-r-md' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información de paginación */}
                    <div className="mt-2 text-center text-sm text-gray-600">
                        Mostrando {subProductos.from || 0} a {subProductos.to || 0} de {subProductos.total} resultados
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
