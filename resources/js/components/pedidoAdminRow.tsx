import { useEffect, useRef, useState } from 'react';
import EmailTemplateAdmin from './emailTemplateAdmin';
import MiSwitch from './miSwitch';

export default function PedidoAdminRow({ pedido }) {
    const [pedidoView, setPedidoView] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        // Handle clicks outside the modal
        function handleClickOutside(event) {
            // Check if modalRef exists and if the click was outside the modal
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setPedidoView(false);
            }
        }

        // Add event listener when modal is open
        if (pedidoView) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [pedidoView]); // Re-run effect when pedidoView changes

    return (
        <>
            {pedidoView && (
                <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/50">
                    <div ref={modalRef}>
                        <EmailTemplateAdmin user={pedido?.user} productos={pedido?.productos} pedido={pedido} />
                    </div>
                </div>
            )}
            <tr className="odd:bg-gray-200">
                <td className="h-[90px]">{pedido?.id}</td>
                <td>{pedido?.user?.name}</td>
                <td>
                    <button>
                        <MiSwitch initialState={pedido?.entregado == 1 ? true : false} id={pedido?.id} />{' '}
                    </button>
                </td>
                <td>
                    <button
                        onClick={() => setPedidoView(true)}
                        className="bg-primary-orange hover:text-primary-orange hover:outline-primary-orange rounded-md px-4 py-2 font-bold text-white transition duration-300 hover:bg-transparent hover:outline"
                    >
                        VER PEDIDO
                    </button>
                </td>
            </tr>
        </>
    );
}
