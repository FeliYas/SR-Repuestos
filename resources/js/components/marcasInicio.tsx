import { usePage } from '@inertiajs/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function MarcasInicio() {
    const { marcas } = usePage().props;

    return (
        <div className="flex h-full w-full flex-col bg-[#F5F5F5]">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 sm:gap-10 sm:px-6 sm:py-10">
                <h2 className="text-center text-2xl font-bold sm:text-left sm:text-3xl md:text-[32px]">Trabajamos con las primeras marcas</h2>
                <Swiper
                    modules={[Pagination, Autoplay]}
                    slidesPerView={1}
                    slidesPerGroup={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    loop={false} // Desactivamos el loop para evitar paginación extra
                    className="h-[220px] w-full"
                    breakpoints={{
                        // cuando el ancho de la ventana es >= 480px
                        480: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                        },
                        // cuando el ancho de la ventana es >= 768px
                        768: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                        },
                        // cuando el ancho de la ventana es >= 1024px
                        1024: {
                            slidesPerView: 4,
                            slidesPerGroup: 4,
                        },
                    }}
                >
                    {marcas.map((brand, index) => (
                        <SwiperSlide key={index} className="flex justify-center">
                            <div className="mx-auto flex h-[120px] w-full max-w-[288px] items-center justify-center px-2 sm:h-[140px] sm:px-3 md:h-[173px]">
                                <img src={brand.image} alt={brand?.name} className="h-full w-full border object-contain sm:object-cover" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Estilos personalizados de la paginación */}
                <style>
                    {`
                    .swiper-pagination {
                        display: flex;
                        justify-content: center;
                        bottom: 0px !important;
                        padding-right: 20px;
                        
                    }
                    .swiper-pagination-bullet {
                        width: 35px;
                        height: 6px;
                        border-radius: 0;
                        background: gray;
                        opacity: 0,5;
                        transition: background 0.3s;
                    }
                    .swiper-pagination-bullet-active {
                        background: gray;
                    }
                `}
                </style>
            </div>
        </div>
    );
}
