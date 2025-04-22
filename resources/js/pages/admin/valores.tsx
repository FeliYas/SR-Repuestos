import CustomReactQuill from '@/components/CustomReactQuill';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard';

export default function Valores() {
    const valores = usePage().props.valores;

    const [firstText, setFirstText] = useState(valores?.first_text || '');
    const [secondText, setSecondText] = useState(valores?.first_text || '');
    const [thirdText, setThirdText] = useState(valores?.first_text || '');

    const { data, setData, processing, post, reset } = useForm({
        first_title: '',
        second_title: '',
        third_title: '',
    });

    useEffect(() => {
        setData('first_text', firstText);
        setData('second_text', secondText);
        setData('third_text', thirdText);
    }, [firstText, secondText, thirdText]);

    useEffect(() => {
        setData('first_title', valores?.first_title);
        setData('second_title', valores?.second_title);
        setData('third_title', valores?.third_title);
    }, [valores]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('admin.valores.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Contenido actualizado correctamente');
            },
            onError: (errors) => {
                toast.error('Error al actualizar contenido');
                console.log(errors);
            },
        });
    };

    return (
        <Dashboard>
            <div className="flex flex-col gap-4 p-6">
                <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Valores</h2>
                <form className="flex flex-col" onSubmit={handleSubmit} action="">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="first_title">Titulo:</label>
                            <input
                                type="text"
                                id="first_title"
                                value={data.first_title}
                                onChange={(e) => setData('first_title', e.target.value)}
                                className="rounded-md border border-gray-300 p-2"
                            />
                            <label htmlFor="first_text">Texto:</label>
                            <CustomReactQuill onChange={setFirstText} value={firstText} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="second_title">Titulo:</label>
                            <input
                                type="text"
                                id="second_title"
                                value={data.second_title}
                                onChange={(e) => setData('second_title', e.target.value)}
                                className="rounded-md border border-gray-300 p-2"
                            />
                            <label htmlFor="second_text">Texto:</label>
                            <CustomReactQuill onChange={setSecondText} value={secondText} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="third_title">Titulo:</label>
                            <input
                                type="text"
                                id="third_title"
                                value={data.third_title}
                                onChange={(e) => setData('third_title', e.target.value)}
                                className="rounded-md border border-gray-300 p-2"
                            />
                            <label htmlFor="third_text">Texto:</label>
                            <CustomReactQuill onChange={setThirdText} value={thirdText} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="text-primary-orange border-primary-orange hover:bg-primary-orange mt-4 w-fit rounded-full border px-4 py-2 font-semibold transition duration-300 hover:text-white"
                    >
                        {processing ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </form>
            </div>
        </Dashboard>
    );
}
