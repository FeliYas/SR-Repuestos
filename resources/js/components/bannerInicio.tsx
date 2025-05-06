import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function BannerInicio() {
    const { bannerPortada } = usePage().props;
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
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
        <div className={`w-full bg-[#202020] ${isMobile ? 'flex-col' : 'flex-row'} flex h-auto md:h-[351px]`}>
            <div className="w-full">
                <img className="h-full w-full object-cover" src={bannerPortada?.image} alt="Banner principal" />
            </div>
            <div className={`flex w-full flex-col justify-between ${isMobile ? 'px-6 py-8' : 'px-10 py-10 lg:px-20 lg:py-14'}`}>
                <div>
                    <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">{bannerPortada?.desc}</h2>
                </div>
                <div className="mt-6 flex justify-start md:mt-0">
                    <img className="max-h-16 md:max-h-none" src={bannerPortada?.logo_banner} alt="Logo banner" />
                </div>
            </div>
        </div>
    );
}
