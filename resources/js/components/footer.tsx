import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Footer() {
    const { contacto, logos } = usePage().props;
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };

        // Inicializar
        handleResize();

        // Agregar listener
        window.addEventListener('resize', handleResize);

        // Limpiar
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-center justify-between gap-10 px-4 py-10 lg:flex-row lg:items-start lg:gap-0 lg:px-0 lg:py-26">
                {/* logo redes */}
                <div className="flex h-full flex-col items-center gap-4">
                    <img src={logos?.logo_secundario} alt="Logo secundario" className="max-w-[200px] sm:max-w-full" />
                    <div className="flex flex-row items-center justify-center gap-4 sm:gap-2">
                        {contacto?.fb && (
                            <a target="_blank" rel="noopener noreferrer" href={contacto?.fb} aria-label="Facebook">
                                <FontAwesomeIcon icon={faFacebookF} color="#E0E0E0" size="lg" />
                            </a>
                        )}
                        {contacto?.ig && (
                            <a target="_blank" rel="noopener noreferrer" href={contacto?.ig} aria-label="Instagram">
                                <FontAwesomeIcon icon={faInstagram} color="#E0E0E0" size="lg" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Secciones y newsletter en tablet: una columna, dos filas */}
                <div className={`${isTablet ? 'flex flex-col items-center gap-10' : 'hidden flex-col gap-10 lg:flex'}`}>
                    <h2 className="text-lg font-bold text-white">Secciones</h2>
                    <div className="grid h-fit grid-flow-col grid-cols-2 grid-rows-3 gap-x-20 gap-y-3">
                        {links.map((link, index) => (
                            <a key={index} href={link.href} className="text-[15px] text-white/80">
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Secciones en mobile */}
                <div className={`${isMobile ? 'flex flex-col items-center gap-6' : 'hidden'}`}>
                    <h2 className="text-lg font-bold text-white">Secciones</h2>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                        {links.map((link, index) => (
                            <a key={index} href={link.href} className="text-[15px] text-white/80">
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* newsletter */}
                <div className={`flex h-full flex-col items-center gap-6 lg:items-start lg:gap-10`}>
                    <h2 className="text-lg font-bold text-white">Suscribite al Newsletter</h2>
                    <div className="flex h-[44px] w-full items-center justify-between border border-[#E0E0E0] px-3 sm:w-[287px]">
                        <input className="w-full bg-transparent text-white/80 outline-none focus:outline-none" placeholder="Email" type="text" />
                        <button>
                            <FontAwesomeIcon icon={faArrowRight} color="#fb7f01" />
                        </button>
                    </div>
                </div>

                {/* Datos de contacto */}
                <div className="flex h-full flex-col items-center gap-6 lg:items-start lg:gap-10">
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
                                <p className="max-w-[250px] text-base break-words text-white/80">{dato?.name}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex min-h-[67px] w-full flex-col items-center justify-center bg-[#202020] px-4 py-4 text-[14px] text-white/80 sm:flex-row sm:justify-between sm:px-6 lg:px-0">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-2 text-center sm:flex-row sm:justify-between sm:gap-0 sm:text-left">
                    <p>© Copyright 2025 SR Repuestos. Todos los derechos reservados</p>
                    <a target="_blank" rel="noopener noreferrer" href="https://osole.com.ar/" className="mt-2 sm:mt-0">
                        By <span className="font-bold">Osole</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
