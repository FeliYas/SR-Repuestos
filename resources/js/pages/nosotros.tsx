import { usePage } from '@inertiajs/react';
import DefaultLayout from './defaultLayout';

export default function Nosotros() {
    const { nosotros } = usePage().props;

    const data = [
        { title: nosotros?.first_title, text: nosotros?.first_text },
        { title: nosotros?.second_title, text: nosotros?.second_text },
        { title: nosotros?.third_title, text: nosotros?.third_text },
    ];

    return (
        <DefaultLayout>
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[400px] w-full items-center justify-center"
            >
                <img className="absolute h-full w-full object-cover object-center" src={nosotros?.banner} alt="" />
                <h2 className="absolute text-4xl font-bold text-white">Nosotros</h2>
            </div>
            <div className="mx-auto flex w-[1200px] flex-row gap-10 py-20">
                <div className="h-[476px] w-full">
                    <img className="h-full w-full object-cover" src={nosotros.image} alt="" />
                </div>
                <div className="h-full w-full py-10">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold">{nosotros.title}</h2>
                        <div className="" dangerouslySetInnerHTML={{ __html: nosotros.text }} />
                    </div>
                </div>
            </div>
            <div className="w-full bg-[#F5F5F5] py-10">
                <div className="mx-auto flex w-[1200px] flex-col gap-4">
                    <h2 className="text-[30px] font-semibold">¿Por qué elegirnos?</h2>
                    <div className="flex-between flex">
                        {data.map((item, index) => (
                            <div key={index} className="flex w-full flex-col gap-4 px-10">
                                <h2 className="text-2xl font-bold">{item.title}</h2>
                                <div className="" dangerouslySetInnerHTML={{ __html: item.text }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
