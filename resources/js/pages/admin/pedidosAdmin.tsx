import PedidoAdminRow from '@/components/pedidoAdminRow';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Dashboard from './dashboard';

export default function PedidosAdmin() {
    const { pedidos } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');

    // Manejadores para la paginación del backend
    const handlePageChange = (page) => {
        router.get(
            route('admin.pedidos'),
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
            route('admin.pedidos'),
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
                <div className="mx-auto flex w-full flex-col gap-3">
                    <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Pedidos</h2>
                    <div className="flex h-fit w-full flex-row gap-5">
                        <input
                            type="text"
                            placeholder="Buscar por numero de pedido..."
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
                    </div>

                    <div className="flex w-full justify-center">
                        <table className="w-full border text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="bg-gray-300 text-sm font-medium text-black uppercase">
                                <tr>
                                    <td className="text-center">NUMERO DE PEDIDO</td>
                                    <td className="text-center">CLIENTE</td>
                                    <td className="px-3 py-2 text-center">ESTADO</td>
                                    <td className="text-center">VER PEDIDO</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">{pedidos.data?.map((pedido) => <PedidoAdminRow key={pedido.id} pedido={pedido} />)}</tbody>
                        </table>
                    </div>

                    {/* Paginación con datos del backend */}
                    <div className="mt-4 flex justify-center">
                        {pedidos.links && (
                            <div className="flex items-center">
                                {pedidos.links.map((link, index) => (
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
                                        } ${index === 0 ? 'rounded-l-md' : ''} ${index === pedidos.links.length - 1 ? 'rounded-r-md' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información de paginación */}
                    <div className="mt-2 text-center text-sm text-gray-600">
                        Mostrando {pedidos.from || 0} a {pedidos.to || 0} de {pedidos.total} resultados
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
