import { usePage } from '@inertiajs/react';

export default function BannerInicio() {
    const { bannerPortada } = usePage().props;

    return (
        <div className="flex h-[351px] w-full flex-row bg-[#202020]">
            <div className="w-full">
                <img className="h-full w-full object-cover" src={bannerPortada?.image} alt="" />
            </div>
            <div className="flex w-full flex-col justify-between px-20 py-14">
                <div>
                    <h2 className="text-3xl font-bold text-white">{bannerPortada?.desc}</h2>
                </div>
                <div className="h-full w-full overflow-hidden">
                    <img className="h-full w-full object-cover" src={bannerPortada?.logo_banner} alt="" />
                </div>
            </div>
        </div>
    );
}
