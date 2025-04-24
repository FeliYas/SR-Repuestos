import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import logo from '../../../resources/images/logos/logo.png';

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    const { ziggy } = usePage().props;

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Limpieza del event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const defaultLinks = [
        { title: 'Nosotros', href: '/nosotros' },
        { title: 'Productos', href: '/productos' },
        { title: 'Calidad', href: '/calidad' },
        { title: 'Novedades', href: '/novedades' },
        { title: 'Contacto', href: '/contacto' },
    ];

    return (
        <div
            className={`fixed top-0 z-50 h-[100px] w-full transition-all duration-300 ${ziggy.location.includes('productos') ? 'sticky shadow-md' : 'fixed'} ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
        >
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between">
                <Link href={'/'} className="">
                    <img src={logo} alt="" />
                </Link>
                <div className="flex flex-row items-center gap-7">
                    <div className="flex flex-row gap-7">
                        {defaultLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className={`text-[15px] ${scrolled || ziggy.location.includes('productos') ? 'text-black hover:text-[#F2C94C]' : 'text-white hover:text-[#F2C94C]'}`}
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>
                    <button
                        className={`h-[41px] w-[148px] ${
                            scrolled || ziggy.location.includes('productos')
                                ? 'border border-black text-black hover:bg-black hover:text-white'
                                : 'border border-white text-white hover:bg-white hover:text-black'
                        } transition-colors`}
                    >
                        Zona Privada
                    </button>
                </div>
            </div>
        </div>
    );
}
