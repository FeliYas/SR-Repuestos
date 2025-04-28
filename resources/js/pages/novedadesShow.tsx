import { usePage } from '@inertiajs/react';
import DefaultLayout from './defaultLayout';

export default function NovedadesShow() {
    const { novedad } = usePage().props;

    return (
        <DefaultLayout>
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[400px] w-full items-center justify-center"
            >
                <img className="absolute h-full w-full object-cover object-center" src={novedad?.image} alt="" />
                <div className="absolute flex flex-col">
                    <h2 className="text-4xl font-bold text-white">{novedad.title}</h2>
                    <p className="text-primary-orange text-center text-lg font-semibold">{novedad?.type}</p>
                </div>
            </div>
            <div className="mx-auto w-[1200px] py-20">
                <div dangerouslySetInnerHTML={{ __html: novedad?.text }} />
            </div>
        </DefaultLayout>
    );
}
