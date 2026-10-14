import { Link } from '@inertiajs/react';

export interface NewsItem {
    title?: string;
    type?: string;
    text?: string;
    image?: string;
}

export default function NewsDetail({ novedad, backHref, compactTop = false }: { novedad?: NewsItem; backHref: string; compactTop?: boolean }) {
    return (
        <main className={`mx-auto w-full max-w-[1200px] px-4 pb-12 md:px-6 md:pb-20 ${compactTop ? 'pt-6 md:pt-8' : 'pt-28 md:pt-36'}`}>
            <Link href={backHref} className="text-sm font-medium text-[#74716A] underline-offset-4 hover:underline">
                Volver a novedades
            </Link>
            <article className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
                {novedad?.image && (
                    <div className="flex min-w-0 items-center justify-center overflow-hidden rounded-sm border border-gray-200 bg-gray-50 p-4">
                        <img src={novedad.image} alt={novedad.title || 'Imagen de novedad'} className="h-auto max-h-[560px] w-full object-contain" />
                    </div>
                )}
                <div className="min-w-0">
                    {novedad?.type && <p className="text-primary-orange text-sm font-bold tracking-wide uppercase">{novedad.type}</p>}
                    <h1 className="mt-2 text-3xl leading-tight font-bold break-words text-[#202020] sm:text-4xl">{novedad?.title}</h1>
                    <div
                        className="news-rich-text mt-6 min-w-0 text-base leading-relaxed break-words text-[#444]"
                        dangerouslySetInnerHTML={{ __html: novedad?.text || '' }}
                    />
                </div>
            </article>
        </main>
    );
}
