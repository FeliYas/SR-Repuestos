import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function NovedadesInicio() {
    const { novedades } = usePage().props;
    const [screenSize, setScreenSize] = useState('lg');

    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 640) {
                setScreenSize('sm');
            } else if (window.innerWidth < 1024) {
                setScreenSize('md');
            } else {
                setScreenSize('lg');
            }
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

    const truncateString = (str: string, num: number) => {
        if (str?.length > num) {
            return str?.slice(0, num) + '...';
        }
        return str;
    };

    // Ajustar la longitud del truncado según el tamaño de pantalla
    const getTruncateLength = () => {
        if (screenSize === 'sm') return 60;
        if (screenSize === 'md') return 90;
        return 120;
    };

    return (
        <div className="w-full py-10 sm:py-16 md:py-20">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:gap-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                    <h2 className="text-2xl font-bold sm:text-2xl md:text-3xl">Novedades</h2>
                    <Link
                        href={'#'}
                        className="text-primary-orange border-primary-orange hover:bg-primary-orange flex h-[41px] w-[127px] items-center justify-center border text-base font-semibold transition duration-300 hover:text-white"
                    >
                        Ver todas
                    </Link>
                </div>
                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                    {novedades.map((novedad) => (
                        <Link
                            key={novedad?.id}
                            href={`/novedades/${novedad?.id}`}
                            className="flex h-auto w-full flex-col gap-2 border border-gray-300 sm:h-[480px] md:h-[520px] md:max-w-[calc(33.33%-16px)] lg:h-[540px]"
                        >
                            <div className="aspect-[16/9] w-full sm:aspect-[392/300] sm:max-h-[240px] md:max-h-[300px]">
                                <img className="h-full w-full object-cover" src={novedad?.image} alt={novedad?.title || 'Imagen de novedad'} />
                            </div>
                            <div className="flex h-full flex-col justify-between p-3">
                                <div className="flex flex-col gap-2">
                                    <p className="text-primary-orange text-sm font-bold uppercase">{novedad?.type}</p>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">{novedad?.title}</p>
                                        <div dangerouslySetInnerHTML={{ __html: truncateString(novedad?.text, getTruncateLength()) }} />
                                    </div>
                                </div>
                                <button type="button" className="mt-4 flex flex-row items-center justify-between">
                                    <p className="font-bold">Leer más</p>
                                    <FontAwesomeIcon icon={faArrowRight} size="lg" />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
