import { Link, useForm } from "@inertiajs/react";
import React from "react";



export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        password: '',
        remember: false,
    });
    
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.login'));
    };

    return (
        <div className="flex flex-col gap-10 justify-center items-center w-screen h-screen bg-black/50 bg-opacity-50 fixed top-0 left-0 z-10">
            <div className="flex flex-col top-10 right-10 bg-white shadow-md p-5 font-roboto-condensed w-fit h-fit z-20 rounded-lg">
               
                <Link className="self-center py-5" href={"/"}>
                    <img src="" alt="" />
                </Link>

                <form
                    onSubmit={onSubmit}
                    className="w-fit h-full flex flex-col justify-around gap-8 "
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold" htmlFor="user">
                                Usuario
                            </label>
                            <input
                                value={data.name}
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setData('name', ev.target.value)}
                                className={`w-[328px] h-[45px] pl-3 outline ${errors.name ? 'outline-red-500' : 'outline-gray-300'} focus:outline-primary-orange transition duration-300 rounded-full`}
                                type="text"
                                name="user"
                                id="user"
                            />
                            {errors.name && (
                                <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                value={data.password}
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setData('password', ev.target.value)}
                                className={`w-[328px] h-[45px] pl-3 outline ${errors.password ? 'outline-red-500' : 'outline-gray-300'} focus:outline-primary-orange transition duration-300 rounded-full`}
                                type="password"
                                name="password"
                                id="password"
                            />
                            {errors.password && (
                                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-300 w-full h-[0.5px]"></div>

                    <button
                        className="w-[325px] h-[47px] bg-primary-orange font-bold rounded-full text-white self-center"
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? "Iniciando Sesion..." : "Iniciar Sesion"}
                    </button>
                </form>
            </div>
        </div>
    );
}