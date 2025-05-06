import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from 'react-use-cart';
import MiPedidoTemplate from './miPedidoTemplate';

export default function MispedidosRow({ pedido }) {
    const { addItem } = useCart();
    const { subproductos, auth } = usePage().props;
    const [pedidoView, setPedidoView] = useState(false);

    const { user } = auth;

    const handlePrice = (subProducto) => {
        let price = 0;
        if (user.lista == '1') {
            price = subProducto?.price_mayorista;
        }
        if (user.lista == '2') {
            price = subProducto?.price_minorista;
        }
        if (user.lista == '3') {
            price = subProducto?.price_dist;
        }

        return Number(price);
    };

    const addMultipleItems = () => {
        pedido?.productos.forEach((producto) => {
            addItem({
                ...subproductos?.find((sub) => sub.id == producto.subproducto_id),
                quantity: producto?.cantidad,
                price: handlePrice(subproductos?.find((sub) => sub.id == producto.subproducto_id)),
            });
        });
        toast.success('Productos agregados al carrito');
    };

    return (
        <>
            {pedidoView && (
                <div
                    className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50"
                    onClick={() => setPedidoView(false)}
                >
                    <MiPedidoTemplate pedido={pedido} productos={pedido?.productos} />
                </div>
            )}
            <div className="grid grid-cols-7 gap-2 border-b py-2 text-[#74716A]">
                <div className="flex items-center">
                    <div className="flex h-[80px] w-[80px] items-center justify-center bg-[#F5F5F5]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                            <path
                                d="M10.7497 39.4167V7.16667C10.7497 6.21631 11.1272 5.30488 11.7992 4.63287C12.4712 3.96086 13.3826 3.58334 14.333 3.58334H28.6663C29.6167 3.58334 30.5281 3.96086 31.2001 4.63287C31.8721 5.30488 32.2497 6.21631 32.2497 7.16667V39.4167M10.7497 39.4167H32.2497M10.7497 39.4167H7.16634C6.21598 39.4167 5.30455 39.0391 4.63254 38.3671C3.96054 37.6951 3.58301 36.7837 3.58301 35.8333V25.0833C3.58301 24.133 3.96054 23.2215 4.63254 22.5495C5.30455 21.8775 6.21598 21.5 7.16634 21.5H10.7497M32.2497 39.4167H35.833C36.7834 39.4167 37.6948 39.0391 38.3668 38.3671C39.0388 37.6951 39.4163 36.7837 39.4163 35.8333V19.7083C39.4163 18.758 39.0388 17.8465 38.3668 17.1745C37.6948 16.5025 36.7834 16.125 35.833 16.125H32.2497M17.9163 10.75H25.083M17.9163 17.9167H25.083M17.9163 25.0833H25.083M17.9163 32.25H25.083"
                                stroke="#FB7F01"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
                <div className="flex items-center">{pedido?.id}</div>
                <div className="flex items-center">{pedido?.created_at}</div>
                <div className="flex items-center font-bold">{pedido?.entregado == 1 ? 'Entregado' : 'Pendiente'}</div>
                <div className="flex items-center">
                    $ {Number(pedido?.total).toLocaleString('es-AR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center">
                    <button onClick={() => setPedidoView(true)} className="bg-primary-orange h-10 w-full min-w-[138px] font-bold text-white">
                        Ver detalles
                    </button>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={addMultipleItems}
                        className="border-primary-orange text-primary-orange h-10 w-full min-w-[138px] border font-medium"
                    >
                        Recomprar
                    </button>
                </div>
            </div>
        </>
    );
}
