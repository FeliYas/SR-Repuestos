import CatalogSidebarSection from '@/components/catalogSidebarSection';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import defaultPhoto from '../../images/defaultPhoto.png';
import DefaultLayout from './defaultLayout';

interface CatalogItem {
    id: number;
    name: string;
}

interface ProductosPageProps {
    [key: string]: unknown;
    categorias?: CatalogItem[];
    marcas?: CatalogItem[];
    productos: {
        data?: Array<{
            id: number;
            name: string;
            code: string;
            imagenes?: Array<{ image?: string }>;
            marca?: { name?: string };
        }>;
        links?: Array<{ label: string; url: string | null; active: boolean }>;
    };
    id: number | string;
    metadatos?: { description?: string; keywords?: string };
    marca_id?: number | string | null;
}

export default function Productos() {
    const { categorias, marcas, productos, id, metadatos, marca_id } = usePage<ProductosPageProps>().props;


    const [categoriasDropdown, setCategoriasDropdown] = useState(true);
    const [marcasDropdown, setMarcasDropdown] = useState(true);

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
                    <CatalogSidebarSection
                        title="Categorias"
                        items={categorias}
                        activeId={id}
                        isOpen={categoriasDropdown}
                        onToggle={() => setCategoriasDropdown(!categoriasDropdown)}
                        searchPlaceholder="Buscar categoría"
                        emptyMessage="Sin categorías coincidentes."
                        getHref={(categoria) => `/productos/${categoria.id}`}
                    />
                    <CatalogSidebarSection
                        title="Marcas"
                        items={marcas}
                        activeId={marca_id}
                        isOpen={marcasDropdown}
                        onToggle={() => setMarcasDropdown(!marcasDropdown)}
                        searchPlaceholder="Buscar marca"
                        emptyMessage="Sin marcas coincidentes."
                        getHref={() => `/productos/${id}`}
                        getData={(marca) => ({ marca: marca.id })}
                    />
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
