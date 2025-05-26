import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import DefaultLayout from './defaultLayout';

export default function Calidad({ calidad, archivos, metadatos }) {
    const handleDownload = async (archivo) => {
        try {
            const filename = archivo.split('/').pop();
            // Make a GET request to the download endpoint
            const response = await axios.get(`/descargar/archivo/${filename}`, {
                responseType: 'blob', // Important for file downloads
            });

            // Create a link element to trigger the download
            const fileType = response.headers['content-type'] || 'application/octet-stream';
            const blob = new Blob([response.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'Catalogo'; // Descargar con el nombre original
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);

            // Optional: show user-friendly error message
            alert('Failed to download the file. Please try again.');
        }
    };

    console.log(archivos);

    return (
        <DefaultLayout>
            <Head>
                <meta name="description" content={metadatos?.description} />
                <meta name="keywords" content={metadatos?.keywords} />
            </Head>
            {/* Banner section - made responsive */}
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[250px] w-full items-center justify-center sm:h-[300px] md:h-[400px]"
            >
                {/* Breadcrumbs - made responsive */}
                <div className="absolute top-16 z-40 mx-auto w-full max-w-[1200px] px-4 text-[12px] text-white sm:top-20 md:top-26 md:px-0">
                    <Link className="font-bold" href={'/'}>
                        Inicio
                    </Link>{' '}
                    / <Link href={'/calidad'}>Calidad</Link>
                </div>
                <img className="absolute h-full w-full object-cover object-center" src={calidad?.banner} alt="" />
                <h2 className="absolute text-2xl font-bold text-white sm:text-3xl md:text-4xl">Calidad</h2>
            </div>

            {/* Main content - made responsive */}
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-10 md:flex-row md:gap-10 md:px-0 md:py-20">
                {/* Text and files section */}
                <div className="flex h-full w-full flex-col gap-6 py-6 md:py-10">
                    <div className="flex flex-col gap-4 md:gap-6">
                        <h2 className="text-2xl font-bold md:text-3xl">{calidad.title}</h2>
                        <div className="" dangerouslySetInnerHTML={{ __html: calidad.text }} />
                    </div>

                    {/* Files section */}
                    <div className="flex w-full flex-col gap-2">
                        {archivos.map((archivo, index) => (
                            <div key={index} className="flex h-[80px] w-full flex-row items-center border-gray-300 bg-[#F5F5F5]">
                                <div className="h-full min-w-[60px] sm:min-w-[80px]">
                                    <img className="h-full w-full object-contain" src={archivo?.image} alt="" />
                                </div>

                                <div className="flex w-full flex-row items-center justify-between px-3 sm:px-6">
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm sm:text-base">{archivo?.name}</p>
                                        <div className="flex flex-row gap-1">
                                            <p className="text-sm uppercase sm:text-base">{archivo?.archivo_formato}</p>
                                            <p>-</p>
                                            <p className="text-sm sm:text-base">{archivo?.archivo_peso}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleDownload(archivo?.archivo)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="sm:h-6 sm:w-6"
                                        >
                                            <path
                                                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3"
                                                stroke="#FB7F01"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image section - made responsive */}
                <div className="h-[300px] w-full sm:h-[400px] md:h-[476px]">
                    <img className="h-full w-full object-cover" src={calidad.image} alt="" />
                </div>
            </div>
        </DefaultLayout>
    );
}
