import { faFacebook, faInstagramSquare, faSquareWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard';
export default function ContactoAdmin() {
    const { contacto } = usePage().props;

    const { data, setData, post } = useForm({
        location: contacto?.location,
        phone: contacto?.phone,
        mail: contacto?.mail,
        wp: contacto?.wp,
        fb: contacto?.fb,
        ig: contacto?.ig,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.contacto.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Contacto actualizado correctamente');
            },
            onError: (errors) => {
                toast.error('Error al actualizar el contacto');
                console.log(errors);
            },
        });
    };

    return (
        <Dashboard>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6" action="">
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Banner</h2>

                <div className="col-span-2 w-full">
                    <label htmlFor="logoprincipal" className="block font-semibold text-gray-900">
                        Banner:
                        <br />
                        <span className="text-base font-normal">Resolucion recomendada: 1654x216 px</span>
                    </label>
                    <div className="mt-2 flex justify-between rounded-lg border shadow-lg">
                        <div className="h-[200px] w-2/3 bg-[rgba(0,0,0,0.2)]">
                            <img className="h-full w-full rounded-md object-cover" src={contacto?.banner} alt="" />
                        </div>
                        <div className="flex w-1/3 items-center justify-center">
                            <div className="h-fit items-center self-center text-center">
                                <div className="relative mt-4 flex flex-col items-center text-sm/6 text-gray-600">
                                    <label
                                        htmlFor="bannerImage"
                                        className="bg-primary-red relative cursor-pointer rounded-md px-2 py-1 font-semibold text-black"
                                    >
                                        <span>Cambiar Imagen</span>
                                        <input
                                            id="bannerImage"
                                            name="bannerImage"
                                            onChange={(e) => setData('banner', e.target.files[0])}
                                            type="file"
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="absolute top-10 max-w-[200px] break-words"> {data?.banner?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Contacto</h2>
                <div className="grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-8 max-sm:grid-cols-1">
                    <div className="flex w-full flex-row gap-2">
                        <div className="w-full">
                            <label htmlFor="username" className="flex flex-row items-center gap-2 text-sm/6 font-medium text-gray-900">
                                <FontAwesomeIcon color="#ff9e19" icon={faEnvelope} size="lg" />
                                <p>Mail</p>
                            </label>
                            <div className="mt-2">
                                <div className="focus-within:outline-primary-orange flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                    <input
                                        value={data.mail}
                                        onChange={(ev) => {
                                            setData('mail', ev.target.value);
                                        }}
                                        id="username"
                                        name="username"
                                        type="text"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <label htmlFor="wp" className="flex flex-row items-center gap-2 text-sm/6 font-medium text-gray-900">
                            <FontAwesomeIcon icon={faSquareWhatsapp} size="xl" color="#ff9e19" />
                            <p>WhatsApp</p>
                        </label>
                        <div className="mt-2">
                            <div className="focus-within:outline-primary-orange flex items-center rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2">
                                <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                <input
                                    value={data?.wp}
                                    onChange={(ev) => {
                                        setData('wp', ev.target.value);
                                    }}
                                    id="wp"
                                    name="username"
                                    type="text"
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="w-full">
                            <label htmlFor="telefono" className="flex flex-row items-center gap-2 text-sm/6 font-medium text-gray-900">
                                <FontAwesomeIcon color="#ff9e19" icon={faPhone} size={'lg'} />
                                <p>Telefono</p>
                            </label>
                            <div className="mt-2">
                                <div className="focus-within:outline-primary-orange flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                    <input
                                        value={data.phone}
                                        onChange={(ev) => {
                                            setData('phone', ev.target.value);
                                        }}
                                        id="telefono"
                                        name="username"
                                        type="text"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="w-full">
                            <label htmlFor="location" className="flex flex-row items-center gap-2 text-sm/6 font-medium text-gray-900">
                                <FontAwesomeIcon color="#ff9e19" icon={faLocationDot} size={'lg'} />
                                <p>Ubicacion</p>
                            </label>
                            <div className="mt-2">
                                <div className="focus-within:outline-primary-orange flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                    <input
                                        value={data.location}
                                        onChange={(ev) => {
                                            setData('location', ev.target.value);
                                        }}
                                        id="location"
                                        name="username"
                                        type="text"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="w-full">
                            <label htmlFor="fb" className="flex flex-row items-center gap-2 text-sm/6 font-medium text-gray-900">
                                <FontAwesomeIcon color="#ff9e19" icon={faFacebook} size={'lg'} />
                                <p>Facebook</p>
                            </label>
                            <div className="mt-2">
                                <div className="focus-within:outline-primary-orange flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                    <input
                                        value={data.fb}
                                        onChange={(ev) => {
                                            setData('fb', ev.target.value);
                                        }}
                                        id="fb"
                                        name="username"
                                        type="text"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="w-full">
                            <label htmlFor="ig" className="flex flex-row items-center gap-2 text-sm/6 font-medium text-gray-900">
                                <FontAwesomeIcon color="#ff9e19" icon={faInstagramSquare} size={'lg'} />
                                <p>Instagram</p>
                            </label>
                            <div className="mt-2">
                                <div className="focus-within:outline-primary-orange flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                    <input
                                        value={data.ig}
                                        onChange={(ev) => {
                                            setData('ig', ev.target.value);
                                        }}
                                        id="ig"
                                        name="username"
                                        type="text"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    <button className="text-primary-orange border-primary-orange hover:bg-primary-orange rounded-full border px-4 py-2 font-bold transition duration-300 hover:text-white">
                        Actualizar
                    </button>
                </div>
            </form>
        </Dashboard>
    );
}
