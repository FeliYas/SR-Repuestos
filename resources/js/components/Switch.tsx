import { router } from '@inertiajs/react';
import { useState } from 'react';

const UserSwitch = ({ user }) => {
    const [isAutorizado, setIsAutorizado] = useState(user.autorizado);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = () => {
        setIsLoading(true);
        router.post(
            route('admin.clientes.autorizar'),
            { id: user.id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAutorizado(!isAutorizado);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return (
        <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" checked={isAutorizado} onClick={handleChange} disabled={isLoading} />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        </label>
    );
};

export default UserSwitch;
