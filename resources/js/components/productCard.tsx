import { Link } from '@inertiajs/react';
import defaultPhoto from '../../images/defaultPhoto.png';

export interface CatalogProduct {
    id: number;
    name?: string;
    code?: string;
    categoria?: { id?: number; name?: string };
    categoria_id?: number;
    marca?: { name?: string };
    imagenes?: Array<{ image?: string }>;
}

export default function ProductCard({ producto, href }: { producto: CatalogProduct; href: string }) {
    return (
        <Link
            href={href}
            className="group hover:border-primary-orange focus-visible:outline-primary-orange flex h-[340px] min-w-0 flex-col overflow-hidden rounded-sm border border-gray-200 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <div className="flex h-[210px] w-full shrink-0 items-center justify-center border-b border-gray-200 bg-white p-4">
                <img
                    className="h-full w-full object-contain"
                    src={producto.imagenes?.[0]?.image || defaultPhoto}
                    alt={producto.name || 'Producto'}
                    onError={(event) => {
                        event.currentTarget.src = defaultPhoto;
                    }}
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                <p className="text-primary-orange line-clamp-2 h-10 text-sm leading-5 break-words">
                    <span className="font-bold">{producto.code}</span>
                    {producto.marca?.name ? ` | ${producto.marca.name}` : ''}
                </p>
                <h2 className="line-clamp-2 h-12 text-base leading-6 font-bold break-words text-[#202020] md:text-lg">{producto.name}</h2>
            </div>
        </Link>
    );
}
