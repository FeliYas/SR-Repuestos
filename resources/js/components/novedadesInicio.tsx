import NewsCard from '@/components/newsCard';
import { Link, usePage } from '@inertiajs/react';

export default function NovedadesInicio() {
    const { novedades } = usePage().props;

    return (
        <div className="w-full py-10 sm:py-16 md:py-20">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:gap-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                    <h2 className="text-2xl font-bold sm:text-2xl md:text-3xl">Novedades</h2>
                    <Link
                        href={'/novedades'}
                        className="text-primary-orange border-primary-orange hover:bg-primary-orange flex h-[41px] w-[127px] items-center justify-center border text-base font-semibold transition duration-300 hover:text-white"
                    >
                        Ver todas
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {novedades.map((novedad) => (
                        <NewsCard key={novedad.id} novedad={novedad} href={`/novedades/${novedad.id}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
