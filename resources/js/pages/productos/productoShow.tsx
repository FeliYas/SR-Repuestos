import CatalogSidebarSection from '@/components/catalogSidebarSection';
import PrivateSubproductActions from '@/components/privateSubproductActions';
import ProductCard from '@/components/productCard';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import defaultPhoto from '../../../images/defaultPhoto.png';
import DefaultLayout from '../defaultLayout';

interface CatalogItem {
    id: number;
    name: string;
}

interface SubproductoItem {
    id: number;
    image?: string;
    code?: string;
    description?: string;
    medida?: string;
    componente?: string;
    caracteristicas?: string;
    price?: number | null;
    producto?: { name?: string; marca?: { name?: string } };
}

interface RelatedProduct {
    id: number;
    name: string;
    code?: string;
    categoria?: { id?: number };
    categoria_id?: number;
    marca?: { name?: string };
    imagenes?: Array<{ image?: string }>;
}

interface ProductoShowPageProps {
    [key: string]: unknown;
    producto: {
        id: number;
        name: string;
        aplicacion?: string;
        anio?: string;
        num_original?: string;
        tonelaje?: string;
        espigon?: string;
        bujes?: string;
        categoria?: { id?: number; name?: string };
        marca?: { name?: string };
        imagenes?: Array<{ image?: string }>;
    };
    categorias?: CatalogItem[];
    subproductos?: SubproductoItem[];
    productosRelacionados?: RelatedProduct[];
    privateCatalog?: boolean;
    backUrl?: string;
}

export default function ProductoShow() {
    const { producto, categorias, subproductos, productosRelacionados, privateCatalog, backUrl } = usePage<ProductoShowPageProps>().props;
    const catalogBase = privateCatalog ? '/privada/productos' : '/productos';
    const categoryHref = privateCatalog ? `/privada/productos/categoria/${producto?.categoria?.id}` : `/productos/${producto?.categoria?.id}`;

    const [categoriasDropdown, setCategoriasDropdown] = useState(false);
    const [currentImage, setCurrentImage] = useState<string>(producto?.imagenes?.[0]?.image ?? defaultPhoto);
    const [selectedSubproductoImage, setSelectedSubproductoImage] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement | null>(null);

    const hasValue = (value: unknown) => value !== null && value !== undefined && String(value).trim() !== '';
    const isRepuestosFrenos =
        String(producto?.categoria?.name ?? '')
            .trim()
            .toLowerCase() === 'repuestos y frenos';
    const privateGridColumns = isRepuestosFrenos
        ? 'lg:grid-cols-[64px_60px_minmax(90px,1fr)_68px_minmax(85px,1fr)_122px_156px]'
        : 'lg:grid-cols-[64px_60px_minmax(90px,1fr)_68px_60px_minmax(85px,1fr)_122px_156px]';
    const fieldLabelVisibility = privateCatalog ? 'lg:hidden' : 'md:hidden';

    useEffect(() => {
        setCurrentImage(producto?.imagenes?.[0]?.image ?? defaultPhoto);
    }, [producto?.id]);

    useEffect(() => {
        if (selectedSubproductoImage) {
            const handleClickOutside = (event: MouseEvent) => {
                if (modalRef.current && event.target instanceof Node && !modalRef.current.contains(event.target)) {
                    setSelectedSubproductoImage(null);
                }
            };

            const handleEscKey = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    setSelectedSubproductoImage(null);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscKey);

            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscKey);
                document.body.style.overflow = 'unset';
            };
        }
    }, [selectedSubproductoImage]);

    const openImageModal = (subproducto: SubproductoItem) => {
        const imageUrl = subproducto?.image || producto?.imagenes?.[0]?.image || defaultPhoto;
        setSelectedSubproductoImage(imageUrl);
    };

    return (
        <DefaultLayout>
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
                        /{' '}
                        <Link className="font-bold" href={categoryHref}>
                            {categorias?.find((cat) => cat.id == producto?.categoria?.id)?.name}
                        </Link>{' '}
                        / <span>{producto?.name}</span>
                    </div>
                )}

                {/* sidebar - responsive */}
                <div className="mb-6 flex w-full flex-col gap-6 md:mb-0 md:w-1/4 md:gap-10">
                    <CatalogSidebarSection
                        title="Categorias"
                        items={categorias}
                        isOpen={categoriasDropdown}
                        onToggle={() => setCategoriasDropdown(!categoriasDropdown)}
                        searchPlaceholder="Buscar categoría"
                        emptyMessage="Sin categorías coincidentes."
                        getHref={(categoria) => (privateCatalog ? `/privada/productos/categoria/${categoria.id}` : `/productos/${categoria.id}`)}
                    />
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
                                        className={`h-[66px] w-[66px] flex-shrink-0 border ${image?.image === currentImage ? 'border-primary-orange' : 'border-[#E0E0E0]'}`}
                                        key={index}
                                        onClick={() => setCurrentImage(image?.image ?? defaultPhoto)}
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
                                {producto?.categoria?.name?.toLowerCase() != 'repuestos y frenos' && hasValue(producto?.aplicacion) && (
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Aplicación</p>
                                        <p>{producto?.aplicacion}</p>
                                    </div>
                                )}

                                {hasValue(producto?.anio) && (
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Año</p>
                                        <p>{producto?.anio}</p>
                                    </div>
                                )}
                                {producto?.categoria?.name?.toLowerCase() != 'repuestos y frenos' && hasValue(producto?.num_original) && (
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Nº Original</p>
                                        <p>{producto?.num_original}</p>
                                    </div>
                                )}
                                {hasValue(producto?.tonelaje) && (
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Curva</p>
                                        <p>{producto?.tonelaje}</p>
                                    </div>
                                )}
                                {hasValue(producto?.espigon) && (
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Piton</p>
                                        <p>{producto?.espigon}</p>
                                    </div>
                                )}
                                {hasValue(producto?.bujes) && (
                                    <div className="flex flex-row justify-between border-b border-[#E0E0E0] py-2">
                                        <p>Bujes</p>
                                        <p>{producto?.bujes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link
                                    href={privateCatalog ? '/privada/contacto' : '/contacto'}
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
                        <div
                            className={`hidden min-h-[52px] items-center gap-2 bg-[#F5F5F5] px-4 text-sm ${privateCatalog ? `lg:grid lg:gap-1 lg:px-2 xl:gap-2 xl:px-4 ${privateGridColumns}` : `md:grid ${isRepuestosFrenos ? 'md:grid-cols-5' : 'md:grid-cols-6'}`}`}
                        >
                            <p></p>
                            <p>Código</p>
                            <p>Descripción</p>
                            <p>Medida</p>
                            {!isRepuestosFrenos && <p>Largo total</p>}
                            <p>Características</p>
                            {privateCatalog && <p>Precio</p>}
                            {privateCatalog && <p>Compra</p>}
                        </div>
                        {subproductos?.map((subproducto, index) => (
                            <div
                                key={subproducto.id ?? index}
                                className={`flex min-w-0 flex-col gap-2 border-b border-[#E0E0E0] py-3 text-sm text-[#74716A] ${privateCatalog ? `lg:grid lg:min-h-[72px] lg:items-center lg:gap-1 lg:px-2 xl:gap-2 xl:px-4 ${privateGridColumns}` : `md:grid md:min-h-[52px] md:items-center md:gap-2 md:px-4 ${isRepuestosFrenos ? 'md:grid-cols-5' : 'md:grid-cols-6'}`}`}
                            >
                                <button
                                    onClick={() => openImageModal(subproducto)}
                                    className={`hover:border-primary-orange my-2 rounded-sm border transition-all hover:shadow-md ${privateCatalog ? 'h-16 w-16' : 'h-[80px] w-[80px]'}`}
                                >
                                    <img
                                        className="h-full w-full rounded-sm object-contain"
                                        src={subproducto?.image || producto?.imagenes?.[0]?.image || defaultPhoto}
                                        onError={(e) => {
                                            e.currentTarget.src = defaultPhoto;
                                        }}
                                        alt={`${subproducto?.description || 'Subproducto'}`}
                                    />
                                </button>
                                <div className="flex min-w-0 justify-between gap-2 break-words lg:block">
                                    <p className={`font-semibold ${fieldLabelVisibility}`}>Código:</p>
                                    <p>{subproducto?.code}</p>
                                </div>
                                <div className="flex min-w-0 justify-between gap-2 break-words lg:block">
                                    <p className={`font-semibold ${fieldLabelVisibility}`}>Descripcion:</p>
                                    <p>{subproducto?.description}</p>
                                </div>
                                <div className="flex min-w-0 justify-between gap-2 break-words lg:block">
                                    <p className={`font-semibold ${fieldLabelVisibility}`}>Medida:</p>
                                    <p>{subproducto?.medida}</p>
                                </div>
                                {!isRepuestosFrenos && (
                                    <div className="flex min-w-0 justify-between gap-2 break-words lg:block">
                                        <p className={`font-semibold ${fieldLabelVisibility}`}>Largo total:</p>
                                        <p>{subproducto?.componente}</p>
                                    </div>
                                )}
                                <div className="flex min-w-0 justify-between gap-2 break-words lg:block">
                                    <p className={`font-semibold ${fieldLabelVisibility}`}>Características:</p>
                                    <p>{subproducto?.caracteristicas}</p>
                                </div>
                                {privateCatalog && (
                                    <div className="flex min-w-0 justify-between gap-2 lg:block">
                                        <p className="font-semibold lg:hidden">Precio:</p>
                                        <p className="font-semibold whitespace-nowrap text-[#202020]">
                                            {subproducto.price != null && subproducto.price > 0
                                                ? `$ ${Number(subproducto.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                : '—'}
                                        </p>
                                    </div>
                                )}
                                {privateCatalog && (
                                    <div className="flex justify-end lg:justify-start">
                                        <PrivateSubproductActions subproducto={subproducto} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* related products */}
                    <div className="flex flex-col gap-3 pt-10 md:pt-20">
                        <h2 className="text-[20px] font-semibold md:text-[24px]">Productos relacionados</h2>
                        {(productosRelacionados?.length ?? 0) > 0 ? (
                            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {productosRelacionados?.map((relacionado) => {
                                    const relatedCategoryId = relacionado?.categoria?.id ?? relacionado?.categoria_id;
                                    const relatedHref = relatedCategoryId
                                        ? `/productos/${relatedCategoryId}/${relacionado?.id}`
                                        : `/productos/${relacionado?.id}`;

                                    return (
                                        <ProductCard
                                            key={relacionado.id}
                                            producto={relacionado}
                                            href={
                                                privateCatalog
                                                    ? `/privada/productos/categoria/${relatedCategoryId}/${relacionado.id}?${new URLSearchParams({ back: backUrl || categoryHref })}`
                                                    : relatedHref
                                            }
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded border border-dashed border-gray-300 bg-white px-4 py-8 text-sm text-[#74716A]">
                                No se encontraron productos relacionados con estas reglas.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de imagen mejorado */}
            {selectedSubproductoImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div ref={modalRef} className="relative flex h-[90vh] w-[90vw] max-w-[1200px] items-center justify-center p-4">
                        {/* Botón de cerrar */}
                        <button
                            onClick={() => setSelectedSubproductoImage(null)}
                            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-all hover:scale-110 hover:bg-white"
                            aria-label="Cerrar imagen"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Contenedor de imagen con aspect ratio mantenido */}
                        <div className="flex h-full w-full items-center justify-center">
                            <img
                                className="max-h-full max-w-full object-contain drop-shadow-2xl"
                                src={selectedSubproductoImage}
                                alt="Vista ampliada"
                                onError={(e) => {
                                    e.currentTarget.src = defaultPhoto;
                                }}
                            />
                        </div>

                        {/* Texto informativo */}
                        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm text-gray-700">
                            Presiona ESC o haz clic fuera para cerrar
                        </p>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
}
