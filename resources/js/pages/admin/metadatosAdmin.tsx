/* import ArchivoCalidadAdminRow from '@/components/archivoCalidadAdminRow'; */
import MetadatosAdminRow from '@/components/metadatosAdminRow';
import { usePage } from '@inertiajs/react';
import Dashboard from './dashboard';

export default function MetadatosAdmin() {
    const { metadatos } = usePage().props;

    return (
        <Dashboard>
            <div className="flex w-full flex-col p-6">
                <div className="mx-auto flex w-full flex-col gap-3">
                    <h2 className="border-primary-orange text-primary-orange text-bold w-full border-b-2 text-2xl">Metadatos</h2>

                    <div className="flex w-full justify-center">
                        <table className="w-full border text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="bg-gray-300 text-sm font-medium text-black uppercase">
                                <tr>
                                    <td className="h-[37px] text-center">SECCION</td>
                                    <td className="text-center">DESCRIPCION</td>
                                    <td className="text-center">KEYWORDS</td>
                                    <td className="text-center">EDITAR</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {metadatos?.map((metadato) => <MetadatosAdminRow key={metadato.id} metadato={metadato} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
