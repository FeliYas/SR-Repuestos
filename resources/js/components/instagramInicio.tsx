import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function InstagramInicio() {
    const { instagram } = usePage().props;
    const [visibleItems, setVisibleItems] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleItems(1);
            } else if (window.innerWidth < 768) {
                setVisibleItems(2);
            } else if (window.innerWidth < 1024) {
                setVisibleItems(3);
            } else {
                setVisibleItems(4);
            }
        };

        // Inicializar
        handleResize();

        // Agregar listener
        window.addEventListener('resize', handleResize);

        // Limpiar
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col bg-[#202020] py-8 sm:py-10 md:h-auto lg:h-[417px]">
            <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-6 px-4 sm:gap-8">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Seguinos en instagram</h2>

                <div className="flex flex-col justify-center gap-4 pb-2 max-sm:overflow-x-auto sm:flex-row sm:justify-between">
                    {instagram.slice(0, visibleItems).map((item, index) => (
                        <a
                            key={index}
                            href={item?.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mx-auto h-[285px] w-full min-w-[288px] sm:mx-0 sm:w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[288px]"
                        >
                            <img className="h-full w-full object-cover" src={item?.image} alt={`Instagram post ${index + 1}`} />
                        </a>
                    ))}
                </div>

                {visibleItems < instagram.length && (
                    <div className="mt-4 flex justify-center lg:hidden">
                        <button
                            onClick={() => setVisibleItems(instagram.length)}
                            className="bg-primary-orange rounded-md px-4 py-2 font-medium text-white"
                        >
                            Ver más posts
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
