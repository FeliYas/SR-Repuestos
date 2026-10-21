import { useForm, usePage } from '@inertiajs/react';

interface PrivateSearchProps {
    [key: string]: unknown;
    categorias?: Array<{ id: number; name: string }>;
    allcategorias?: Array<{ id: number; name: string }>;
    marcas?: Array<{ id: number; name: string }>;
    filters?: { categoria?: string; marca?: string; codigo?: string };
}

export default function SearchBarPrivate() {
    const { categorias, allcategorias, marcas } = usePage<PrivateSearchProps>().props;

    const { data, setData, get, processing } = useForm({
        categoria: '',
        marca: '',
        codigo: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        get(route('privada.productos.buscar'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    categoria: '',
                    marca: '',
                    codigo: '',
                });
            },
        });
    };

    return (
        <div className="bg-primary-orange w-full p-4 md:py-10">
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-center">
                <form onSubmit={handleSubmit} className="flex h-full w-full flex-col items-center gap-4 md:flex-row">
                    <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)} className="h-[55px] w-full bg-white pl-3">
                        <option value="">Todas las categorías</option>
                        {(allcategorias ?? categorias)?.map((categoria) => (
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
                        placeholder="Código o nombre de producto"
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
