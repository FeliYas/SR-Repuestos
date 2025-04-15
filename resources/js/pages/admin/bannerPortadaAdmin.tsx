import Dashboard from '@/pages/admin/dashboard';
import { useForm, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';



export default function BannerPortadaAdmin() {

    const banner = usePage().props.banner;
  
    const {data, setData, errors, processing, put} = useForm({
    title: banner?.title, 
    video: null
  });

  

  const handleSubmit = (e) => {
    e.preventDefault();
    

    put(route('admin.bannerportada.update', 1), {
        
        
        onSuccess: () => {
            toast.success("Banner actualizado correctamente");
        },
        onError: (errors) => {
            toast.error("Error al actualizar el banner");
            console.log(errors);
        },
        });
    }
    


  return (
    <Dashboard>
        <Toaster />
            <form
                onSubmit={handleSubmit}
                className="p-5 flex flex-col justify-between h-fit"
            >
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Titulo
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                        <input
                                            value={data.title}
                                            onChange={(ev) =>
                                                setData('title', ev.target.value)
                                            }
                                            id="username"
                                            name="username"
                                            type="text"
                                            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>

                            

                            <div className="col-span-full flex flex-col gap-5">
                                <label
                                    htmlFor="video"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Video
                                </label>
                                <div className="mt-2 flex flex-row items-center">

                                    <input
                                        type="file"
                                        id="video"
                                        name="video"
                                        onChange={(e) => setData('video', e.target.files[0])}
                                        className="file:mr-5 file:mr-5 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-orange file:text-white hover:file:bg-primary-orange/80 file:cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <video
                                        className="w-1/2"
                                        autoPlay
                                        controls
                                        src={banner?.video}
                                    ></video>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" flex items-center justify-start gap-x-6">
                        <button
                            type="submit"
                            className="rounded-full bg-primary-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:scale-95 transition-transform"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </form>
    </Dashboard>
  )
}
