import ListaDePreciosRow from '@/components/listadepreciosRow';
import { usePage } from '@inertiajs/react';
import DefaultLayout from '../defaultLayout';

export default function ListaDePrecios() {
    const { listaDePrecios } = usePage().props;

    return (
        <DefaultLayout>
            <div className="mx-auto min-h-[50vh] w-[1200px] py-20">
                <div className="col-span-2 grid w-full items-start">
                    <div className="w-full">
                        <div className="grid h-[52px] grid-cols-5 items-center bg-[#F5F5F5]">
                            <p></p>
                            <p>Nombre</p>
                            <p>Formato</p>
                            <p>Peso</p>
                            <p></p>
                        </div>
                        {listaDePrecios?.map((lista) => <ListaDePreciosRow key={lista?.id} lista={lista} />)}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
