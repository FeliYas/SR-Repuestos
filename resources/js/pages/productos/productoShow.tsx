import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import defaultPhoto from '../../../images/defaultPhoto.png';
import DefaultLayout from '../defaultLayout';

export default function ProductoShow() {
    const { producto, categorias, subproductos, productosRelacionados } = usePage().props;

    const [categoriasDropdown, setCategoriasDropdown] = useState(false);
    const [currentImage, setCurrentImage] = useState(producto?.imagenes[0]?.image);

    return (
        <DefaultLayout>
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 md:flex-row md:gap-10 md:px-6 md:py-30">
                {/* breadcrumbs - responsive */}
                <div className="z-40 mb-4 w-[1200px] text-[12px] text-[#74716A] md:absolute md:top-32 md:mb-0">
                    <Link className="font-bold" href={'/'}>
                        Inicio
                    </Link>{' '}
                    /{' '}
                    <Link className="font-bold" href={'/productos'}>
                        Productos
                    </Link>{' '}
                    /{' '}
                    <Link className="font-bold" href={`/productos/${producto?.categoria?.id}`}>
                        {categorias?.find((cat) => cat.id == producto?.categoria?.id)?.name}
                    </Link>{' '}
                    / <Link href={`/productos/${producto?.categoria?.id}/${producto?.id}`}>{producto?.name}</Link>
                </div>

                {/* sidebar - responsive */}
                <div className="mb-6 flex w-full flex-col gap-6 md:mb-0 md:w-1/4 md:gap-10">
                    <div className="flex flex-col">
                        <button
                            onClick={() => setCategoriasDropdown(!categoriasDropdown)}
                            className="flex flex-row items-center justify-between border-b border-[#E0E0E0] pr-2 pb-1"
                        >
                            <h2 className="text-[18px] font-semibold md:text-[20px]">Categorias</h2>
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
                                    <div key={index} className="border-b border-[#E0E0E0] py-2">
                                        <Link
                                            className={`w-full text-[14px] text-[#74716A] transition-colors hover:text-black md:text-[16px] ${categoria?.id == producto?.categoria?.id ? 'font-bold' : ''}`}
                                            href={`/productos/${categoria?.id}`}
                                        >
                                            {categoria?.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* content - responsive */}
                <div className="flex w-full flex-col">
                    {/* product info section */}
                    <div className="flex w-full flex-col gap-8 lg:flex-row">
                        {/* product image */}
                        <div className="relative h-[300px] w-full border border-[#E0E0E0] max-sm:mb-24 sm:h-[400px] lg:h-[496px]">
                            <img
                                className="h-full w-full object-contain"
                                src={currentImage || defaultPhoto}
                                onError={(e) => {
                                    e.currentTarget.src = defaultPhoto;
                                }}
                                alt={producto?.name}
                            />
                            <div className="absolute -bottom-20 left-0 flex w-full flex-row gap-2 overflow-x-auto pb-2">
                                {producto?.imagenes?.map((image, index) => (
                                    <button
                                        className={`h-[66px] w-[66px] flex-shrink-0 border ${image == currentImage ? 'border-primary-orange' : 'border-[#E0E0E0]'}`}
                                        key={index}
                                        onClick={() => setCurrentImage(image?.image)}
                                    >
                                        <img
                                            className="h-full w-full object-contain"
                                            src={image?.image || defaultPhoto}
                                            onError={(e) => {
                                                e.currentTarget.src = defaultPhoto;
                                            }}
                                            alt={`${producto?.name} - imagen ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* product details */}
                        <div className="flex w-full flex-col justify-between gap-5 pt-2">
                            <div className="flex flex-col">
                                <p className="text-primary-orange text-[16px] font-bold">{producto?.marca?.name}</p>
                                <h2 className="text-[22px] font-bold text-[#202020] md:text-[28px]">{producto?.name}</h2>
                            </div>
                            <div className="flex flex-col text-[14px] md:text-[16px]">
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
                                <Link
                                    href={'/contacto'}
                                    method="get"
                                    data={{ producto: producto?.name }}
                                    className="bg-primary-orange flex h-[41px] w-full items-center justify-center font-bold text-white"
                                >
                                    Consultar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* subproducts table */}
                    <div className="mt-16 flex flex-col md:mt-30">
                        <div className="hidden h-[52px] grid-cols-4 items-center bg-[#F5F5F5] px-4 md:grid">
                            <p>Código</p>
                            <p>Medida</p>
                            <p>Componente</p>
                            <p>Características</p>
                        </div>
                        {subproductos?.map((subproducto, index) => (
                            <div
                                key={index}
                                className="flex flex-col border-b border-[#E0E0E0] py-3 text-[#74716A] md:grid md:h-[52px] md:grid-cols-4 md:items-center md:px-4 md:py-0"
                            >
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Código:</p>
                                    <p>{subproducto?.code}</p>
                                </div>
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Medida:</p>
                                    <p>{subproducto?.medida}</p>
                                </div>
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Componente:</p>
                                    <p>{subproducto?.componente}</p>
                                </div>
                                <div className="flex justify-between md:block">
                                    <p className="font-semibold md:hidden md:font-normal">Características:</p>
                                    <p>{subproducto?.caracteristicas}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* related products */}
                    <div className="flex flex-col gap-3 pt-10 md:pt-20">
                        <h2 className="text-[20px] font-semibold md:text-[24px]">Productos relacionados</h2>
                        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {productosRelacionados?.map((producto, index) => (
                                <Link
                                    href={`/productos/${producto?.id}`}
                                    key={index}
                                    className="flex h-auto w-full flex-col border border-gray-200 sm:h-[400px]"
                                >
                                    <div className="h-[200px] w-full border-b border-gray-200 sm:h-[287px]">
                                        <img
                                            className="h-full w-full object-cover object-center"
                                            src={producto?.imagenes[0]?.image || defaultPhoto}
                                            alt={producto?.name}
                                            onError={(e) => {
                                                e.currentTarget.src = defaultPhoto;
                                            }}
                                        />
                                    </div>
                                    <div className="flex w-full flex-col gap-2 p-4">
                                        <p className="text-primary-orange">
                                            {' '}
                                            <span className="font-bold">{producto?.code}</span> | {producto?.marca}
                                        </p>
                                        <h2 className="text-[18px] font-bold text-[#202020] md:text-[20px]">{producto?.name}</h2>
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
