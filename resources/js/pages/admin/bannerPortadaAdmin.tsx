import Dashboard from '@/pages/admin/dashboard';
import { useForm, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';
export default function BannerPortadaAdmin() {
    const banner = usePage().props.banner;

    const { data, setData, errors, processing, post, reset } = useForm({
        title: banner?.title,
        desc: banner?.desc,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(data);

        post(route('admin.bannerportada.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Banner actualizado correctamente');
            },
            onError: (errors) => {
                toast.error('Error al actualizar el banner');
                console.log(errors);
            },
        });
    };

    return (
        <Dashboard>
            <Toaster />
            <form onSubmit={handleSubmit} className="flex h-fit flex-col justify-between gap-5 p-6">
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Video de portada</h2>

                <div className="">
                    <div className="">
                        <div className="flex flex-col gap-5">
                            <div className="sm:col-span-4">
                                <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">
                                    Titulo
                                </label>
                                <div className="mt-2">
                                    <div
                                        className={`flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 ${errors.title ? 'outline-red-500' : 'outline-gray-300'} focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600`}
                                    >
                                        <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                        <input
                                            value={data?.title}
                                            onChange={(ev) => setData('title', ev.target.value)}
                                            id="title"
                                            name="title"
                                            type="text"
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                        />
                                    </div>
                                    {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                                </div>
                            </div>

                            <div className="col-span-full flex flex-col gap-5">
                                <label htmlFor="video" className="block text-sm/6 font-medium text-gray-900">
                                    Video
                                </label>
                                <div className="mt-2 flex flex-col">
                                    <input
                                        type="file"
                                        id="video"
                                        name="video"
                                        onChange={(e) => setData('video', e.target.files[0])}
                                        className={`file:bg-primary-orange hover:file:bg-primary-orange/80 file:mr-5 file:cursor-pointer file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white ${errors.video ? 'w-1/2 rounded-full border border-red-500 px-2 py-1' : ''}`}
                                    />
                                    {errors.video && <p className="mt-2 text-sm text-red-600">{errors.video}</p>}
                                </div>
                                <div>{banner?.video && <video className="w-1/2" autoPlay controls src={banner?.video}></video>}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Banner de Inicio</h2>
                <div>
                    <div className="w-full">
                        <div className="py-4">
                            <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">
                                Texto
                            </label>
                            <div className="mt-2">
                                <div
                                    className={`flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 ${errors.desc ? 'outline-red-500' : 'outline-gray-300'} focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600`}
                                >
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                    <input
                                        value={data?.desc}
                                        onChange={(ev) => setData('desc', ev.target.value)}
                                        id="title"
                                        name="title"
                                        type="text"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                    />
                                </div>
                                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.desc}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between gap-5">
                        <div className="w-full">
                            <label htmlFor="logoprincipal" className="block text-xl font-medium text-gray-900">
                                Imagen
                            </label>
                            <div className="mt-2 flex justify-between rounded-lg border shadow-lg">
                                <div className="h-[200px] w-1/2 bg-[rgba(0,0,0,0.2)]">
                                    <img className="h-full w-full rounded-md object-cover" src={banner?.image} alt="" />
                                </div>
                                <div className="flex w-1/2 items-center justify-center">
                                    <div className="h-fit items-center self-center text-center">
                                        <div className="relative mt-4 flex flex-col items-center text-sm/6 text-gray-600">
                                            <label
                                                htmlFor="logoprincipal"
                                                className="bg-primary-red relative cursor-pointer rounded-md px-2 py-1 font-semibold text-black"
                                            >
                                                <span>Cambiar Imagen</span>
                                                <input
                                                    id="logoprincipal"
                                                    name="logoprincipal"
                                                    onChange={(e) => setData('image', e.target.files[0])}
                                                    type="file"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="absolute top-10 max-w-[200px] break-words"> {data?.image?.name} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <label htmlFor="secundario" className="block text-xl font-medium text-gray-900">
                                Logo
                            </label>
                            <div className="mt-2 flex justify-between rounded-lg border shadow-lg">
                                <div className="h-[200px] w-1/2 bg-[rgba(0,0,0,0.2)]">
                                    <img className="h-full w-full rounded-md object-cover" src={banner?.logo_banner} alt="" />
                                </div>
                                <div className="flex w-1/2 items-center justify-center">
                                    <div className="h-fit items-center self-center text-center">
                                        <div className="relative mt-4 flex flex-col items-center text-sm/6 text-gray-600">
                                            <label
                                                htmlFor="secundario"
                                                className="bg-primary-red relative cursor-pointer rounded-md px-2 py-1 font-semibold text-black"
                                            >
                                                <span>Cambiar Imagen</span>
                                                <input
                                                    id="secundario"
                                                    name="secundario"
                                                    onChange={(e) => setData('logo_banner', e.target.files[0])}
                                                    type="file"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="absolute top-10 max-w-[200px] break-words"> {data?.logo_banner?.name} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-start gap-x-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`bg-primary-orange rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-95 ${processing ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                        {processing ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </div>
            </form>
        </Dashboard>
    );
}
