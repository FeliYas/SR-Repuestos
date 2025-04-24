import { usePage } from '@inertiajs/react';

const Carousel = () => {
    const { bannerPortada } = usePage().props;

    return (
        <div className="relative h-[800px] w-full overflow-hidden">
            <div className="absolute inset-0 z-30 bg-black opacity-50"></div>
            {/* Contenedor de imágenes con transición */}
            <div className="absolute inset-0">
                <video
                    autoPlay
                    loop
                    muted
                    src={bannerPortada?.video}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out`}
                />
            </div>

            {/* Contenido estático */}
            <div className="absolute z-40 flex h-full w-full items-center justify-center text-white">
                <h1 className="max-w-[500px] text-center text-[44px] font-bold">{bannerPortada?.title}</h1>
            </div>
        </div>
    );
};

export default Carousel;
