import { useForm, usePage } from '@inertiajs/react';

export default function SearchBarPrivate() {
    const { categorias, marcas } = usePage().props;

    const { data, setData, get, processing } = useForm({
        categoria: '',
        marca: '',
        codigo: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('index.privada.subproductos'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-primary-orange h-[147px] w-full">
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-center">
                <form onSubmit={handleSubmit} className="flex h-full w-full flex-row items-center gap-4">
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

                    <button type="submit" disabled={processing} className="h-[55px] min-w-[184px] bg-black text-white disabled:opacity-50">
                        {processing ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
