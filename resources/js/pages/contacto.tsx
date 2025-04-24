import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePage } from '@inertiajs/react';
import DefaultLayout from './defaultLayout';

export default function Contacto() {
    const { contacto } = usePage().props;

    const datos = [
        {
            name: contacto?.location,
            icon: faLocationDot,
            href: `https://maps.google.com/?q=${encodeURIComponent(contacto?.location || '')}`,
            target: '_blank',
        },
        {
            name: contacto?.phone,
            icon: faPhone,
            href: `tel:${contacto?.phone?.replace(/\s/g, '')}`,
        },
        {
            name: contacto?.wp,
            icon: faWhatsapp,
            href: `https://wa.me/${contacto?.wp?.replace(/[^0-9]/g, '')}`,
            target: '_blank',
        },
        {
            name: contacto?.mail,
            icon: faEnvelope,
            href: `mailto:${contacto?.mail}`,
        },
    ];

    return (
        <DefaultLayout>
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[400px] w-full items-center justify-center"
            >
                <img className="absolute h-full w-full object-cover object-center" src={contacto?.banner} alt="" />
                <h2 className="absolute text-4xl font-bold text-white">Contacto</h2>
            </div>
            <div className="mx-auto flex w-[1200px] flex-col gap-10 py-20">
                <h2 className="text-[32px] font-bold">Contacto</h2>
                <div className="flex flex-row">
                    <div className="flex w-1/3 flex-col gap-4">
                        {datos.map((dato, index) => (
                            <a
                                key={index}
                                href={dato.href}
                                target={dato.target}
                                className="flex flex-row items-center gap-3 transition-opacity hover:opacity-80"
                            >
                                <FontAwesomeIcon icon={dato?.icon} color="#fb7f01" size="lg" />
                                <p className="text-base text-[18px] text-[#74716A]">{dato?.name}</p>
                            </a>
                        ))}
                    </div>
                    <div className="grid w-2/3 grid-cols-2 grid-rows-4 gap-x-5 gap-y-10">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="name" className="text-base text-[#74716A]">
                                Nombre y Apellido*
                            </label>
                            <input type="text" id="name" className="h-[44px] w-full border border-[#EEEEEE]" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label htmlFor="email" className="text-base text-[#74716A]">
                                Email*
                            </label>
                            <input type="text" id="email" className="h-[44px] w-full border border-[#EEEEEE]" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label htmlFor="celular" className="text-base text-[#74716A]">
                                Celular*
                            </label>
                            <input type="text" id="celular" className="h-[44px] w-full border border-[#EEEEEE]" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label htmlFor="empresa" className="text-base text-[#74716A]">
                                Empresa*
                            </label>
                            <input type="text" id="empresa" className="h-[44px] w-full border border-[#EEEEEE]" />
                        </div>

                        <div className="row-span-2 flex flex-col gap-3">
                            <label htmlFor="Mensaje" className="text-base text-[#74716A]">
                                Mensaje*
                            </label>
                            <textarea id="Mensaje" className="h-full w-full border border-[#EEEEEE]" />
                        </div>

                        <div className="row-span-2 flex flex-col justify-end gap-3">
                            <p className="text-base text-[#74716A]">*Campos obligatorios</p>
                            <button className="bg-primary-orange text-bold min-h-[41px] w-full text-[16px] text-white">Enviar consulta</button>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18578.428530774283!2d-58.532772168741076!3d-34.5982727651881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb7bba0d8d4b5%3A0xdd9fda92a9a6264f!2sRoces%20Repuestos!5e0!3m2!1ses-419!2sar!4v1745515006936!5m2!1ses-419!2sar"
                        width="100%"
                        height="665px"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </DefaultLayout>
    );
}
