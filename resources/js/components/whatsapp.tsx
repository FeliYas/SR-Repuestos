import { usePage } from '@inertiajs/react';
import wpIcon from '../../images/iconos/wpIcon.png';

export default function Whatsapp() {
    const { contacto } = usePage().props;

    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/${contacto?.phone?.replace(/[^0-9]/g, '')}`}
            className="fixed right-15 bottom-30"
        >
            <img src={wpIcon} alt="" />
        </a>
    );
}
