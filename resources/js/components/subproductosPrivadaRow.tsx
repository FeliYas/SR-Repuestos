import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from 'react-use-cart';
import defaultPhoto from '../../images/defaultPhoto.png';

export default function SubproductosPrivadaRow({ subProducto }) {
    const { addItem, updateItemQuantity, getItem, removeItem } = useCart();
    const { auth, ziggy } = usePage().props;
    const { user } = auth;

    const currentItem = getItem(subProducto?.id) ? getItem(subProducto?.id) : null;

    const [cantidad, setCantidad] = useState(currentItem?.quantity || 1);

    const handlePrice = () => {
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

    useEffect(() => {
        if (currentItem) {
            updateItemQuantity(subProducto?.id, cantidad);
        }
    }, [cantidad]);

    return (
        <div className="grid h-fit grid-cols-8 items-center border-b border-gray-200 py-2 text-[15px] text-[#74716A]">
            <div className="h-[85px] w-[85px]">
                <img src={subProducto?.image || defaultPhoto} className="h-full w-full object-contain" alt="" />
            </div>
            <p className="">{subProducto?.code}</p>
            <p className="">{subProducto?.producto?.marca?.name}</p>
            <p className="">{subProducto?.producto?.name}</p>
            <p className="">{subProducto?.description}</p>
            <p className="pl-4">$ {handlePrice()?.toLocaleString('es-AR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
            <p className="flex justify-center">
                <div className="flex h-[38px] w-[99px] flex-row items-center border border-[#EEEEEE] px-2">
                    <input value={cantidad} type="text" className="h-full w-full focus:outline-none" />
                    <div className="flex h-full flex-col justify-center">
                        <button onClick={() => setCantidad(cantidad + 1)} className="flex items-center">
                            <FontAwesomeIcon icon={faChevronUp} size="xs" />
                        </button>
                        <button onClick={() => setCantidad(cantidad > 1 ? cantidad - 1 : cantidad)} className="flex items-center">
                            <FontAwesomeIcon icon={faChevronDown} size="xs" />
                        </button>
                    </div>
                </div>
            </p>
            <p className="flex justify-center">
                {ziggy.location.includes('carrito') ? (
                    <button
                        onClick={() => removeItem(subProducto?.id)}
                        className="border-primary-orange text-primary-orange hover:bg-primary-orange h-[41px] w-[88px] border text-[16px] font-bold transition duration-300 hover:text-white"
                    >
                        Eliminar
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            addItem({ ...subProducto, price: handlePrice(), id: subProducto?.id }, cantidad);
                            toast.success('Producto agregado al carrito', { position: 'bottom-left' });
                        }}
                        className="bg-primary-orange hover:text-primary-orange hover:border-primary-orange h-[41px] w-[88px] text-[16px] font-bold text-white transition duration-300 hover:border hover:bg-white"
                    >
                        Agregar
                    </button>
                )}
            </p>
        </div>
    );
}
