import {
    faBars,
    faBoxArchive,
    faChevronRight,
    faEnvelope,
    faGear,
    faHouse,
    faImage,
    faLock,
    faNewspaper,
    faShield,
    faStar,
    faUser,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import logo from '../../../../resources/images/logos/logo.png';

/* import bronzenLogo from "../assets/logos/bronzen-logo.png"; */

export default function Dashboard({ children }) {
    const { auth } = usePage().props;
    const { user } = auth;
    const currentRoute = usePage().url;

    // Obtenemos la ruta actual desde Inertia
    // Procesamos la ruta para mostrar el título de la página
    const cleanPathname = currentRoute.replace(/^\/+/, '').replace(/-/g, ' ').split('/');
    cleanPathname.shift();
    const finalPath = cleanPathname.join('/');
    const currentPath = cleanPathname[0]; // Para identificar la ruta actual

    // Usar localStorage para persistir el estado del sidebar
    const [sidebar, setSidebar] = useState(() => {
        // Verificar si estamos en el navegador antes de acceder a localStorage
        if (typeof window !== 'undefined') {
            const savedSidebar = localStorage.getItem('sidebarOpen');
            return savedSidebar !== null ? JSON.parse(savedSidebar) : true;
        }
        return true;
    });

    // Guardar el estado del sidebar en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('sidebarOpen', JSON.stringify(sidebar));
    }, [sidebar]);

    // Estructura inicial de los dropdowns
    const initialDropdowns = [
        {
            id: 'inicio',
            open: false,
            title: 'Inicio',
            icon: faHouse,
            href: '#',
            subHref: [
                { title: 'Contenido', href: 'bannerportada' },
                { title: 'Marcas', href: 'marcas' },
                { title: 'Instagram', href: 'instagram' },
            ],
        },
        {
            id: 'nosotros',
            open: false,
            title: 'Nosotros',
            icon: faUsers,
            href: 'nosotros',
            subHref: [
                { title: 'Contenido', href: 'nosotros' },
                { title: 'Valores', href: 'valores' },
            ],
        },
        {
            id: 'productos',
            open: false,
            title: 'Productos',
            icon: faBoxArchive,
            href: '#',
            subHref: [
                { title: 'Categorias', href: 'categorias' },
                { title: 'Productos', href: 'productos' },
                { title: 'Sub-productos', href: 'subproductos' },
                { title: 'Marcas', href: 'marcasProducto' },
            ],
        },
        {
            id: 'calidad',
            open: false,
            title: 'Calidad',
            icon: faStar,
            href: 'calidad',
            subHref: [
                { title: 'Contenido', href: 'calidad' },
                { title: 'Archivos', href: 'archivos' },
            ],
        },
        {
            id: 'novedades',
            open: false,
            title: 'Novedades',
            icon: faNewspaper,
            href: 'novedades',
            subHref: [
                { title: 'Banner', href: 'bannernovedades' },
                { title: 'Contenido', href: 'novedades' },
            ],
        },
        {
            id: 'contacto',
            open: false,
            title: 'Contacto',
            icon: faEnvelope,
            href: 'contacto',
            subHref: [],
        },
        {
            id: 'zonaprivada',
            open: false,
            title: 'Zona Privada',
            icon: faLock,
            href: '#',
            subHref: [
                { title: 'Clientes', href: 'clientes' },
                { title: 'Carrito', href: 'carrito' },
                { title: 'Mis Pedidos', href: 'pedidos' },
                { title: 'Lista de precios', href: 'listadeprecios' },
            ],
        },
        {
            id: 'administradores',
            open: false,
            title: 'Administradores',
            icon: faShield,
            href: 'administradores',
            barra: true,
            subHref: [],
        },
        {
            id: 'metadatos',
            open: false,
            title: 'Metadatos',
            icon: faGear,
            href: 'metadatos',
            subHref: [],
        },
        {
            id: 'logos',
            open: false,
            title: 'Logos',
            icon: faImage,
            href: 'logos',
            subHref: [],
        },
    ];

    // Estado para los dropdowns - con persistencia
    const [dropdowns, setDropdowns] = useState(() => {
        // Verificar si estamos en el navegador antes de acceder a localStorage
        if (typeof window !== 'undefined') {
            const savedDropdowns = localStorage.getItem('dropdownsState');
            return savedDropdowns !== null ? JSON.parse(savedDropdowns) : initialDropdowns;
        }
        return initialDropdowns;
    });

    // Efecto para actualizar el localStorage cuando cambian los dropdowns
    useEffect(() => {
        localStorage.setItem('dropdownsState', JSON.stringify(dropdowns));
    }, [dropdowns]);

    // Efecto para mantener abierto el dropdown correspondiente a la ruta actual
    useEffect(() => {
        if (currentPath) {
            // Buscar cuál dropdown contiene la ruta actual
            const updatedDropdowns = dropdowns.map((drop) => {
                // Si la ruta actual es la del dropdown principal o está en un subHref
                const isCurrentPathInDropdown = drop.href === currentPath || drop.subHref.some((sub) => sub.href === currentPath);

                return {
                    ...drop,
                    open: isCurrentPathInDropdown ? true : drop.open,
                };
            });

            setDropdowns(updatedDropdowns);
        }
    }, [currentPath]); // Solo se ejecuta cuando cambia la ruta actual

    const [userMenu, setUserMenu] = useState(false);

    const toggleDropdown = (id) => {
        setDropdowns((prevDropdowns) =>
            prevDropdowns.map((drop) => ({
                ...drop,
                open: drop.id === id ? !drop.open : drop.open, // Solo cambia el dropdown específico
            })),
        );
    };

    const logout = () => {
        router.post(
            '/logout',
            {},
            {
                onSuccess: () => {
                    // No es necesario manejar la redirección, Inertia lo hará automáticamente
                },
                onError: (error) => {
                    console.error('Error during logout:', error);
                    // Incluso si hay error, podemos intentar navegar manualmente
                    router.visit('/adm');
                },
            },
        );
    };

    return (
        <div className="font-red-hat flex flex-row">
            <Toaster />
            {/* Sidebar - sin animación inicial */}
            <div
                className={`scrollbar-hide flex h-screen w-[300px] flex-col overflow-y-auto bg-white text-black transition-transform duration-200 ${
                    sidebar ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Link href={'/'} className="flex w-full items-center justify-center p-6">
                    <img className="object-cover" src={logo} alt="" />
                </Link>
                <nav className="">
                    <ul className="">
                        {dropdowns.map((drop) => (
                            <li key={drop.id} className={drop.barra ? 'border-primary-orange border-t-2' : ''}>
                                {drop?.subHref.length > 0 ? (
                                    <button
                                        onClick={() => {
                                            toggleDropdown(drop.id);
                                        }}
                                        className="flex w-full flex-row items-center justify-between p-4"
                                    >
                                        <div className="flex flex-row items-center gap-2">
                                            <div className="flex h-4 w-4 items-center justify-center">
                                                <FontAwesomeIcon size="sm" icon={drop.icon} color="#ff9e19" />
                                            </div>

                                            <p>{drop.title}</p>
                                        </div>

                                        <FontAwesomeIcon
                                            className={`transform transition-transform duration-200 ${drop.open ? 'rotate-90' : 'rotate-0'}`}
                                            size="xs"
                                            icon={faChevronRight}
                                        />
                                    </button>
                                ) : (
                                    <Link href={drop.href} className="flex w-full flex-row items-center justify-between p-4">
                                        <div className="flex flex-row items-center gap-2">
                                            <div className="flex h-4 w-4 items-center justify-center">
                                                <FontAwesomeIcon size="sm" icon={drop.icon} color="#ff9e19" />
                                            </div>

                                            <p>{drop.title}</p>
                                        </div>
                                    </Link>
                                )}

                                {drop.open && drop.subHref.length > 0 && (
                                    <div
                                        className="overflow-hidden transition-all duration-300 ease-in-out"
                                        style={{ maxHeight: drop.open ? '500px' : '0' }}
                                    >
                                        <ul className="border-primary-orange ml-6 flex h-fit flex-col gap-2 border-l py-2">
                                            {drop.subHref.map((sub, index) => (
                                                <Link
                                                    className={`hover:bg-primary-orange mx-4 rounded-full px-2 py-1 transition duration-200 hover:text-white ${
                                                        currentPath === sub.href ? 'bg-primary-orange text-white' : ''
                                                    }`}
                                                    key={index}
                                                    href={sub.href}
                                                >
                                                    {sub.title}
                                                </Link>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="flex h-screen w-full flex-col overflow-y-auto bg-[#f5f5f5]">
                <div className="sticky top-0 z-50 flex flex-row items-center justify-between bg-white px-6 py-3 shadow-md">
                    <div className="flex flex-row gap-3">
                        <button onClick={() => setSidebar(!sidebar)}>
                            <FontAwesomeIcon icon={faBars} size="lg" color="#000" />
                        </button>
                        <h1 className="text-2xl">{finalPath.charAt(0).toUpperCase() + finalPath.slice(1) || 'Bienvenido al Dashboard'}</h1>
                    </div>

                    <div className="flex flex-row gap-3">
                        <div className="">
                            <h2 className="font-medium">{user?.name?.toUpperCase()}</h2>
                        </div>
                        <button className="relative" onClick={() => setUserMenu(!userMenu)}>
                            <FontAwesomeIcon color="#000" icon={faUser} />
                        </button>
                        {userMenu && (
                            <div className="absolute top-12 right-2 flex h-fit w-[300px] translate-y-0 transform flex-col items-start gap-4 border-2 bg-white p-4 opacity-100 transition-all duration-300 ease-in-out">
                                <Link method="post" href={route('admin.logout')} className="bg-primary-orange h-[40px] w-full text-white">
                                    Cerrar Sesion
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}
