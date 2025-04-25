import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useCart } from 'react-use-cart';

export default function SubproductosPrivadaRow({ subProducto }) {
    const { addItem } = useCart();
    const { auth } = usePage().props;

    const { user } = auth;

    const [cantidad, setCantidad] = useState(1);

    const handlePrice = () => {
        if (user.lista === '1') {
            return subProducto?.price_mayorista;
        }
        if (user.lista === '2') {
            return subProducto?.price_minorista;
        }
        if (user.lista === '3') {
            return subProducto?.price_dist;
        }
    };

    return (
        <div className="grid h-[52px] grid-cols-8 items-center text-[15px] text-[#74716A]">
            <div className="h-[85px] w-[85px]">
                <img src={subProducto?.image} className="h-full w-full object-cover" alt="" />
            </div>
            <p className="">{subProducto?.code}</p>
            <p className="">{subProducto?.producto?.marca?.name}</p>
            <p className="">{subProducto?.producto?.name}</p>
            <p className="">{subProducto?.description}</p>
            <p className="">$ {handlePrice()}</p>
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
                <button
                    onClick={() => addItem({ ...subProducto, price: 1 })}
                    className="bg-primary-orange h-[41px] w-[88px] text-[16px] font-bold text-white"
                >
                    Agregar
                </button>
            </p>
        </div>
    );
}
