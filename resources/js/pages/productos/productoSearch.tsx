import CatalogSidebarSection from '@/components/catalogSidebarSection';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import defaultPhoto from '../../../images/logos/logobetter.png';
import DefaultLayout from '../defaultLayout';

interface CatalogItem {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name?: string;
    code?: string;
    categoria?: CatalogItem;
    marca?: CatalogItem;
    imagenes?: Array<{ image?: string }>;
}

interface SearchFilters {
    categoria: string;
    marca: string;
    codigo: string;
}

interface SearchPageProps {
    [key: string]: unknown;
    productos: {
        data: Product[];
        links: Array<{ label: string; url: string | null; active: boolean }>;
        total: number;
    };
    categorias: CatalogItem[];
    marcas: CatalogItem[];
    filters: SearchFilters;
}

export default function ProductoSearch() {
    const { productos, categorias, marcas, filters } = usePage<SearchPageProps>().props;
    const [categoriasDropdown, setCategoriasDropdown] = useState(true);
    const [marcasDropdown, setMarcasDropdown] = useState(true);

    const filterHref = (changedFilter: 'categoria' | 'marca', value: number) => {
        const params = new URLSearchParams();
        const nextFilters = { ...filters, [changedFilter]: String(value) };

        Object.entries(nextFilters).forEach(([key, filterValue]) => {
            if (filterValue) {
                params.set(key, filterValue);
            }
        });

        return `/busqueda?${params.toString()}`;
    };

    return (
        <DefaultLayout>
            <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 md:flex-row md:gap-10 md:px-6 md:py-20">
                <aside className="flex w-full flex-col gap-6 md:w-1/4 md:gap-10">
                    <CatalogSidebarSection
                        title="Categorias"
                        items={categorias}
                        activeId={filters.categoria}
                        isOpen={categoriasDropdown}
                        onToggle={() => setCategoriasDropdown((open) => !open)}
                        searchPlaceholder="Buscar categoría"
                        emptyMessage="Sin categorías coincidentes."
                        getHref={(categoria) => filterHref('categoria', categoria.id)}
                    />
                    <CatalogSidebarSection
                        title="Marcas"
                        items={marcas}
                        activeId={filters.marca}
                        isOpen={marcasDropdown}
                        onToggle={() => setMarcasDropdown((open) => !open)}
                        searchPlaceholder="Buscar marca"
                        emptyMessage="Sin marcas coincidentes."
                        getHref={(marca) => filterHref('marca', marca.id)}
                    />
                </aside>

                <section className="w-full md:w-3/4">
                    <div className="border-primary-orange border-b-2 py-2">
                        <h1 className="text-xl font-bold">Resultados de búsqueda</h1>
                        <p className="mt-1 text-sm text-[#74716A]">
                            {productos.total === 1 ? '1 producto encontrado' : `${productos.total} productos encontrados`}
                        </p>
                    </div>

                    {productos.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
                            {productos.data.map((producto) => (
                                <Link
                                    href={`/productos/${producto.categoria?.id}/${producto.id}`}
                                    key={producto.id}
                                    className="flex min-h-[360px] w-full flex-col border border-gray-200"
                                >
                                    <div className="h-[250px] w-full border-b border-gray-200">
                                        <img
                                            className="h-full w-full object-contain object-center"
                                            src={producto.imagenes?.[0]?.image || defaultPhoto}
                                            alt={producto.name || 'Producto'}
                                        />
                                    </div>
                                    <div className="flex w-full flex-col gap-2 p-4">
                                        <p className="text-primary-orange">
                                            <span className="font-bold">{producto.code}</span>
                                            {producto.marca?.name ? ` | ${producto.marca.name}` : ''}
                                        </p>
                                        <h2 className="font-bold text-[#74716A]">{producto.name}</h2>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="py-10 text-[#74716A]">No encontramos productos con esos criterios.</p>
                    )}

                    {productos.links.length > 3 && (
                        <nav className="mt-4 flex flex-wrap justify-center gap-1" aria-label="Paginación de resultados">
                            {productos.links.map((link, index) => (
                                <button
                                    key={`${link.label}-${index}`}
                                    type="button"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    disabled={!link.url}
                                    onClick={() => {
                                        if (link.url) {
                                            const url = new URL(link.url, window.location.origin);
                                            router.visit(`${url.pathname}${url.search}`);
                                        }
                                    }}
                                    className={`border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40 ${link.active ? 'bg-gray-300' : ''}`}
                                />
                            ))}
                        </nav>
                    )}
                </section>
            </main>
        </DefaultLayout>
    );
}
