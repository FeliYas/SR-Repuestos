import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function MiSwitch({ initialState = false, onChange, disabled = false, id }) {
    const [isOn, setIsOn] = useState(initialState);

    const { post } = useForm({
        id: id,
    });

    const toggleSwitch = () => {
        if (disabled) return;

        const newState = !isOn;
        setIsOn(newState);

        if (onChange) {
            onChange(newState);
        }

        post(route('admin.pedidos.update'));
    };

    return (
        <div
            className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                isOn ? 'bg-blue-600' : 'bg-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={toggleSwitch}
            role="switch"
            aria-checked={isOn}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSwitch();
                }
            }}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    isOn ? 'translate-x-6' : 'translate-x-1'
                } absolute top-0.5 left-0.5`}
            />
        </div>
    );
}
