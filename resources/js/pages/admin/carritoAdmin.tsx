import CustomReactQuill from '@/components/CustomReactQuill';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Dashboard from './dashboard';

export default function CarritoAdmin() {
    const { informacion } = usePage().props;

    const [text, setText] = useState(informacion?.text);

    const { post, setData, processing } = useForm({
        text: '',
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        post(route('admin.informacion.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Texto actualizado correctamente');
            },
            onError: () => {
                toast.error('Error al actualizar el texto');
            },
        });
    };

    useEffect(() => {
        setData('text', text);
    }, [text]);

    return (
        <Dashboard>
            <form onSubmit={handleUpdate} className="flex h-fit flex-col justify-between gap-5 p-6">
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Carrito</h2>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="title" className="block text-xl font-medium text-gray-900">
                            Informacion importante:
                        </label>

                        <CustomReactQuill onChange={setText} value={text} />
                    </div>
                </div>

                <div className="flex items-center justify-start gap-x-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`bg-primary-orange rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-95 ${processing ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                        {processing ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </div>
            </form>
        </Dashboard>
    );
}
