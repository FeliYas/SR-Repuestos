import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';

export default function NovedadesInicio() {
    const { novedades } = usePage().props;

    const truncateString = (str: string, num: number) => {
        if (str?.length > num) {
            return str?.slice(0, num) + '...';
        }
        return str;
    };

    return (
        <div className="w-full py-20">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-3xl font-bold">Novedades</h2>
                    <Link
                        href={'#'}
                        className="text-primary-orange border-primary-orange hover:bg-primary-orange flex h-[41px] w-[127px] items-center justify-center border text-base font-semibold transition duration-300 hover:text-white"
                    >
                        Ver todas
                    </Link>
                </div>
                <div className="flex flex-row justify-between">
                    {novedades.map((novedad) => (
                        <Link href={`/novedades/${novedad?.id}`} className="flex w-full max-w-[392px] flex-col gap-2 border border-gray-300">
                            <div className="aspect-[392/575] max-h-[300px] w-full max-md:aspect-[1/1.5]">
                                <img className="h-full w-full object-cover" src={novedad?.image} alt="" />
                            </div>
                            <div className="flex h-full flex-col justify-between p-3">
                                <div className="flex flex-col gap-2">
                                    <p className="text-primary-orange text-sm font-bold uppercase">{novedad?.type}</p>
                                    <div>
                                        <p className="text-2xl font-bold">{novedad?.title}</p>
                                        <div dangerouslySetInnerHTML={{ __html: truncateString(novedad?.text, 120) }} />
                                    </div>
                                </div>
                                <button type="button" className="flex flex-row items-center justify-between">
                                    <p className="font-bold">Leer más</p>
                                    <FontAwesomeIcon icon={faArrowRight} size="lg" />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
