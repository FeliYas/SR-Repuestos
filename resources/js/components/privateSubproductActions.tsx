import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';

interface PrivateSubproduct {
    id: number;
    code?: string;
    description?: string;
    price?: number | null;
    producto?: { name?: string; marca?: { name?: string } };
}

export default function PrivateSubproductActions({ subproducto }: { subproducto: PrivateSubproduct }) {
    const { addItem, getItem, updateItemQuantity } = useCart();
    // El carrito existente guarda IDs numéricos; conservarlos evita duplicar artículos ya agregados.
    const itemId = subproducto.id as unknown as string;
    const currentItem = getItem(itemId);
    const [cantidad, setCantidad] = useState(currentItem?.quantity || 1);
    const [addedCount, setAddedCount] = useState(0);
    const price = Number(subproducto.price);

    useEffect(() => {
        if (!addedCount) return;
        const timer = window.setTimeout(() => setAddedCount(0), 3000);
        return () => window.clearTimeout(timer);
    }, [addedCount]);

    if (!Number.isFinite(price) || price <= 0) {
        return (
            <Link
                href="/privada/contacto"
                data={{ producto: `${subproducto.producto?.name ?? ''} ${subproducto.code ?? ''}`.trim() }}
                className="text-primary-orange border-primary-orange focus-visible:outline-primary-orange inline-flex min-h-10 items-center justify-center border px-3 text-sm font-semibold hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                Consultar
            </Link>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
            <label className="sr-only" htmlFor={`cantidad-${subproducto.id}`}>
                Cantidad de {subproducto.description}
            </label>
            <input
                id={`cantidad-${subproducto.id}`}
                type="number"
                min={1}
                step={1}
                value={cantidad}
                onChange={(event) => setCantidad(Math.max(1, Number.parseInt(event.target.value, 10) || 1))}
                className="h-10 w-12 shrink-0 border border-gray-300 px-1 text-center"
            />
            <button
                type="button"
                onClick={() => {
                    if (currentItem) {
                        updateItemQuantity(itemId, currentItem.quantity + cantidad);
                    } else {
                        addItem({ ...subproducto, id: itemId, price }, cantidad);
                    }
                    setAddedCount((count) => count + 1);
                }}
                className={`focus-visible:outline-primary-orange min-h-10 shrink-0 px-2 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${addedCount ? 'bg-green-600 text-xs' : 'bg-primary-orange text-sm hover:bg-orange-600'}`}
            >
                {addedCount ? 'Agregado ✓' : 'Agregar'}
            </button>
            <span role="status" className="sr-only">
                {addedCount ? 'Producto agregado al carrito' : ''}
            </span>
        </div>
    );
}
