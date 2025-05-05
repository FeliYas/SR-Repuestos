import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePage } from '@inertiajs/react';
export default function Footer() {
    const { contacto, logos } = usePage().props;

    const links = [
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Productos', href: '/productos' },
        { name: 'Calidad', href: '/calidad' },
        { name: 'Novedades', href: '/novedades' },
        { name: 'Contacto', href: '/contacto' },
    ];

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
        <div className="flex h-fit w-full flex-col bg-[#202020fc]">
            <div className="mx-auto flex h-full w-[1200px] flex-row items-start justify-between py-26">
                {/* logo redes */}
                <div className="flex h-full flex-col items-center gap-4">
                    <img src={logos?.logo_secundario} alt="" />
                    <div className="flex flex-row items-center justify-center gap-2">
                        {contacto?.fb && (
                            <a target="_blanck" href={contacto?.fb}>
                                <FontAwesomeIcon icon={faFacebookF} color="#E0E0E0" size="lg" />
                            </a>
                        )}
                        {contacto?.ig && (
                            <a target="_blanck" href={contacto?.ig}>
                                <FontAwesomeIcon icon={faInstagram} color="#E0E0E0" size="lg" />
                            </a>
                        )}
                    </div>
                </div>

                {/* secciones */}
                <div className="flex h-full flex-col gap-10">
                    <h2 className="text-lg font-bold text-white">Secciones</h2>
                    <div className="grid h-fit grid-flow-col grid-cols-2 grid-rows-3 gap-x-20 gap-y-3">
                        {links.map((link, index) => (
                            <a key={index} href={link.href} className="text-[15px] text-white/80">
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* newsletter */}
                <div className="flex h-full flex-col gap-10">
                    <h2 className="text-lg font-bold text-white">Suscribite al Newsletter</h2>
                    <div className="flex h-[44px] w-[287px] items-center justify-between border border-[#E0E0E0] px-3">
                        <input className="w-full text-white/80 outline-none focus:outline-none" placeholder="Email" type="text" />
                        <button>
                            <FontAwesomeIcon icon={faArrowRight} color="#fb7f01" />
                        </button>
                    </div>
                </div>

                {/* Datos de contacto */}
                <div className="flex h-full flex-col gap-10">
                    <h2 className="text-lg font-bold text-white">Datos de contacto</h2>
                    <div className="flex flex-col justify-center gap-4">
                        {datos.map((dato, index) => (
                            <a
                                key={index}
                                href={dato.href}
                                target={dato.target}
                                className="flex flex-row items-center gap-2 transition-opacity hover:opacity-80"
                            >
                                <FontAwesomeIcon icon={dato?.icon} color="#fb7f01" size="lg" />
                                <p className="text-base text-white/80">{dato?.name}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex h-[67px] w-full flex-row items-center justify-between bg-[#202020] text-[14px] text-white/80">
                <div className="mx-auto flex w-[1200px] flex-row items-center justify-between">
                    <p>© Copyright 2025 SR Repuestos. Todos los derechos reservados</p>
                    <a target="_blanck" href="https://osole.com.ar/">
                        By <span className="font-bold">Osole</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
