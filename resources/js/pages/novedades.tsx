import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import DefaultLayout from './defaultLayout';

export default function Novedades() {
    const { bannerNovedades, novedades } = usePage().props;

    return (
        <DefaultLayout>
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[400px] w-full items-center justify-center"
            >
                <img className="absolute h-full w-full object-cover object-center" src={bannerNovedades?.banner} alt="" />
                <h2 className="absolute text-4xl font-bold text-white">Novedades</h2>
            </div>
            <div className="w-full py-20">
                <div className="mx-auto w-[1200px]">
                    {novedades.map((novedad) => (
                        <Link
                            href={`/novedades/${novedad?.id}`}
                            className="flex h-[540px] w-full max-w-[392px] flex-col gap-2 border border-gray-300"
                        >
                            <div className="aspect-[392/575] max-h-[300px] w-full max-md:aspect-[1/1.5]">
                                <img className="h-full w-full object-cover" src={novedad?.image} alt="" />
                            </div>
                            <div className="flex h-full flex-col justify-between p-3">
                                <div className="flex flex-col gap-2">
                                    <p className="text-primary-orange text-sm font-bold uppercase">{novedad?.type}</p>
                                    <div>
                                        <p className="text-2xl font-bold">{novedad?.title}</p>
                                        <div dangerouslySetInnerHTML={{ __html: novedad?.text }} />
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
        </DefaultLayout>
    );
}
