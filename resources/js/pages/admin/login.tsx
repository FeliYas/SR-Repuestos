import { Link, useForm } from '@inertiajs/react';
// Assuming logo import works in your environment
import logo from '../../../images/logos/logo.png';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        password: '',
        remember: false,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('admin.login'));
    };

    return (
        <div className="bg-opacity-50 fixed top-0 left-0 z-10 flex h-screen w-screen flex-col items-center justify-center gap-10 bg-black/50">
            <div className="font-roboto-condensed top-10 right-10 z-20 flex h-fit w-fit flex-col rounded-lg bg-white p-5 shadow-md">
                <Link className="self-center py-5" href={'/'}>
                    <img src={logo} alt="Logo" />
                </Link>

                <form onSubmit={onSubmit} className="flex h-full w-fit flex-col justify-around gap-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold" htmlFor="user">
                                Usuario
                            </label>
                            <input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`h-[45px] w-[328px] rounded-full pl-3 transition duration-300 ${
                                    errors.name
                                        ? 'border-red-500 outline outline-red-500 focus:outline-red-500'
                                        : 'focus:outline-primary-orange outline outline-gray-300'
                                }`}
                                type="text"
                                name="user"
                                id="user"
                            />
                            {errors.name && <div className="mt-1 pl-3 text-sm text-red-500">{errors.name}</div>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`h-[45px] w-[328px] rounded-full pl-3 transition duration-300 ${
                                    errors.password
                                        ? 'border-red-500 outline outline-red-500 focus:outline-red-500'
                                        : 'focus:outline-primary-orange outline outline-gray-300'
                                }`}
                                type="password"
                                name="password"
                                id="password"
                            />
                            {errors.password && <div className="mt-1 pl-3 text-sm text-red-500">{errors.password}</div>}
                        </div>
                    </div>

                    <div className="h-[0.5px] w-full bg-gray-300"></div>

                    <button
                        className="bg-primary-orange h-[47px] w-[325px] self-center rounded-full font-bold text-white"
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? 'Iniciando Sesion...' : 'Iniciar Sesion'}
                    </button>
                </form>
            </div>
        </div>
    );
}
