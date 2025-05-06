import SearchBar from '@/components/searchBar';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DefaultLayout from './defaultLayout';

export default function ProductosVistaPrevia() {
    const { categorias } = usePage().props;
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };

        // Verificar tamaño inicial
        checkScreenSize();

        // Añadir listener para cambios de tamaño
        window.addEventListener('resize', checkScreenSize);

        // Limpiar listener al desmontar
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <DefaultLayout>
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[250px] w-full items-center justify-center sm:h-[300px] md:h-[400px]"
            >
                <img
                    className="absolute h-full w-full object-cover object-center"
                    /* src={nosotros?.banner} */
                    alt="Banner productos"
                />
                <h2 className="absolute z-10 text-3xl font-bold text-white sm:text-4xl">Productos</h2>
            </div>

            <SearchBar />

            <div className="w-full bg-white py-10 sm:py-16 md:py-20">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:gap-8 md:gap-10">
                    <div className={`flex w-full ${isMobile ? 'flex-col' : 'flex-row flex-wrap'} gap-4`}>
                        {categorias.map((categoria) => (
                            <Link
                                href={`/productos/${categoria?.id}`}
                                key={categoria?.id}
                                style={{ backgroundImage: `url(${categoria?.image})` }}
                                className={`flex items-end justify-center bg-cover bg-center bg-no-repeat py-6 md:py-8 ${
                                    isMobile ? 'h-[200px] w-full' : isTablet ? 'h-[220px] w-[calc(50%-8px)]' : 'h-[282px] w-[calc(33.33%-11px)]'
                                }`}
                            >
                                <p className="text-xl font-medium text-white uppercase md:text-2xl">{categoria?.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
