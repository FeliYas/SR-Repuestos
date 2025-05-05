import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import DefaultLayout from './defaultLayout';

export default function Calidad() {
    const { calidad, archivos, metadatos } = usePage().props;

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

    return (
        <DefaultLayout>
            <Head>
                <meta name="description" content={metadatos?.description} />
                <meta name="keywords" content={metadatos?.keywords} />
            </Head>
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[400px] w-full items-center justify-center"
            >
                <div className="absolute top-26 z-40 mx-auto w-[1200px] text-[12px] text-white">
                    <Link className="font-bold" href={'/'}>
                        Inicio
                    </Link>{' '}
                    / <Link href={'/calidad'}>Calidad</Link>
                </div>
                <img className="absolute h-full w-full object-cover object-center" src={calidad?.banner} alt="" />
                <h2 className="absolute text-4xl font-bold text-white">Calidad</h2>
            </div>
            <div className="mx-auto flex w-[1200px] flex-row gap-10 py-20">
                <div className="flex h-full w-full flex-col gap-6 py-10">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold">{calidad.title}</h2>
                        <div className="" dangerouslySetInnerHTML={{ __html: calidad.text }} />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        {archivos.map((archivo) => (
                            <div className="flex h-[80px] w-full flex-row items-center border-gray-300 bg-[#F5F5F5]">
                                <div className="h-full min-w-[80px]">
                                    <img className="h-full w-full object-contain" src={archivo?.image} alt="" />
                                </div>

                                <div className="flex w-full flex-row items-center justify-between px-6">
                                    <div className="flex flex-col justify-center">
                                        <p>{archivo?.name}</p>
                                        <p>asdasdassad</p>
                                    </div>
                                    <button type="button" onClick={() => handleDownload(archivo?.archivo)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                <div className="h-[476px] w-full">
                    <img className="h-full w-full object-cover" src={calidad.image} alt="" />
                </div>
            </div>
        </DefaultLayout>
    );
}
