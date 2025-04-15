import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axiosClient from "../axios";
import AdministradorRow from "../components/AdministradorRow";
import { useStateContext } from "../contexts/ContextProvider";

export default function Administradores() {
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setPassword_confirmation] = useState();
    const [createView, setCreateView] = useState(false);

    const { allAdmins, fetchAllAdmins } = useStateContext();
    const onSubmit = (ev) => {
        ev.preventDefault();

        axiosClient
            .post("/signup-admin", { name, password, password_confirmation })
            .then(({ data }) => {
                fetchAllAdmins();
                setCreateView(false);
                toast.success("Administrador creado correctamente");
            })
            .catch((err) => {
                toast.error("Error al crear el administrador");
            });
    };

    return (
        <div className="flex flex-col items-center h-screen py-10 px-6">
            <Toaster />
            <AnimatePresence>
                {createView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <form
                            onSubmit={onSubmit}
                            className="w-fit h-fit flex flex-col justify-around gap-3 bg-white rounded-md p-4"
                            action=""
                        >
                            <h2 className="font-bold text-[24px] py-5">
                                Crear Administrador
                            </h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="user">Usuario</label>
                                    <input
                                        value={name}
                                        onChange={(ev) =>
                                            setName(ev.target.value)
                                        }
                                        className="w-[328px] h-[45px] border pl-2"
                                        type="text"
                                        name="user"
                                        id="user"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="password">Contraseña</label>
                                    <input
                                        value={password}
                                        onChange={(ev) =>
                                            setPassword(ev.target.value)
                                        }
                                        className="w-[328px] h-[45px] border pl-2"
                                        type="password"
                                        name="password"
                                        id="password"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="password_confirmation">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        value={password_confirmation}
                                        onChange={(ev) =>
                                            setPassword_confirmation(
                                                ev.target.value
                                            )
                                        }
                                        className="w-[328px] h-[45px] border pl-2"
                                        type="password"
                                        name="password_confirmation"
                                        id="password_confirmation"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row justify-end gap-2">
                                <button
                                    onClick={() => setCreateView(false)}
                                    className="rounded-md py-1 px-2 bg-primary-red text-white self-center my-5"
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="rounded-md py-1 px-2 bg-primary-red text-white self-center"
                                    type="submit"
                                >
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex flex-row justify-between w-full py-5">
                <h2 className="text-2xl font-bold">Administradores</h2>
                <button
                    onClick={() => setCreateView(true)}
                    className="py-1 px-2 rounded-md text-white bg-primary-red"
                >
                    Registrar administrador
                </button>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center w-[200px]"
                        >
                            Administrador
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center w-[15%]"
                        >
                            Editar
                        </th>
                    </tr>
                </thead>
                <tbody className="border ">
                    {allAdmins.map((info, index) => (
                        <AdministradorRow key={index} adminObject={info} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
