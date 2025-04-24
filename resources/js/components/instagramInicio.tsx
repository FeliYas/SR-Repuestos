import { Link, usePage } from '@inertiajs/react';

export default function InstagramInicio() {
    const { instagram } = usePage().props;

    return (
        <div className="flex h-[417px] flex-col bg-[#202020] py-10">
            <div className="mx-auto flex h-full w-[1200px] flex-col gap-8">
                <h2 className="text-3xl font-bold text-white">Seguinos en instagram</h2>
                <div className="flex flex-row justify-between gap-4">
                    {instagram.map((item) => (
                        <Link href={item?.link} className="h-[285px] w-[288px]">
                            <img className="h-full w-full object-cover" src={item?.image} alt="" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
