import { usePage } from '@inertiajs/react';
import DefaultLayout from '../defaultLayout';

export default function NovedadesPrivadasShow() {
    const { novedadPrivada } = usePage().props;

    return (
        <DefaultLayout>
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[400px] w-full items-center justify-center"
            >
                <img className="absolute h-full w-full object-cover object-center" src={novedadPrivada?.image} alt="" />
                <div className="absolute flex flex-col">
                    <h2 className="text-center text-4xl font-bold text-white">{novedadPrivada?.title}</h2>
                    <p className="text-primary-orange text-center text-lg font-semibold">{novedadPrivada?.type}</p>
                </div>
            </div>
            <div className="mx-auto w-full max-w-[1200px] px-4 py-20 md:px-0">
                <div dangerouslySetInnerHTML={{ __html: novedadPrivada?.text }} />
            </div>
        </DefaultLayout>
    );
}
