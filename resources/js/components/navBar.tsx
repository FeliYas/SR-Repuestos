import { Link, usePage } from '@inertiajs/react';

import logo from '../../../resources/images/logos/logo.png';

export default function NavBar() {
    const { bannerPortada } = usePage().props;

    const defaultLinks = [
        { title: 'Nosotros', href: '#' },
        { title: 'Productos', href: '#' },
        { title: 'Calidad', href: '#' },
        { title: 'Novedades', href: '#' },
        { title: 'Contacto', href: '#' },
    ];

    return (
        <div className="fixed top-0 z-50 h-[100px] w-full text-white">
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between">
                <div className="">
                    <img src={logo} alt="" />
                </div>
                <div className="flex flex-row items-center gap-7">
                    <div className="flex flex-row gap-7">
                        {defaultLinks.map((link, index) => (
                            <Link key={index} href={link.href} className="text-[15px] text-white hover:text-[#F2C94C]">
                                {link.title}
                            </Link>
                        ))}
                    </div>
                    <button className="h-[41px] w-[148px] border border-white">Zona Privada</button>
                </div>
            </div>
        </div>
    );
}
