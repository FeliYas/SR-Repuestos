import NewsCard from '@/components/newsCard';
import { usePage } from '@inertiajs/react';
import DefaultLayout from '../defaultLayout';

export default function NovedadesPrivadas() {
    const { novedadesPrivadas } = usePage().props;

    return (
        <DefaultLayout>
            <div className="w-full py-10 sm:py-16 md:py-20">
                <div className="mx-auto w-full max-w-[1200px] px-4 md:px-0">
                    <div className="mb-8 flex flex-col gap-2">
                        <p className="text-primary-orange text-sm font-bold uppercase">Zona privada</p>
                        <h1 className="text-3xl font-bold sm:text-4xl">Novedades</h1>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {novedadesPrivadas.map((novedadPrivada) => (
                            <NewsCard key={novedadPrivada.id} novedad={novedadPrivada} href={`/privada/novedades/${novedadPrivada.id}`} />
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
