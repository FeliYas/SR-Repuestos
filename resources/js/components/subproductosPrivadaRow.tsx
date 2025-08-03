import { faChevronDown, faChevronUp, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from 'react-use-cart';
import defaultPhoto from '../../images/defaultPhoto.png';

export default function SubproductosPrivadaRow({ subProducto }) {
    const { addItem, updateItemQuantity, getItem, removeItem } = useCart();
    const { auth, ziggy } = usePage().props;
    const { user } = auth;

    const currentItem = getItem(subProducto?.id) ? getItem(subProducto?.id) : null;

    const [cantidad, setCantidad] = useState(currentItem?.quantity || 1);
    const [showMore, setShowMore] = useState(false);

    const showMoreRef = useRef(null);

    /* cerrar modal al clickear fuera */

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMore && showMoreRef.current && !showMoreRef.current.contains(event.target)) {
                setShowMore(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMore]);

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
            {showMore && (
                <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
                    <div ref={showMoreRef} className="relative mx-10 flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-sm bg-white p-4">
                        <button className="absolute top-4 right-4" onClick={() => setShowMore(false)}>
                            <FontAwesomeIcon icon={faX} />
                        </button>
                        {/* product info section */}
                        <div className="flex w-full flex-col gap-8 lg:flex-row">
                            {/* product image */}
                            <div className="relative h-[300px] w-full border border-[#E0E0E0] max-sm:mb-24 sm:h-[400px] lg:h-[496px]">
                                <img
                                    className="h-full w-full object-contain"
                                    src={subProducto?.image ?? ''}
                                    onError={(e) => {
                                        e.currentTarget.src = defaultPhoto;
                                    }}
                                    alt={subProducto?.description}
                                />
                            </div>

                            {/* product details */}
                            <div className="flex w-full flex-col justify-between gap-5 pt-2">
                                <div className="flex flex-col">
                                    <p className="text-primary-orange text-[16px] font-bold">{subProducto?.producto?.marca?.name}</p>
                                    <h2 className="text-[22px] font-bold text-[#202020] md:text-[28px]">{subProducto?.producto?.name}</h2>
                                </div>
                                <div className="flex flex-col text-[14px] md:text-[16px]">
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Aplicación</p>
                                        <p>{subProducto?.producto?.aplicacion}</p>
                                    </div>
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Año</p>
                                        <p>{subProducto?.producto?.anio}</p>
                                    </div>
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Nº Original</p>
                                        <p>{subProducto?.producto?.num_original}</p>
                                    </div>
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Tonelaje</p>
                                        <p>{subProducto?.producto?.tonelaje}</p>
                                    </div>
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Espigón</p>
                                        <p>{subProducto?.producto?.espigon}</p>
                                    </div>
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Bujes</p>
                                        <p>{subProducto?.producto?.bujes}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 flex flex-col md:mt-30">
                            <div className="hidden h-[52px] grid-cols-5 items-center bg-[#F5F5F5] px-4 md:grid">
                                <p>Código</p>
                                <p>Descripción</p>
                                <p>Medida</p>
                                <p>Componente</p>
                                <p>Características</p>
                            </div>

                            <div className="flex flex-col border-b border-[#E0E0E0] py-3 text-[#74716A] md:grid md:min-h-[52px] md:grid-cols-5 md:items-center md:px-4 md:py-0">
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Código:</p>
                                    <p>{subProducto?.code}</p>
                                </div>
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Descripcion:</p>
                                    <p>{subProducto?.description}</p>
                                </div>
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Medida:</p>
                                    <p>{subProducto?.medida}</p>
                                </div>
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Componente:</p>
                                    <p>{subProducto?.componente}</p>
                                </div>
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Características:</p>
                                    <p>{subProducto?.caracteristicas}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => setShowMore(true)} className="h-[85px] w-[85px] rounded-sm border">
                <img src={subProducto?.image || defaultPhoto} className="h-full w-full rounded-sm object-contain" alt="" />
            </button>
            <p className="">{subProducto?.code}</p>
            <p className="">{subProducto?.producto?.marca?.name}</p>
            <p className="">{subProducto?.producto?.name}</p>
            <p className="">{subProducto?.description}</p>
            <p className="pl-4">$ {(handlePrice() * cantidad)?.toLocaleString('es-AR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
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
