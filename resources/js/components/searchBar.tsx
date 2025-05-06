import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function SearchBar() {
    const { categorias, marcas } = usePage().props;
    const [isMobile, setIsMobile] = useState(false);

    const { data, setData, get, processing } = useForm({
        categoria: '',
        marca: '',
        codigo: '',
    });

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Verificar tamaño inicial
        checkScreenSize();

        // Añadir listener para cambios de tamaño
        window.addEventListener('resize', checkScreenSize);

        // Limpiar listener al desmontar
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('searchproducts'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-primary-orange w-full p-4 md:h-[147px] md:p-0">
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-center">
                <form onSubmit={handleSubmit} className={`flex w-full ${isMobile ? 'flex-col' : 'flex-row'} items-center gap-4`}>
                    <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)} className="h-[55px] w-full bg-white pl-3">
                        <option value="">Todas las categorías</option>
                        {categorias?.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.name}
                            </option>
                        ))}
                    </select>

                    <select value={data.marca} onChange={(e) => setData('marca', e.target.value)} className="h-[55px] w-full bg-white pl-3">
                        <option value="">Todas las marcas</option>
                        {marcas?.map((marca) => (
                            <option key={marca.id} value={marca.id}>
                                {marca.name}
                            </option>
                        ))}
                    </select>

                    <input
                        value={data.codigo}
                        onChange={(e) => setData('codigo', e.target.value)}
                        className="h-[55px] w-full bg-white pl-3"
                        type="text"
                        placeholder="Código de producto"
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="h-[55px] w-full bg-black text-white disabled:opacity-50 md:w-auto md:min-w-[184px]"
                    >
                        {processing ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
