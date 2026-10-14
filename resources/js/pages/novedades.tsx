import NewsCard from '@/components/newsCard';
import { Head, Link, usePage } from '@inertiajs/react';
import DefaultLayout from './defaultLayout';

export default function Novedades() {
    const { bannerNovedades, novedades, metadatos } = usePage().props;

    return (
        <DefaultLayout>
            <Head>
                <meta name="description" content={metadatos?.description} />
                <meta name="keywords" content={metadatos?.keywords} />
            </Head>
            {/* Banner section - responsive height */}
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[250px] w-full items-center justify-center sm:h-[300px] md:h-[400px]"
            >
                {/* Breadcrumbs - responsive position and width */}
                <div className="absolute top-16 z-40 mx-auto w-full max-w-[1200px] px-4 text-[12px] text-white sm:top-20 md:top-26 md:px-0">
                    <Link className="font-bold" href={'/'}>
                        Inicio
                    </Link>{' '}
                    / <Link href={'/novedades'}>Novedades</Link>
                </div>
                <img className="absolute h-full w-full object-cover object-center" src={bannerNovedades?.banner} alt="" />
                <h2 className="absolute text-2xl font-bold text-white sm:text-3xl md:text-4xl">Novedades</h2>
            </div>

            {/* Content section - responsive container */}
            <div className="w-full py-10 sm:py-16 md:py-20">
                <div className="mx-auto w-full max-w-[1200px] px-4 md:px-0">
                    {/* Cards grid - responsive layout */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {novedades.map((novedad) => (
                            <NewsCard key={novedad.id} novedad={novedad} href={`/novedades/${novedad.id}`} />
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
