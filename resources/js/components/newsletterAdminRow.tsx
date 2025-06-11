import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewsletterAdminRow({ categoria }) {
    const [edit, setEdit] = useState(false);

    const updateForm = useForm({
        email: categoria?.email,
        id: categoria?.id,
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateForm.post(route('admin.newsletter.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Mail actualizada correctamente');
                setEdit(false);
            },
            onError: (errors) => {
                toast.error('Error al actualizar mail');
                console.log(errors);
            },
        });
    };

    const deleteMarca = () => {
        if (confirm('¿Estas seguro de eliminar este mail?')) {
            updateForm.delete(route('admin.newsletter.destroy'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Mail eliminado correctamente');
                },
                onError: (errors) => {
                    toast.error('Error al eliminar mail');
                    console.log(errors);
                },
            });
        }
    };

    return (
        <tr className={`border text-black odd:bg-gray-100 even:bg-white`}>
            <td className="h-[90px] w-[90px]">{categoria?.email}</td>

            <td className="w-[140px] text-center">
                <div className="flex flex-row justify-center gap-3">
                    <button onClick={() => setEdit(true)} className="h-10 w-10 rounded-md border border-blue-500 px-2 py-1 text-white">
                        <FontAwesomeIcon icon={faPen} size="lg" color="#3b82f6" />
                    </button>
                    <button onClick={deleteMarca} className="h-10 w-10 rounded-md border border-red-500 px-2 py-1 text-white">
                        <FontAwesomeIcon icon={faTrash} size="lg" color="#fb2c36" />
                    </button>
                </div>
            </td>
            <AnimatePresence>
                {edit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 text-left"
                    >
                        <form onSubmit={handleUpdate} method="POST" className="text-black">
                            <div className="w-[500px] rounded-md bg-white p-4">
                                <h2 className="mb-4 text-2xl font-semibold">Actualizar Mail</h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="email">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="focus:outline-primary-orange rounded-md p-2 outline outline-gray-300 focus:outline"
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={updateForm?.data?.email}
                                        onChange={(e) => updateForm.setData('email', e.target.value)}
                                    />

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setEdit(false)}
                                            className="border-primary-orange text-primary-orange hover:bg-primary-orange rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="border-primary-orange text-primary-orange hover:bg-primary-orange rounded-md border px-2 py-1 transition duration-300 hover:text-white"
                                        >
                                            Actualizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </tr>
    );
}
