import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import DefaultLayout from '../defaultLayout';

export default function NovedadesPrivadas() {
    const { novedadesPrivadas } = usePage().props;

    return (
        <DefaultLayout>
            <div className="w-full py-10 sm:py-16 md:py-20">
                <div className="mx-auto w-full max-w-[1200px] px-4 md:px-0">
                    <div className="mb-8 flex flex-col gap-2">
                        <p className="text-primary-orange text-sm font-bold uppercase">Zona privada</p>
                        <h1 className="text-3xl font-bold sm:text-4xl">Novedades</h1>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {novedadesPrivadas.map((novedadPrivada, index) => (
                            <Link
                                key={index}
                                href={`/privada/novedades/${novedadPrivada?.id}`}
                                className="flex h-fit w-full flex-col gap-2 border border-gray-300"
                            >
                                <div className="h-[474px] w-full overflow-hidden">
                                    <img className="h-full w-full object-cover" src={novedadPrivada?.image} alt="" />
                                </div>
                                <div className="flex h-full flex-col justify-between p-3">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-primary-orange text-sm font-bold uppercase">{novedadPrivada?.type}</p>
                                        <div>
                                            <p className="text-xl font-bold line-clamp-2 sm:text-2xl">{novedadPrivada?.title}</p>
                                            <div
                                                className="line-clamp-2 overflow-hidden text-sm break-words sm:text-base"
                                                dangerouslySetInnerHTML={{ __html: novedadPrivada?.text }}
                                            />
                                        </div>
                                    </div>
                                    <button type="button" className="mt-4 flex flex-row items-center justify-between">
                                        <p className="font-bold">Leer más</p>
                                        <FontAwesomeIcon icon={faArrowRight} size="lg" />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
