import { usePage } from '@inertiajs/react';
import wpIcon from '../../images/iconos/wpIcon.png';

export default function Whatsapp() {
    const { contacto } = usePage().props;

    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/${contacto?.wp?.replace(/[^0-9]/g, '')}`}
            className="fixed right-0 bottom-0"
        >
            <img src={wpIcon} alt="" />
        </a>
    );
}
