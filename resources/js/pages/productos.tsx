import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DefaultLayout from './defaultLayout';

export default function Productos() {
    const { categorias, marcas, productos } = usePage().props;

    const [categoriasDropdown, setCategoriasDropdown] = useState(false);
    const [marcasDropdown, setMarcasDropdown] = useState(false);

    return (
        <DefaultLayout>
            <div className="mx-auto flex w-[1200px] flex-row gap-10 py-20">
                {/* sidebar */}
                <div className="flex w-1/3 flex-col gap-10">
                    <div className="flex flex-col">
                        <button
                            onClick={() => setCategoriasDropdown(!categoriasDropdown)}
                            className="flex flex-row items-center justify-between border-b border-[#74716A] pr-2 pb-1"
                        >
                            <h2 className="text-[20px] font-semibold">Categorias</h2>
                            <FontAwesomeIcon
                                icon={faChevronUp}
                                color="#74716A"
                                className={`transition-transform duration-300 ${categoriasDropdown ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${categoriasDropdown ? 'max-h-[500px]' : 'max-h-0'}`}
                        >
                            <div className="flex flex-col">
                                {categorias.map((categoria, index) => (
                                    <div key={index} className="border-b border-[#74716A] py-2">
                                        <Link className="w-full text-[16px] text-[#74716A] transition-colors hover:text-black" href={'#'}>
                                            {categoria?.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button
                            onClick={() => setMarcasDropdown(!marcasDropdown)}
                            className="flex flex-row items-center justify-between border-b border-[#74716A] pr-2 pb-1"
                        >
                            <h2 className="text-[20px] font-semibold">Marcas</h2>
                            <FontAwesomeIcon
                                icon={faChevronUp}
                                color="#74716A"
                                className={`transition-transform duration-300 ${marcasDropdown ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${marcasDropdown ? 'max-h-[500px]' : 'max-h-0'}`}>
                            <div className="flex flex-col">
                                {marcas.map((marca, index) => (
                                    <div key={index} className="border-b border-[#74716A] py-2">
                                        <Link className="text-[16px] text-[#74716A] transition-colors hover:text-black" href={'#'}>
                                            {marca?.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    {productos.map((producto) => (
                        <Link href={'#'} key={producto?.id} className="flex h-[400px] w-[286px] flex-col border border-gray-200">
                            <div className="h-[287px] w-full border-b border-gray-200">
                                <img className="object-cove h-full w-full object-center" src={producto?.image} alt="" />
                            </div>
                            <div className="flex w-full flex-col gap-2 p-4">
                                <p className="text-primary-orange">
                                    {' '}
                                    <span className="font-bold">{producto?.code}</span> | {producto?.marca}
                                </p>
                                <h2 className="font-bold text-[#74716A]">{producto?.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
}
