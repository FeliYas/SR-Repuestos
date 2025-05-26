import SearchBarPrivate from '@/components/searchBarPrivate';
import SubproductosPrivadaRow from '@/components/subproductosPrivadaRow';
import { router, usePage } from '@inertiajs/react';
import DefaultLayout from '../defaultLayout';

export default function ProductosPrivada() {
    const { subProductos } = usePage().props;

    const handlePageChange = (page) => {
        router.get(
            route('index.privada.subproductos'),
            {
                page: page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <DefaultLayout>
            <SearchBarPrivate />
            <div className="mx-auto w-[1200px] py-20">
                <div className="w-full">
                    <div className="grid h-[52px] grid-cols-8 items-center bg-[#F5F5F5]">
                        <p></p>
                        <p>Código</p>
                        <p>Marca</p>
                        <p>Modelo</p>
                        <p>Descripción</p>
                        <p className="pl-4">Precio</p>
                        <p className="text-center">Cantidad</p>
                        <p></p>
                    </div>
                    {subProductos?.data?.map((subProducto, index) => <SubproductosPrivadaRow key={subProducto?.id} subProducto={subProducto} />)}
                </div>
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
        </DefaultLayout>
    );
}
