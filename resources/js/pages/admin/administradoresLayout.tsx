import AdministradorRow from '@/components/administradorRow';
import Dashboard from '@/pages/admin/dashboard';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function Administradores() {

    const admins = usePage().props.admins;

    const [createView, setCreateView] = useState(false);

    const createForm = useForm({
        name: '',
        password: '',
        password_confirmation: ''
    });

    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      
      // Mostrar toast de carga
      const loadingToast = toast.loading('Procesando solicitud...');
      
      createForm.post('store', {
          onSuccess: () => {
              // Actualizar el toast de carga a un toast de éxito
              toast.dismiss(loadingToast);
              toast.success('¡Registro creado correctamente!');
              
              setCreateView(false);
              createForm.reset();
          },
          onError: (errors) => {
              // Actualizar el toast de carga a un toast de error
              toast.dismiss(loadingToast);
              toast.error('Error al crear el registro');
              
              console.log(errors);
              // No necesitamos hacer nada más aquí porque useForm maneja automáticamente 
              // los errores y los pone disponibles a través de createForm.errors
          }
      });
  };

  return (
    <Dashboard>
         <div className="flex flex-col items-center h-screen py-10 px-6">
                    <Toaster />
                    <AnimatePresence>
                        {createView && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50"
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
                                                value={createForm.data.name}
                                                onChange={(ev) =>
                                                    createForm.setData('name', ev.target.value)
                                                }
                                                className={`w-[328px] h-[45px] border pl-2 ${
                                                    createForm.errors.name ? 'border-red-500' : ''
                                                }`}
                                                type="text"
                                                name="user"
                                                id="user"
                                            />
                                            {createForm.errors.name && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {createForm.errors.name}
                                                </div>
                                            )}
                                        </div>
        
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="password">Contraseña</label>
                                            <input
                                                value={createForm.data.password}
                                                onChange={(ev) =>
                                                    createForm.setData('password', ev.target.value)
                                                }
                                                className={`w-[328px] h-[45px] border pl-2 ${
                                                    createForm.errors.password ? 'border-red-500' : ''
                                                }`}
                                                type="password"
                                                name="password"
                                                id="password"
                                            />
                                            {createForm.errors.password && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {createForm.errors.password}
                                                </div>
                                            )}
                                        </div>
        
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="password_confirmation">
                                                Confirmar Contraseña
                                            </label>
                                            <input
                                                value={createForm.data.password_confirmation}
                                                onChange={(ev) =>
                                                    createForm.setData('password_confirmation',
                                                        ev.target.value
                                                    )
                                                }
                                                className={`w-[328px] h-[45px] border pl-2 ${
                                                    createForm.errors.password_confirmation ? 'border-red-500' : ''
                                                }`}
                                                type="password"
                                                name="password_confirmation"
                                                id="password_confirmation"
                                            />
                                            {createForm.errors.password_confirmation && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {createForm.errors.password_confirmation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
        
                                    <div className="flex flex-row justify-end gap-2">
                                        <button
                                            onClick={() => setCreateView(false)}
                                            className="rounded-md py-1 px-2 bg-primary-orange text-white self-center my-5"
                                            type="button"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="rounded-md py-1 px-2 bg-primary-orange text-white self-center"
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
                            className="py-1 px-2 rounded-md text-white bg-primary-orange"
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
                            {admins.map((info) => (
                                <AdministradorRow key={info.id} adminObject={info} />
                            ))}
                        </tbody>
                    </table>
                </div>
    </Dashboard>
    
  )
}