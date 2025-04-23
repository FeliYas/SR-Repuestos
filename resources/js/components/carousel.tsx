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
            <div className="absolute inset-0 -bottom-32 z-30 mx-auto flex max-w-[1240px] flex-col justify-center text-white max-sm:pl-6">
                <div>
                    <h1 className="text-5xl">{bannerPortada?.title}</h1>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
