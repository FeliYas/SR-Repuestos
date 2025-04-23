import { Link, usePage } from '@inertiajs/react';

export default function ProductosInicio() {
    const { categorias } = usePage().props;

    return (
        <div className="w-full bg-white py-20">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
                <h2 className="text-3xl font-bold">Productos</h2>
                <div className="flex w-full flex-row gap-4">
                    {categorias.map((categoria) => (
                        <Link
                            href={`/productos/${categoria?.id}`}
                            key={categoria?.id}
                            style={{ backgroundImage: `url(${categoria?.image})` }}
                            className="flex h-[282px] w-full items-end justify-center bg-cover bg-center bg-no-repeat py-8"
                        >
                            <p className="text-2xl font-medium text-white uppercase">{categoria?.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
