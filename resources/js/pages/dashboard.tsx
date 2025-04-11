import {
    faBars,
    faBoxArchive,
    faChevronRight,
    faEnvelope,
    faGear,
    faHouse,
    faLock,
    faNewspaper,
    faShield,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, router, usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/* import bronzenLogo from "../assets/logos/bronzen-logo.png"; */

export default function dashboard({ children }) {
    const { auth, productos, subProductos } = usePage().props;
    const { admin } = auth;

    useEffect(() => {
        // Ya no necesitamos fetchProductos y fetchSubProductos
        // Los datos vienen por props desde el servidor
    }, []);

    const [sidebar, setSidebar] = useState(true);
    
    const MotionFontAwesomeIcon = motion(FontAwesomeIcon);
    const MotionLink = motion.create(Link);

    // Obtenemos la ruta actual desde Inertia
    const currentRoute = usePage().url;
    
    // Procesamos la ruta para mostrar el título de la página
    const cleanPathname = currentRoute
        .replace(/^\/+/, "")
        .replace(/-/g, " ")
        .split("/");

    cleanPathname.shift();
    const finalPath = cleanPathname.join("/");

    const [dropdowns, setDropdowns] = useState([
        {
            id: "inicio",
            open: false,
            title: "Inicio",
            icon: faHouse,
            href: "#",
            subHref: [{ title: "Contenido", href: "/dashboard/contenido" }],
        },
        {
            id: "nuestros-productos",
            open: false,
            title: "Nuestros Productos",
            icon: faBoxArchive,
            href: "#",
            subHref: [
                { title: "Categorias", href: "/dashboard/categorias" },
                { title: "Sub-categorias", href: "/dashboard/sub-categorias" },
                {
                    title: "Productos",
                    href: "/dashboard/productos",
                },
                { title: "Sub-productos", href: "/dashboard/sub-productos" },
            ],
        },
        {
            id: "catalogo",
            open: false,
            title: "Catalogo",
            icon: faEnvelope,
            href: "/dashboard/catalogo",
            subHref: [],
        },
        {
            id: "somos-bronzen",
            open: false,
            title: "Somos Bronzen",
            icon: faUsers,
            href: "/dashboard/somos-bronzen",
            subHref: [],
        },
        {
            id: "contacto",
            open: false,
            title: "Contacto",
            icon: faEnvelope,
            href: "/dashboard/contacto",
            subHref: [],
        },
        {
            id: "zonaprivada",
            open: false,
            title: "Zona Privada",
            icon: faLock,
            href: "#",
            subHref: [
                { title: "Clientes", href: "/dashboard/clientes" },
                {
                    title: "Pedidos/Presupuestos",
                    href: "/dashboard/pedidos-privada",
                },
                {
                    title: "Mis Pedidos",
                    href: "/dashboard/mis-pedidos",
                },
                {
                    title: "Mis Facturas",
                    href: "/dashboard/mis-facturas",
                },
                {
                    title: "Informacion y descuento",
                    href: "/dashboard/informacion",
                },
            ],
        },
        {
            id: "administradores",
            open: false,
            title: "Administradores",
            icon: faShield,
            href: "/dashboard/administradores",
            subHref: [],
        },
        {
            id: "metadatos",
            open: false,
            title: "Metadatos",
            icon: faGear,
            href: "/dashboard/metadatos",
            subHref: [],
        },
        {
            id: "excel",
            open: false,
            title: "excel",
            icon: faGear,
            href: "/dashboard/excel",
            subHref: [],
        },
    ]);

    const [userMenu, setUserMenu] = useState(false);

    const toggleDropdown = (id) => {
        setDropdowns((prevDropdowns) =>
            prevDropdowns.map((drop) => ({
                ...drop,
                open: drop.id === id ? !drop.open : false,
            }))
        );
    };

    const logout = () => {
        // Usando Inertia para el logout
        router.post('/logout', {}, {
            onSuccess: () => {
                // No es necesario manejar la redirección, Inertia lo hará automáticamente
            },
            onError: (error) => {
                console.error("Error during logout:", error);
                // Incluso si hay error, podemos intentar navegar manualmente
                router.visit('/adm');
            }
        });
    };

    // Reemplazamos la verificación de token por la verificación de autenticación de Inertia
    /* if (!auth.admin) {
        // Inertia maneja la redirección de manera diferente
        router.visit('/adm');
        return null;
    } */

    return (
        <div className="flex flex-row font-red-hat">
            <AnimatePresence>
                {sidebar && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ ease: "linear", duration: 0.2 }}
                        className="flex flex-col h-screen w-[300px] bg-white text-black overflow-y-auto scrollbar-hide"
                    >
                        <Link href={"/"} className="w-full p-6">
                            <img
                                className="w-full h-full object-cover"
                                /* src={bronzenLogo} */
                                alt=""
                            />
                        </Link>
                        <nav className="">
                            <ul className="">
                                <AnimatePresence>
                                    {dropdowns.map((drop) => (
                                        <li key={drop.id}>
                                            <button
                                                onClick={() => {
                                                    if (drop.subHref.length === 0) {
                                                        router.visit(drop.href);
                                                    }
                                                    toggleDropdown(drop.id);
                                                }}
                                                className="flex flex-row w-full justify-between items-center p-4"
                                            >
                                                <div className="flex flex-row gap-2 items-center">
                                                    <button
                                                        type="button"
                                                        className="w-4 h-4 flex items-center justify-center"
                                                    >
                                                        <FontAwesomeIcon
                                                            size="sm"
                                                            icon={drop.icon}
                                                            color="#ff9e19"
                                                        />
                                                    </button>

                                                    <Link href={drop.href}>
                                                        {drop.title}
                                                    </Link>
                                                </div>
                                                {drop.subHref.length > 0 && (
                                                    <MotionFontAwesomeIcon
                                                        animate={{
                                                            rotate: drop.open
                                                                ? 90
                                                                : 0,
                                                        }}
                                                        transition={{
                                                            ease: "linear",
                                                            duration: 0.1,
                                                        }}
                                                        size="xs"
                                                        icon={faChevronRight}
                                                    />
                                                )}
                                            </button>
                                            <AnimatePresence>
                                                {drop.open &&
                                                    drop.subHref.length > 0 && (
                                                        <ul className="flex flex-col gap-2 overflow-hidden py-2 h-fit border-l border-primary-orange ml-6">
                                                            {drop.subHref.map(
                                                                (sub, index) => (
                                                                    <MotionLink
                                                                        className="mx-4 px-1"
                                                                        whileHover={{
                                                                            backgroundColor: "#000",
                                                                            color: "#fff",
                                                                        }}
                                                                        key={index}
                                                                        href={sub.href}
                                                                    >
                                                                        {sub.title}
                                                                    </MotionLink>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                            </AnimatePresence>
                                        </li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="w-full flex flex-col overflow-y-auto h-screen bg-[#f5f5f5]">
                <div className="sticky top-0 bg-white shadow-md py-3 flex flex-row justify-between items-center px-6 z-50">
                    <div className="flex flex-row gap-3">
                        <button onClick={() => setSidebar(!sidebar)}>
                            <FontAwesomeIcon
                                icon={faBars}
                                size="lg"
                                color="#000"
                            />
                        </button>
                        <h1 className="text-2xl">
                            {finalPath.charAt(0).toUpperCase() +
                                finalPath.slice(1) || "Bienvenido al Dashboard"}
                        </h1>
                    </div>

                    <div className="flex flex-row gap-3">
                        <div className="">
                            <h2 className="font-medium">
                                {admin?.name?.toUpperCase()}
                            </h2>
                        </div>
                        <button
                            className="relative"
                            onClick={() => setUserMenu(!userMenu)}
                        >
                            <FontAwesomeIcon color="#000" icon={faUser} />
                        </button>
                        <AnimatePresence>
                            {userMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{
                                        duration: 0.1,
                                        ease: "linear",
                                    }}
                                    className="flex flex-col items-start absolute border-2 shadow- w-[300px] h-fit right-2 top-10 p-4 bg-white gap-4"
                                >
                                    <button
                                        onClick={logout}
                                        className="bg-primary-gray text-white w-full h-[40px]"
                                    >
                                        Cerrar Sesion
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}