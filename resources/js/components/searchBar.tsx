import { usePage } from '@inertiajs/react';

export default function SearchBar() {
    const { categorias, marcas } = usePage().props;

    return (
        <div className="bg-primary-orange h-[147px] w-full">
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-center">
                <form className="flex h-full w-full flex-row items-center gap-4" action="">
                    <select className="h-[55px] w-full bg-white pl-3" name="" id="">
                        <option value="">Categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.name}
                            </option>
                        ))}
                    </select>
                    <select className="h-[55px] w-full bg-white pl-3" name="" id="">
                        <option value="">Marca</option>
                        {marcas.map((marcas) => (
                            <option key={marcas.id} value={marcas.id}>
                                {marcas.name}
                            </option>
                        ))}
                    </select>
                    <input className="h-[55px] w-full bg-white pl-3" type="text" placeholder="Código de producto" />
                    <button className="h-[55px] min-w-[184px] bg-black text-white">Buscar</button>
                </form>
            </div>
        </div>
    );
}
