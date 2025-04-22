import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axiosClient from '../axios';
import AdministradorRow from '../components/AdministradorRow';
import { useStateContext } from '../contexts/ContextProvider';

export default function Administradores() {
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setPassword_confirmation] = useState();
    const [createView, setCreateView] = useState(false);

    const { allAdmins, fetchAllAdmins } = useStateContext();
    const onSubmit = (ev) => {
        ev.preventDefault();

        axiosClient
            .post('/signup-admin', { name, password, password_confirmation })
            .then(({ data }) => {
                fetchAllAdmins();
                setCreateView(false);
                toast.success('Administrador creado correctamente');
            })
            .catch((err) => {
                toast.error('Error al crear el administrador');
            });
    };

    return (
        <div className="flex h-screen flex-col items-center px-6 py-10">
            <Toaster />
            <AnimatePresence>
                {createView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-opacity-50 fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black"
                    >
                        <form onSubmit={onSubmit} className="flex h-fit w-fit flex-col justify-around gap-3 rounded-md bg-white p-4" action="">
                            <h2 className="py-5 text-[24px] font-bold">Crear Administrador</h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="user">Usuario</label>
                                    <input
                                        value={name}
                                        onChange={(ev) => setName(ev.target.value)}
                                        className="h-[45px] w-[328px] border pl-2"
                                        type="text"
                                        name="user"
                                        id="user"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="password">Contraseña</label>
                                    <input
                                        value={password}
                                        onChange={(ev) => setPassword(ev.target.value)}
                                        className="h-[45px] w-[328px] border pl-2"
                                        type="password"
                                        name="password"
                                        id="password"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="password_confirmation">Confirmar Contraseña</label>
                                    <input
                                        value={password_confirmation}
                                        onChange={(ev) => setPassword_confirmation(ev.target.value)}
                                        className="h-[45px] w-[328px] border pl-2"
                                        type="password"
                                        name="password_confirmation"
                                        id="password_confirmation"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row justify-end gap-2">
                                <button
                                    onClick={() => setCreateView(false)}
                                    className="bg-primary-red my-5 self-center rounded-md px-2 py-1 text-white"
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button className="bg-primary-red self-center rounded-md px-2 py-1 text-white" type="submit">
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex w-full flex-row justify-between py-5">
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Administradores</h2>
                <button onClick={() => setCreateView(true)} className="bg-primary-red rounded-md px-2 py-1 text-white">
                    Registrar administrador
                </button>
            </div>

            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-[200px] px-6 py-3 text-center">
                            Administrador
                        </th>
                        <th scope="col" className="w-[15%] px-6 py-3 text-center">
                            Editar
                        </th>
                    </tr>
                </thead>
                <tbody className="border">
                    {allAdmins.map((info, index) => (
                        <AdministradorRow key={index} adminObject={info} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
