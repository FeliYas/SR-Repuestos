import SearchBar from '@/components/searchBar';
import { Link, usePage } from '@inertiajs/react';
import DefaultLayout from './defaultLayout';

export default function ProductosVistaPrevia() {
    const { categorias } = usePage().props;

    return (
        <DefaultLayout>
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[400px] w-full items-center justify-center"
            >
                <img className="absolute h-full w-full object-cover object-center" /* src={nosotros?.banner} */ alt="" />
                <h2 className="absolute text-4xl font-bold text-white">Productos</h2>
            </div>
            <SearchBar />
            <div className="w-full bg-white py-20">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
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
        </DefaultLayout>
    );
}
