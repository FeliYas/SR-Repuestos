import EmailTemplate from '@/components/emailTemplate';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-hot-toast';
import DefaultLayout from './defaultLayout';

export default function Contacto() {
    const { contacto, metadatos, producto } = usePage().props;
    const [captchaToken, setCaptchaToken] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        celular: '',
        empresa: '',
        mensaje: producto || '',
    });

    const recaptchaRef = useRef(null);

    const completeContent = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificar si el captcha ha sido completado
        if (!captchaToken) {
            toast.error('Por favor, complete el captcha');
            return;
        }

        // Renderiza el template de email
        const htmlContent = ReactDOMServer.renderToString(
            <EmailTemplate
                info={{
                    name: data.name,
                    email: data.email,
                    celular: data.celular,
                    empresa: data.empresa,
                    mensaje: data.mensaje,
                }}
            />,
        );

        // Preparar los datos completos con el token de reCAPTCHA
        completeContent.data.html = htmlContent;
        completeContent.data.recaptchaToken = captchaToken;

        // Enviar el formulario
        completeContent.post(route('send.contact'), {
            onSuccess: () => {
                toast.success('Consulta enviada correctamente');
                reset();
                // Reset the reCAPTCHA
                recaptchaRef.current.reset();
                setCaptchaToken(null);
            },
            onError: () => {
                toast.error('Error al enviar la consulta');
                // Reset the reCAPTCHA on error as well
                recaptchaRef.current.reset();
                setCaptchaToken(null);
            },
        });
    };

    const onReCAPTCHAChange = (captchaCode) => {
        // Guardar el token del captcha para usarlo cuando se envíe el formulario
        setCaptchaToken(captchaCode);
    };

    const datos = [
        {
            name: contacto?.location,
            icon: faLocationDot,
            href: `https://maps.google.com/?q=${encodeURIComponent(contacto?.location || '')}`,
            target: '_blank',
        },
        {
            name: contacto?.phone,
            icon: faPhone,
            href: `tel:${contacto?.phone?.replace(/\s/g, '')}`,
        },
        {
            name: contacto?.wp,
            icon: faWhatsapp,
            href: `https://wa.me/${contacto?.wp?.replace(/[^0-9]/g, '')}`,
            target: '_blank',
        },
        {
            name: contacto?.mail,
            icon: faEnvelope,
            href: `mailto:${contacto?.mail}`,
        },
    ];

    return (
        <DefaultLayout>
            <Head>
                <meta name="description" content={metadatos?.description} />
                <meta name="keywords" content={metadatos?.keywords} />
            </Head>
            {/* Banner section - responsive */}
            <div
                style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 122.25%)' }}
                className="relative flex h-[250px] w-full items-center justify-center sm:h-[300px] md:h-[400px]"
            >
                {/* Breadcrumbs - responsive */}
                <div className="absolute top-16 z-40 mx-auto w-full max-w-[1200px] px-4 text-[12px] text-white sm:top-20 md:top-26 md:px-0">
                    <Link className="font-bold" href={'/'}>
                        Inicio
                    </Link>{' '}
                    / <Link href={'/contacto'}>Contacto</Link>
                </div>
                <img className="absolute h-full w-full object-cover object-center" src={contacto?.banner} alt="" />
                <h2 className="absolute text-2xl font-bold text-white sm:text-3xl md:text-4xl">Contacto</h2>
            </div>

            {/* Main content - responsive container */}
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 md:gap-10 md:px-0 md:py-20">
                <h2 className="text-2xl font-bold md:text-[32px]">Contacto</h2>

                {/* Contact info and form - responsive layout */}
                <div className="flex flex-col gap-8 md:flex-row md:gap-0">
                    {/* Contact details */}
                    <div className="mb-6 flex w-full flex-col gap-4 md:mb-0 md:w-1/3">
                        {datos.map((dato, index) => (
                            <a
                                key={index}
                                href={dato.href}
                                target={dato.target}
                                className="flex flex-row items-center gap-3 transition-opacity hover:opacity-80"
                            >
                                <FontAwesomeIcon icon={dato?.icon} color="#fb7f01" size="lg" />
                                <p className="text-base text-[16px] text-[#74716A] sm:text-[18px]">{dato?.name}</p>
                            </a>
                        ))}
                    </div>

                    {/* Contact form - responsive grid */}
                    <form onSubmit={handleSubmit} className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 md:w-2/3">
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <label htmlFor="name" className="text-base text-[#74716A]">
                                Nombre y Apellido*
                            </label>
                            <input
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                type="text"
                                id="name"
                                className="h-[44px] w-full border border-[#EEEEEE] pl-3"
                            />
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3">
                            <label htmlFor="email" className="text-base text-[#74716A]">
                                Email*
                            </label>
                            <input
                                value={data.email}
                                required
                                onChange={(e) => setData('email', e.target.value)}
                                type="text"
                                id="email"
                                className="h-[44px] w-full border border-[#EEEEEE] pl-3"
                            />
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3">
                            <label htmlFor="celular" className="text-base text-[#74716A]">
                                Celular*
                            </label>
                            <input
                                value={data.celular}
                                required
                                onChange={(e) => setData('celular', e.target.value)}
                                type="text"
                                id="celular"
                                className="h-[44px] w-full border border-[#EEEEEE] pl-3"
                            />
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3">
                            <label htmlFor="empresa" className="text-base text-[#74716A]">
                                Empresa*
                            </label>
                            <input
                                value={data.empresa}
                                required
                                onChange={(e) => setData('empresa', e.target.value)}
                                type="text"
                                id="empresa"
                                className="h-[44px] w-full border border-[#EEEEEE] pl-3"
                            />
                        </div>

                        {/* Message textarea - spans full width on mobile, row-span-2 on larger screens */}
                        <div className="flex flex-col gap-2 sm:col-span-2 sm:row-span-2 sm:gap-3 md:col-span-1">
                            <label htmlFor="Mensaje" className="text-base text-[#74716A]">
                                Mensaje*
                            </label>
                            <textarea
                                value={data.mensaje}
                                required
                                onChange={(e) => setData('mensaje', e.target.value)}
                                id="Mensaje"
                                className="h-[150px] w-full border border-[#EEEEEE] pt-2 pl-3 sm:h-full"
                            />
                        </div>

                        {/* Submit section - spans full width on mobile, row-span-2 on larger screens */}
                        <div className="flex flex-col justify-end gap-3 sm:col-span-2 sm:row-span-2 md:col-span-1">
                            <p className="text-base text-[#74716A]">*Campos obligatorios</p>
                            {/* ReCAPTCHA - responsive sizing */}
                            <div className="flex justify-center sm:justify-start">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={'6LeIDkorAAAAAIR0l7veV8LXj4TYsGDJ_v5zJBzX'} // Replace with your actual site key
                                    onChange={onReCAPTCHAChange}
                                    size="normal"
                                />
                            </div>
                            <button type="submit" className="bg-primary-orange text-bold min-h-[41px] w-full text-[16px] text-white">
                                Enviar consulta
                            </button>
                        </div>
                    </form>
                </div>

                {/* Map - responsive */}
                <div className="mt-4 w-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18578.428530774283!2d-58.532772168741076!3d-34.5982727651881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb7bba0d8d4b5%3A0xdd9fda92a9a6264f!2sRoces%20Repuestos!5e0!3m2!1ses-419!2sar!4v1745515006936!5m2!1ses-419!2sar"
                        width="100%"
                        height="300"
                        className="h-[300px] sm:h-[450px] md:h-[665px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </DefaultLayout>
    );
}
