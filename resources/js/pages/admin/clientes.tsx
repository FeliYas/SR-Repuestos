import ClientesAdminRow from '@/components/clientesAdminRow';
import { router, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Dashboard from './dashboard';

export default function Clientes() {
    const { clientes, provincias } = usePage().props;

    const { data, setData, post, reset } = useForm({
        name: '',
    });

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
        autorizado: 1,
    });

    const signup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signupForm.post(route('register'), {
            onSuccess: () => {
                setCreateView(false);
            },
            onError: (error) => {
                console.error('Error al registrar el cliente:', error);
            },
        });
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [createView, setCreateView] = useState(false);

    // Manejadores para la paginación del backend
    const handlePageChange = (page) => {
        router.get(
            route('admin.clientes'),
            {
                page: page,
                search: searchTerm,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Función para realizar la búsqueda
    const handleSearch = () => {
        router.get(
            route('admin.clientes'),
            {
                search: searchTerm,
                page: 1, // Resetear a la primera página al buscar
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <Dashboard>
            <div className="flex w-full flex-col p-6">
                <AnimatePresence>
                    {createView && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 text-left"
                        >
                            <form onSubmit={signup} className="flex h-fit w-[600px] flex-col gap-6 bg-white p-5 shadow-md">
                                <h2 className="text-xl font-bold text-black">Registrar cliente</h2>
                                <div className="grid w-full grid-cols-2 gap-3 text-[16px]">
                                    <div className="col-span-2 flex flex-col gap-2">
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

                                    <div className="col-span-2 flex flex-col gap-2">
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
                                        <label htmlFor="lista">Lista</label>
                                        <select
                                            className="focus:outline-primary-orange h-[45px] w-full pl-3 outline-1 outline-[#DDDDE0] transition duration-300"
                                            onChange={(e) => signupForm.setData('lista', e.target.value)}
                                            name=""
                                            id="lista"
                                        >
                                            <option disabled selected value="">
                                                Selecciona una lista
                                            </option>
                                            <option value="1">Lista 1</option>
                                            <option value="2">Lista 2</option>
                                            <option value="3">Lista 3</option>
                                        </select>
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
                                <div className="flex flex-row justify-between gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setCreateView(false)}
                                        className="bg-primary-orange col-span-2 h-[43px] w-full text-white"
                                    >
                                        Cancelar
                                    </button>
                                    <button className="bg-primary-orange col-span-2 h-[43px] w-full text-white">Regsitrar cliente</button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="mx-auto flex w-full flex-col gap-3">
                    <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Clientes</h2>
                    <div className="flex h-fit w-full flex-row gap-5">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-primary-orange w-[200px] rounded px-4 py-1 font-bold text-white hover:bg-orange-400"
                        >
                            Buscar
                        </button>
                        <button
                            onClick={() => setCreateView(true)}
                            className="bg-primary-orange w-[400px] rounded px-4 py-1 font-bold text-white hover:bg-orange-400"
                        >
                            Registrar cliente
                        </button>
                    </div>

                    <div className="flex w-full justify-center">
                        <table className="w-full border text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="bg-gray-300 text-sm font-medium text-black uppercase">
                                <tr>
                                    <td className="pl-5 text-left">CLIENTE</td>
                                    <td className="text-left">EMAIL</td>
                                    <td className="w-[400px] px-3 py-2 text-left">PROVINCIA</td>
                                    <td className="text-left">LOCALIDAD</td>
                                    <td className="text-center">LISTA</td>
                                    <td className="text-center">AUTORIZADO</td>

                                    <td className="text-center">EDITAR</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {clientes.data?.map((cliente) => <ClientesAdminRow key={cliente.id} cliente={cliente} />)}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación con datos del backend */}
                    <div className="mt-4 flex justify-center">
                        {clientes.links && (
                            <div className="flex items-center">
                                {clientes.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && handlePageChange(link.url.split('page=')[1])}
                                        disabled={!link.url}
                                        className={`px-4 py-2 ${
                                            link.active
                                                ? 'bg-primary-orange text-white'
                                                : link.url
                                                  ? 'bg-gray-300 text-black'
                                                  : 'bg-gray-200 text-gray-500 opacity-50'
                                        } ${index === 0 ? 'rounded-l-md' : ''} ${index === clientes.links.length - 1 ? 'rounded-r-md' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información de paginación */}
                    <div className="mt-2 text-center text-sm text-gray-600">
                        Mostrando {clientes.from || 0} a {clientes.to || 0} de {clientes.total} resultados
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
