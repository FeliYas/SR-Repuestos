import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DefaultLayout from '../defaultLayout';

export default function ProductoShow() {
    const { producto, categorias, subproductos, productosRelacionados } = usePage().props;

    const [categoriasDropdown, setCategoriasDropdown] = useState(false);
    const [currentImage, setCurrentImage] = useState(producto?.imagenes[0]);

    return (
        <DefaultLayout>
            <div className="mx-auto flex w-[1200px] flex-row gap-10 py-20">
                {/* sidebar */}
                <div className="flex w-1/4 flex-col gap-10">
                    <div className="flex flex-col">
                        <button
                            onClick={() => setCategoriasDropdown(!categoriasDropdown)}
                            className="flex flex-row items-center justify-between border-b border-[#74716A] pr-2 pb-1"
                        >
                            <h2 className="text-[20px] font-semibold">Categorias</h2>
                            <FontAwesomeIcon
                                icon={faChevronUp}
                                color="#74716A"
                                className={`transition-transform duration-300 ${categoriasDropdown ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${categoriasDropdown ? 'max-h-[500px]' : 'max-h-0'}`}
                        >
                            <div className="flex flex-col">
                                {categorias?.map((categoria, index) => (
                                    <div key={index} className="border-b border-[#74716A] py-2">
                                        <Link
                                            className={`w-full text-[16px] text-[#74716A] transition-colors hover:text-black ${categoria?.id == producto?.categoria?.id ? 'font-bold' : ''}`}
                                            href={'#'}
                                        >
                                            {categoria?.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col">
                    <div className="flex w-full flex-row gap-8">
                        <div className="relative h-[496px] w-full border border-[#E0E0E0]">
                            <img className="h-full w-full object-cover" src={currentImage} alt="" />
                            <div className="absolute -bottom-20 left-0 flex w-full flex-row gap-2">
                                {producto?.imagenes?.map((image, index) => (
                                    <button
                                        className={`h-[66px] w-[66px] border ${image == currentImage ? 'border-primary-orange' : 'border-[#E0E0E0]'}`}
                                        key={index}
                                        onClick={() => setCurrentImage(image)}
                                    >
                                        <img className="h-full w-full object-cover" src={image?.image} alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-full flex-col justify-between gap-5 pt-2">
                            <div className="flex flex-col">
                                <p className="text-primary-orange text-[16px] font-bold">{producto?.marca?.name}</p>
                                <h2 className="text-[28px] font-bold text-[#202020]">{producto?.name}</h2>
                            </div>
                            <div className="flex flex-col text-[16px]">
                                <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                    <p>Aplicación</p>
                                    <p>{producto?.aplicacion}</p>
                                </div>
                                <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                    <p>Año</p>
                                    <p>{producto?.anio}</p>
                                </div>
                                <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                    <p>Nº Original</p>
                                    <p>{producto?.num_original}</p>
                                </div>

                                <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                    <p>Tonelaje</p>
                                    <p>{producto?.tonelaje}</p>
                                </div>
                                <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                    <p>Espigón</p>
                                    <p>{producto?.espigon}</p>
                                </div>
                                <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                    <p>Bujes</p>
                                    <p>{producto?.bujes}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="bg-primary-orange h-[41px] w-full font-bold text-white">Consultar</button>
                                <button className="text-primary-orange border-primary-orange h-[41px] w-full border font-bold">Ficha técnica</button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-30 flex flex-col">
                        <div className="grid h-[52px] grid-cols-4 items-center bg-[#F5F5F5] px-4">
                            <p>Código</p>
                            <p>Medida</p>
                            <p>Componente</p>
                            <p>Características</p>
                        </div>
                        {subproductos?.map((subproducto, index) => (
                            <div key={index} className="grid h-[52px] grid-cols-4 items-center border-b border-[#E0E0E0] px-4 text-[#74716A]">
                                <p>{subproducto?.code}</p>
                                <p>{subproducto?.medida}</p>
                                <p>{subproducto?.componente}</p>
                                <p>{subproducto?.caracteristicas}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 pt-20">
                        <h2 className="text-[24px] font-semibold">Productos relacionados</h2>
                        <div className="flex w-full flex-row justify-between">
                            {productosRelacionados?.map((producto, index) => (
                                <Link
                                    href={`/productos/${producto?.id}`}
                                    key={index}
                                    className="flex h-[400px] w-[286px] flex-col border border-gray-200"
                                >
                                    <div className="h-[287px] w-full border-b border-gray-200">
                                        <img className="object-cove h-full w-full object-center" src={producto?.image} alt="" />
                                    </div>
                                    <div className="flex w-full flex-col gap-2 p-4">
                                        <p className="text-primary-orange">
                                            {' '}
                                            <span className="font-bold">{producto?.code}</span> | {producto?.marca}
                                        </p>
                                        <h2 className="text-[20px] font-bold text-[#202020]">{producto?.name}</h2>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
