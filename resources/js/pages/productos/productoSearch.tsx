import { Link, usePage } from '@inertiajs/react';
import defaultPhoto from '../../../images/logos/logobetter.png';
import DefaultLayout from '../defaultLayout';

export default function ProductoSearch() {
    const { productos, categorias, marcas } = usePage().props;

    return (
        <DefaultLayout>
            <div className="mx-auto flex w-[1200px] flex-col py-20">
                <div className="border-primary-orange border-b-2 py-2">
                    <h2 className="text-xl font-bold">Resultados de busqueda:</h2>
                </div>
                <div className="grid grid-cols-4 gap-y-10 py-10">
                    {productos?.map((producto, index) => (
                        <Link
                            href={`/productos/${producto?.categoria?.id}/${producto?.id}`}
                            key={producto?.id}
                            className="flex h-[400px] w-[286px] flex-col border border-gray-200"
                        >
                            <div className="h-[287px] w-full border-b border-gray-200">
                                <img
                                    className="h-full w-full object-contain object-center"
                                    src={producto?.imagenes[0]?.image || defaultPhoto}
                                    alt=""
                                />
                            </div>
                            <div className="flex w-full flex-col gap-2 p-4">
                                <p className="text-primary-orange">
                                    {' '}
                                    <span className="font-bold">{producto?.code}</span> | {producto?.marca?.name}
                                </p>
                                <h2 className="font-bold text-[#74716A]">{producto?.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
}
