import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ProductosInicio() {
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
        <div className="w-full bg-white py-10 md:py-16 lg:py-20">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 md:gap-8 lg:gap-10">
                <h2 className="text-2xl font-bold md:text-3xl">Productos</h2>
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
    );
}
