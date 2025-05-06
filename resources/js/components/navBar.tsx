import { Link, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { ziggy, auth, provincias, logos } = usePage().props;
    const [signupView, setSignupView] = useState(false);
    const [loginView, setLoginView] = useState(false);

    const soloPrimeraMayuscula = (str) => {
        return str?.charAt(0)?.toUpperCase() + str?.slice(1);
    };

    const signupForm = useForm({
        name: '',
        password: '',
        password_confirmation: '',
        email: '',
        cuit: '',
        direccion: '',
        provincia: '',
        localidad: '',
        telefono: '',
        autorizado: 0,
    });

    const loginForm = useForm({
        name: '',
        password: '',
    });

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

    const privateLinks = [
        { title: 'Productos', href: '/privada/productos' },
        { title: 'Carrito', href: '/privada/carrito' },
        { title: 'Mis pedidos', href: '/privada/mispedidos' },
        { title: 'Lista de precios', href: '/privada/listadeprecios' },
    ];

    const login = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onSuccess: () => {
                setLoginView(false);
            },
        });
    };

    const signup = (e) => {
        e.preventDefault();
        signupForm.post(route('register'), {
            onSuccess: () => {
                setSignupView(false);
            },
        });
    };

    const handleViews = () => {
        if (signupView) {
            setSignupView(false);
        }
        if (loginView) {
            setLoginView(false);
        }
        if (!loginView && !signupView) {
            setLoginView(true);
        }

        // Close mobile menu when opening auth modals
        setMobileMenuOpen(false);
    };

    // Close modals when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Logic to close modals when clicking outside
            if (loginView || signupView) {
                const modals = document.querySelectorAll('.auth-modal');
                let clickedInsideModal = false;

                modals.forEach((modal) => {
                    if (modal.contains(event.target)) {
                        clickedInsideModal = true;
                    }
                });

                const authButton = document.getElementById('auth-button');
                if (!clickedInsideModal && !authButton.contains(event.target)) {
                    setLoginView(false);
                    setSignupView(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [loginView, signupView]);

    return (
        <div
            className={`fixed top-0 z-50 h-[70px] w-full transition-all duration-300 md:h-[100px] ${
                ziggy.location.includes('productos/') || ziggy.location.includes('busqueda') || ziggy.location.includes('privada')
                    ? 'sticky shadow-md'
                    : 'fixed'
            } ${
                scrolled || ziggy.location.includes('productos/') || ziggy.location.includes('busqueda') || ziggy.location.includes('privada')
                    ? 'bg-white shadow-md'
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 md:px-6 lg:px-0">
                <Link href={'/'} className="h-12 md:h-auto">
                    <img src={logos?.logo_principal} alt="" className="h-full object-contain" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden flex-row items-center gap-7 md:flex">
                    <div className="flex flex-row gap-7">
                        {ziggy.location.includes('privada')
                            ? privateLinks.map((link, index) => (
                                  <Link
                                      key={index}
                                      href={link.href}
                                      className={`text-[15px] ${ziggy.location.includes(link.title.toLowerCase()) ? 'font-bold' : ''} ${
                                          scrolled ||
                                          ziggy.location.includes('productos/') ||
                                          ziggy.location.includes('privada') ||
                                          ziggy.location.includes('busqueda')
                                              ? 'text-black hover:text-[#F2C94C]'
                                              : 'text-white hover:text-[#F2C94C]'
                                      }`}
                                  >
                                      {link.title}
                                  </Link>
                              ))
                            : defaultLinks.map((link, index) => (
                                  <Link
                                      key={index}
                                      href={link.href}
                                      className={`text-[15px] ${ziggy.location.includes(link.title.toLowerCase()) ? 'font-bold' : ''} ${
                                          scrolled ||
                                          ziggy.location.includes('productos/') ||
                                          ziggy.location.includes('privada') ||
                                          ziggy.location.includes('busqueda')
                                              ? 'text-black hover:text-[#F2C94C]'
                                              : 'text-white hover:text-[#F2C94C]'
                                      }`}
                                  >
                                      {link.title}
                                  </Link>
                              ))}
                    </div>
                    <div className="relative">
                        <button
                            id="auth-button"
                            type="button"
                            onClick={handleViews}
                            className={`h-[41px] w-[148px] ${
                                scrolled ||
                                ziggy.location.includes('productos/') ||
                                ziggy.location.includes('privada') ||
                                ziggy.location.includes('busqueda')
                                    ? 'border border-black text-black hover:bg-black hover:text-white'
                                    : 'border border-white text-white hover:bg-white hover:text-black'
                            } transition-colors ${auth.user ? 'bg-primary-orange text-white' : ''}`}
                        >
                            {auth.user ? soloPrimeraMayuscula(auth?.user?.name) : 'Zona Privada'}
                        </button>
                        {/* Auth Modals */}
                        <AnimatePresence>
                            {signupView && (
                                <motion.div
                                    className="auth-modal absolute top-16 right-0 z-20 flex h-fit w-[600px] max-w-[90vw] flex-col gap-2 bg-white p-5 shadow-md"
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                >
                                    <h2 className="py-5 text-[24px] font-bold">Registrarse</h2>
                                    <form onSubmit={signup} className="flex h-full w-full flex-col gap-6">
                                        <div className="grid w-full grid-cols-1 gap-3 text-[16px] md:grid-cols-2">
                                            <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
                                                <label htmlFor="name" className="">
                                                    Nombre de usuario
                                                </label>
                                                <input
                                                    onChange={(ev) => signupForm.setData('name', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="password">Contraseña</label>
                                                <input
                                                    onChange={(ev) => signupForm.setData('password', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="password_confirmation">Confirmar contraseña</label>
                                                <input
                                                    onChange={(ev) => signupForm.setData('password_confirmation', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    type="password"
                                                    name="password_confirmation"
                                                    id="password_confirmation"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    onChange={(ev) => signupForm.setData('email', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="dni">Cuit</label>
                                                <input
                                                    onChange={(ev) => signupForm.setData('cuit', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    type="text"
                                                    name="dni"
                                                    id="dni"
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="direccion">Dirección</label>
                                                <input
                                                    onChange={(ev) => signupForm.setData('direccion', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    type="text"
                                                    name="direccion"
                                                    id="direccion"
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="telefono">Telefono</label>
                                                <input
                                                    onChange={(ev) => signupForm.setData('telefono', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    type="text"
                                                    name="telefono"
                                                    id="telefono"
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="provincia">Provincia</label>
                                                <select
                                                    required
                                                    onChange={(ev) => signupForm.setData('provincia', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    name="provincia"
                                                    id="provincia"
                                                >
                                                    <option disabled selected value="">
                                                        Selecciona una provincia
                                                    </option>

                                                    {provincias?.map((pr) => (
                                                        <option key={pr.id} value={pr.name}>
                                                            {pr.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="localidad">Localidad</label>
                                                <select
                                                    required
                                                    onChange={(ev) => signupForm.setData('localidad', ev.target.value)}
                                                    className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                                    name="localidad"
                                                    id="localidad"
                                                >
                                                    <option disabled selected value="">
                                                        Selecciona una localidad
                                                    </option>

                                                    {provincias
                                                        ?.find((pr) => pr.name === signupForm?.data?.provincia)
                                                        ?.localidades.map((loc, index) => (
                                                            <option key={index} value={loc.name}>
                                                                {loc.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <button className="bg-primary-orange col-span-2 h-[43px] w-full text-white">Registrarse</button>
                                    </form>
                                    <div className="flex flex-row items-center justify-center gap-3">
                                        <p>¿Ya tienes una cuenta?</p>
                                        <button
                                            type="button"
                                            className="text-primary-orange py-3 underline"
                                            onClick={() => {
                                                setSignupView(false);
                                                setLoginView(true);
                                            }}
                                        >
                                            Iniciar Sesion
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {loginView && (
                                <motion.div
                                    className="auth-modal absolute top-16 right-0 flex h-fit w-[367px] max-w-[90vw] flex-col items-start justify-start gap-7 bg-white p-5 shadow-lg"
                                    initial={{ y: -30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -30, opacity: 0 }}
                                >
                                    {auth.user ? (
                                        <div className="flex w-full flex-col gap-2">
                                            <h2 className="text-2xl">Bienvenido, {auth.user?.name} !</h2>
                                            <p className="text-[16px]">{auth.user?.email}</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={login} className="flex w-full flex-col gap-5">
                                            <h2 className="text-2xl">Iniciar Sesion</h2>

                                            {loginForm.errors.name && (
                                                <div className="w-full rounded-md bg-red-100 p-3 text-red-700">{loginForm.errors.name}</div>
                                            )}

                                            <div className="flex w-full flex-col gap-2">
                                                <label className="text-[16px]" htmlFor="usuario">
                                                    Usuario
                                                </label>
                                                <input
                                                    onChange={(ev) => loginForm.setData('name', ev.target.value)}
                                                    type="text"
                                                    id="usuario"
                                                    className={`focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 transition duration-300 focus:outline ${loginForm.errors.name ? 'outline-red-500' : 'outline-[#DDDDE0]'}`}
                                                />
                                            </div>

                                            <div className="flex w-full flex-col gap-2">
                                                <label className="text-[16px]" htmlFor="password">
                                                    Contraseña
                                                </label>
                                                <input
                                                    onChange={(ev) => loginForm.setData('password', ev.target.value)}
                                                    type="password"
                                                    id="password"
                                                    className={`focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 transition duration-300 focus:outline ${loginForm.errors.password ? 'outline-red-500' : 'outline-[#DDDDE0]'}`}
                                                />
                                                {loginForm.errors.password && (
                                                    <span className="text-sm text-red-500">{loginForm.errors.password}</span>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                className="bg-primary-orange h-[51px] w-full text-white"
                                                disabled={loginForm.processing}
                                            >
                                                {loginForm.processing ? 'Iniciando...' : 'Iniciar sesion'}
                                            </button>
                                        </form>
                                    )}

                                    {auth.user && (
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            className="bg-primary-orange flex h-[51px] w-full items-center justify-center text-white"
                                        >
                                            Cerrar Sesion
                                        </Link>
                                    )}
                                    {!auth.user && (
                                        <>
                                            <div className="h-[1px] w-full bg-[#DDDDE0]"></div>
                                            <div className="flex w-full flex-row justify-center gap-3">
                                                <p>No estas registrado?</p>
                                                <button
                                                    onClick={() => {
                                                        setLoginView(false);
                                                        setSignupView(true);
                                                    }}
                                                    className="text-primary-orange underline"
                                                >
                                                    Registrate
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 ${
                            scrolled ||
                            ziggy.location.includes('productos/') ||
                            ziggy.location.includes('privada') ||
                            ziggy.location.includes('busqueda')
                                ? 'text-black'
                                : 'text-white'
                        }`}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="fixed top-[70px] right-0 left-0 z-40 overflow-hidden bg-white shadow-md"
                        >
                            <div className="flex flex-col p-4">
                                {ziggy.location.includes('privada')
                                    ? privateLinks.map((link, index) => (
                                          <Link
                                              key={index}
                                              href={link.href}
                                              className={`py-3 text-[16px] ${
                                                  ziggy.location.includes(link.title.toLowerCase()) ? 'font-bold' : ''
                                              } text-black hover:text-[#F2C94C]`}
                                              onClick={() => setMobileMenuOpen(false)}
                                          >
                                              {link.title}
                                          </Link>
                                      ))
                                    : defaultLinks.map((link, index) => (
                                          <Link
                                              key={index}
                                              href={link.href}
                                              className={`py-3 text-[16px] ${
                                                  ziggy.location.includes(link.title.toLowerCase()) ? 'font-bold' : ''
                                              } text-black hover:text-[#F2C94C]`}
                                              onClick={() => setMobileMenuOpen(false)}
                                          >
                                              {link.title}
                                          </Link>
                                      ))}
                                <button
                                    onClick={handleViews}
                                    className={`mt-4 py-3 text-[16px] ${auth.user ? 'text-primary-orange font-semibold' : 'text-black'}`}
                                >
                                    {auth.user ? soloPrimeraMayuscula(auth?.user?.name) : 'Zona Privada'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
