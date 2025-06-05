import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import defaultPhoto from '../../images/defaultPhoto.png';
import DefaultLayout from './defaultLayout';

export default function Productos() {
    const { categorias, marcas, productos, ziggy, id, metadatos, marca_id, subproductos } = usePage().props;

    const [categoriasDropdown, setCategoriasDropdown] = useState(true);
    const [marcasDropdown, setMarcasDropdown] = useState(true);

    console.log(productos);

    return (
        <DefaultLayout>
            <Head>
                <meta name="description" content={metadatos?.description} />
                <meta name="keywords" content={metadatos?.keywords} />
            </Head>
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 md:flex-row md:gap-10 md:px-6 md:py-30">
                {/* Breadcrumb - responsive */}
                <div className="z-40 mb-4 w-[1200px] text-[12px] text-[#74716A] md:absolute md:top-32 md:mb-0">
                    <Link className="font-bold" href={'/'}>
                        Inicio
                    </Link>{' '}
                    /{' '}
                    <Link className="font-bold" href={'/productos'}>
                        Productos
                    </Link>{' '}
                    / <Link href={`/productos/${id}`}>{categorias?.find((cat) => cat.id == id)?.name}</Link>
                </div>

                {/* Sidebar - responsive */}
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
                                            className={`w-full text-[14px] text-[#74716A] transition-colors hover:text-black md:text-[16px] ${ziggy.location.split('/')[4] == categoria?.id ? 'font-bold' : ''}`}
                                            href={`/productos/${categoria?.id}`}
                                        >
                                            {categoria?.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button
                            onClick={() => setMarcasDropdown(!marcasDropdown)}
                            className="flex flex-row items-center justify-between border-b border-[#E0E0E0] pr-2 pb-1"
                        >
                            <h2 className="text-[18px] font-semibold md:text-[20px]">Marcas</h2>
                            <FontAwesomeIcon
                                icon={faChevronUp}
                                color="#74716A"
                                className={`transition-transform duration-300 ${marcasDropdown ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${marcasDropdown ? 'max-h-[500px]' : 'max-h-0'}`}>
                            <div className="flex flex-col">
                                {marcas?.map((marca, index) => (
                                    <div key={index} className="border-b border-[#E0E0E0] py-2">
                                        <Link
                                            className={`text-[14px] text-[#74716A] transition-colors hover:text-black md:text-[16px] ${marca_id == marca?.id ? 'font-bold' : ''}`}
                                            href={`/productos/${id}`}
                                            data={{ marca: marca?.id }}
                                        >
                                            {marca?.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid - responsive */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {productos.data?.map((producto) => (
                        <Link
                            href={`/productos/${id}/${producto?.id}`}
                            key={producto?.id}
                            className="flex h-auto w-full flex-col border border-gray-200 sm:h-[400px]"
                        >
                            <div className="h-[200px] w-full border-b border-gray-200 sm:h-[287px]">
                                <img
                                    className="h-full w-full object-contain object-center"
                                    src={Array.isArray(producto?.imagenes) && producto.imagenes[0]?.image ? producto.imagenes[0].image : defaultPhoto}
                                    alt={producto?.name}
                                />
                            </div>
                            <div className="flex w-full flex-col gap-2 p-4">
                                <p className="text-primary-orange">
                                    {' '}
                                    <span className="font-bold">{producto?.code}</span> | {producto?.marca?.name?.toUpperCase()}
                                </p>
                                <h2 className="font-bold text-[#74716A]">{producto?.name}</h2>
                            </div>
                        </Link>
                    ))}
                    <div className="col-span-3 mt-4 flex max-h-[33px] w-full justify-between">
                        {Array.isArray(productos?.links) &&
                            productos.links.map((link, index) => (
                                <button
                                    key={index}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    disabled={!link.url}
                                    onClick={() => {
                                        const secureUrl = link.url?.replace('http://', 'https://');
                                        if (secureUrl) {
                                            router.visit(secureUrl);
                                        }
                                    }}
                                    className={`mx-1 border px-3 py-1 ${link.active ? 'bg-gray-300' : ''}`}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
