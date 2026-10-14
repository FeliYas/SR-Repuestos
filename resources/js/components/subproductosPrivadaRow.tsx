import { useCart, type Item } from 'react-use-cart';
import defaultPhoto from '../../images/defaultPhoto.png';

interface CartSubproduct extends Item {
    code?: string;
    description?: string;
    image?: string;
    producto?: { name?: string; marca?: { name?: string } };
}

export default function SubproductosPrivadaRow({ subProducto }: { subProducto: CartSubproduct }) {
    const { updateItemQuantity, removeItem } = useCart();
    const itemId = subProducto.id as unknown as string;

    return (
        <div className="grid min-w-[850px] grid-cols-8 items-center gap-3 border-b border-gray-200 py-3 text-sm text-[#74716A]">
            <img
                src={subProducto.image || defaultPhoto}
                alt={subProducto.description || 'Subproducto'}
                className="h-20 w-20 rounded-sm border border-gray-200 object-contain"
                onError={(event) => {
                    event.currentTarget.src = defaultPhoto;
                }}
            />
            <p className="break-words">{subProducto.code}</p>
            <p className="break-words">{subProducto.producto?.marca?.name}</p>
            <p className="break-words">{subProducto.producto?.name}</p>
            <p className="break-words">{subProducto.description}</p>
            <p className="font-semibold text-[#202020]">
                $ {Number(subProducto.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <label className="flex items-center gap-2">
                <input
                    aria-label={`Cantidad de ${subProducto.description || 'subproducto'}`}
                    type="number"
                    min={1}
                    step={1}
                    value={subProducto.quantity ?? 1}
                    onChange={(event) => updateItemQuantity(itemId, Math.max(1, Number.parseInt(event.target.value, 10) || 1))}
                    className="h-10 w-20 border border-gray-300 px-2 text-center"
                />
            </label>
            <button
                type="button"
                onClick={() => removeItem(itemId)}
                className="text-primary-orange border-primary-orange min-h-10 border px-2 font-semibold hover:bg-orange-50"
            >
                Eliminar
            </button>
        </div>
    );
}
