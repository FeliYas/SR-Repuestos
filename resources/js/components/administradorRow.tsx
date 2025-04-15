import {
    faEdit,
    faPen,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AdministradorRow({ adminObject }) {
    const [edit, setEdit] = useState(false);

    const updateForm = useForm({
        name: adminObject.name,
        password: "",
        password_confirmation: "",
    });

    
    const update = (ev) => {
        ev.preventDefault();
        
        // Crear un objeto con solo los datos que queremos enviar
        const dataToSend = {
            name: updateForm.data.name
        };
        
        // Añadir campos de contraseña solo si no están vacíos
        if (updateForm.data.password) {
            dataToSend.password = updateForm.data.password;
        }
        
        if (updateForm.data.password_confirmation) {
            dataToSend.password_confirmation = updateForm.data.password_confirmation;
        }
        
        // Usar el método post directamente con los datos filtrados
        router.put(route('admin.update', adminObject?.id), dataToSend, {
            onSuccess: () => {
                toast.success("Administrador actualizado correctamente");
                setEdit(false);
            },
            onError: (errors) => {
                toast.error("Error al actualizar el administrador");
                console.log(errors);
            },
        });
    };

    const deleteAdmin = () => {
        router.delete(route('admin.destroy', adminObject?.id), {
            onSuccess: () => {
                toast.success("Administrador eliminado correctamente");
            },
            onError: (errors) => {
                toast.error("Error al eliminar el administrador");
            },
        });
        setEdit(false);
       
    }

    

    return (
        <>
            <tr
                className={`border-b  h-[134px] text-black ${
                    adminObject?.id % 2 === 0 ? "bg-gray-200" : "bg-white"
                }`}
            >
                <td className="px-6 py-4 font-medium text-black whitespace-nowrap  max-w-[340px] overflow-x-auto text-center">
                    {adminObject.name}
                </td>
                <td className="text-center">
                    <div className="flex flex-row gap-3 justify-center">
                        <button
                            onClick={() => setEdit(true)}
                            className="border-blue-500 border py-1 px-2 text-white rounded-md w-10 h-10"
                        >
                            <FontAwesomeIcon
                                icon={faPen}
                                size="lg"
                                color="#3b82f6"
                            />
                        </button>
                        <button
                        type="button"
                            onClick={deleteAdmin}
                            className="border-[#bc1d31] border py-1 px-2 text-white rounded-md w-10 h-10"
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                size="lg"
                                color="#bc1d31"
                            />
                        </button>
                    </div>
                </td>
            </tr>
            {edit && (
                <>
                    <div className="fixed w-screen h-screen top-0 left-0 bg-black opacity-50 z-50"></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 right-10 mb-20 bg-white shadow-md p-5 font-roboto-condensed w-fit h-fit border text-black z-50">
                        <button
                            onClick={() => setEdit(!edit)}
                            className="self-end"
                        >
                            <FontAwesomeIcon icon={faXmark} size="lg" />
                        </button>
                        <h2 className="font-bold text-[24px] py-5">
                            Actualizar Administrador
                        </h2>
                        <form
                            onSubmit={update}
                            className="w-fit h-full flex flex-col justify-around gap-3"
                            action=""
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="user">Usuario</label>
                                    <input
                                        value={updateForm.data.name}
                                        onChange={(ev) =>
                                            updateForm.setData('name', ev.target.value)
                                        }
                                        className={`w-[328px] h-[45px] border pl-2 ${
                                            updateForm.errors.name ? 'border-red-500' : ''
                                        }`}
                                        type="text"
                                        name="user"
                                        id="user"
                                    />
                                    {updateForm.errors.name && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {updateForm.errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="password">Contraseña</label>
                                    <input
                                        value={updateForm.data.password}
                                        onChange={(ev) =>
                                            updateForm.setData('password', ev.target.value)
                                        }
                                        className={`w-[328px] h-[45px] border pl-2 ${
                                            updateForm.errors.password ? 'border-red-500' : ''
                                        }`}
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Dejar en blanco para mantener la contraseña actual"
                                    />
                                    {updateForm.errors.password && (
                                        <div className="text-red-500 text-sm mt-1 max-w-[340px] break-words">
                                            {updateForm.errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="password_confirmation">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        value={updateForm.data.password_confirmation}
                                        onChange={(ev) =>
                                            updateForm.setData('password_confirmation',
                                                ev.target.value
                                            )
                                        }
                                        className={`w-[328px] h-[45px] border pl-2 ${
                                            updateForm.errors.password_confirmation ? 'border-red-500' : ''
                                        }`}
                                        type="password"
                                        name="password_confirmation"
                                        id="password_confirmation"
                                        placeholder="Dejar en blanco para mantener la contraseña actual"
                                    />
                                    {updateForm.errors.password_confirmation && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {updateForm.errors.password_confirmation}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                className="w-[325px] h-[47px] bg-primary-orange text-white self-center my-5"
                                type="submit"
                            >
                                Actualizar
                            </button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}