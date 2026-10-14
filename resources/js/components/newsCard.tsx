import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export interface NewsCardItem {
    id: number;
    type?: string;
    title?: string;
    text?: string;
    image?: string;
}

export default function NewsCard({ novedad, href }: { novedad: NewsCardItem; href: string }) {
    const [imageError, setImageError] = useState(!novedad.image);
    return (
        <Link
            href={href}
            className="focus-visible:outline-primary-orange flex h-full min-w-0 flex-col overflow-hidden border border-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <div className="h-[300px] w-full shrink-0 overflow-hidden bg-gray-50 sm:h-[360px] lg:h-[400px]">
                {imageError ? (
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">Imagen no disponible</div>
                ) : (
                    <img
                        className="block h-full w-full object-fill"
                        src={novedad.image}
                        alt={novedad.title || 'Novedad'}
                        onError={() => setImageError(true)}
                    />
                )}
            </div>
            <div className="flex min-h-[210px] min-w-0 flex-1 flex-col gap-2 p-3">
                <p className="text-primary-orange line-clamp-1 h-5 text-sm font-bold uppercase">{novedad.type}</p>
                <h2 className="line-clamp-2 h-16 text-xl leading-8 font-bold break-words">{novedad.title}</h2>
                <div
                    className="line-clamp-2 h-12 overflow-hidden text-sm leading-6 break-words sm:text-base"
                    dangerouslySetInnerHTML={{ __html: novedad.text || '' }}
                />
                <span className="mt-auto flex items-center justify-between font-bold">
                    Leer más <FontAwesomeIcon icon={faArrowRight} size="lg" />
                </span>
            </div>
        </Link>
    );
}
