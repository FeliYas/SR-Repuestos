import CatalogSidebarSection from '@/components/catalogSidebarSection';
import ProductCard from '@/components/productCard';
import SearchBarPrivate from '@/components/searchBarPrivate';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
    privateCatalog?: boolean;
}

export default function Productos() {
    const page = usePage<ProductosPageProps>();
    const { categorias, marcas, productos, id, metadatos, marca_id, privateCatalog } = page.props;
    const catalogBase = privateCatalog ? '/privada/productos' : '/productos';
    const categoryHref = (categoryId: number | string) =>
        privateCatalog ? `${catalogBase}/categoria/${categoryId}` : `${catalogBase}/${categoryId}`;
    const detailHref = (productoId: number) => {
        const href = `${categoryHref(id)}/${productoId}`;
        return privateCatalog ? `${href}?${new URLSearchParams({ back: page.url })}` : href;
    };

    const [categoriasDropdown, setCategoriasDropdown] = useState(true);
    const [marcasDropdown, setMarcasDropdown] = useState(true);

    return (
        <DefaultLayout>
            {privateCatalog && <SearchBarPrivate />}
            <Head>
                <meta name="description" content={metadatos?.description} />
                <meta name="keywords" content={metadatos?.keywords} />
            </Head>
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 md:flex-row md:gap-10 md:px-6 md:py-30">
                {!privateCatalog && (
                    <div className="z-40 mb-4 w-full text-[12px] text-[#74716A] md:absolute md:top-32 md:mb-0 md:w-auto">
                        <Link className="font-bold" href="/">
                            Inicio
                        </Link>{' '}
                        /{' '}
                        <Link className="font-bold" href={catalogBase}>
                            Productos
                        </Link>{' '}
                        / <Link href={categoryHref(id)}>{categorias?.find((cat) => cat.id == id)?.name}</Link>
                    </div>
                )}

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
                        getHref={(categoria) => categoryHref(categoria.id)}
                    />
                    <CatalogSidebarSection
                        title="Marcas"
                        items={marcas}
                        activeId={marca_id}
                        isOpen={marcasDropdown}
                        onToggle={() => setMarcasDropdown(!marcasDropdown)}
                        searchPlaceholder="Buscar marca"
                        emptyMessage="Sin marcas coincidentes."
                        getHref={() => categoryHref(id)}
                        getData={(marca) => ({ marca: marca.id })}
                    />
                </div>

                {/* Products Grid - responsive */}
                <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {productos.data?.map((producto) => <ProductCard key={producto.id} producto={producto} href={detailHref(producto.id)} />)}
                    <div className="col-span-full mt-4 flex w-full flex-wrap justify-center gap-1">
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
