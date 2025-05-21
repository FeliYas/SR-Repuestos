import PedidoTemplate from '@/components/pedidoTemplate';
import SubproductosPrivadaRow from '@/components/subproductosPrivadaRow';
import { Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useCart } from 'react-use-cart';
import DefaultLayout from '../defaultLayout';

//import PedidoTemplate from "../components/PedidoTemplate";
//import ProductRow from "../components/ProductRow";

export default function Carrito() {
    const { informacion, auth } = usePage().props;
    const { user } = auth;
    const { items, emptyCart } = useCart();

    const [selected, setSelected] = useState('retiro');
    const [subtotal, setSubtotal] = useState();
    const [iva, setIva] = useState();
    const [iibb, setIibb] = useState();
    const [totalFinal, setTotalFinal] = useState();
    const [tipo_entrega, setTipo_entrega] = useState('retiro cliente');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const [succ, setSucc] = useState(false);
    const [succID, setSuccID] = useState();

    useEffect(() => {
        let subtotal = 0;
        let iva = 0;
        let iibb = 0;
        let total = 0;

        items.forEach((prod) => {
            subtotal += prod.price * prod.quantity;
        });

        iibb = subtotal * 0.03; // 3% de IIBB
        iva = subtotal * 0.21; // 21% de IVA
        total = subtotal + iva + iibb; // Total final

        setSubtotal(subtotal);
        setIibb(iibb);
        setIva(iva);
        setTotalFinal(total);
    }, [items]);

    const pedidoForm = useForm({
        tipo_entrega: tipo_entrega,
        subtotal: subtotal,
        iva: iva,
        iibb: iibb,
        total: totalFinal,
        user_id: user?.id,
    });

    const emailForm = useForm({
        html: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(false);

        try {
            // Primero, crear el pedido principal
            const pedidoResponse = pedidoForm.post(route('pedido.store'), {
                preserveScroll: true,
                onSuccess: async (response) => {
                    const pedidoId = response.props.flash.pedido_id; // Asegúrate de que el ID del pedido se retorne correctamente desde el backend
                    // o donde retornes el ID

                    const productPromises = items.map((prod) => {
                        return axios.post(route('pedidoProducto.store'), {
                            pedido_id: Number(pedidoId),
                            subproducto_id: prod.id,
                            cantidad: prod.quantity,
                            subtotal_prod: prod.price,
                        });
                    });

                    await Promise.all(productPromises);

                    // Generar y enviar email
                    const htmlContent = ReactDOMServer.renderToString(
                        <PedidoTemplate pedido={{ ...pedidoForm.data, id: pedidoId }} user={user} productos={items} />,
                    );

                    emailForm.setData('html', htmlContent);

                    await axios
                        .post(route('sendPedido'), {
                            html: htmlContent,
                            attachments: pedidoForm.data.archivo,
                        })
                        .then(() => {
                            emptyCart();
                            setSucc(true);
                            setSuccID(pedidoId);
                        });
                },
                onError: (errors) => {
                    setError(true);
                    console.error(errors);
                },
            });
        } catch (err) {
            setError(true);
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Actualizar los valores del formulario cuando cambien
    useEffect(() => {
        pedidoForm.setData({
            tipo_entrega: tipo_entrega,
            subtotal: subtotal,
            iva: iva,
            iibb: iibb,
            total: totalFinal,
            user_id: user?.id,
        });
    }, [tipo_entrega, subtotal, iva, iibb, totalFinal, user]);

    return (
        <DefaultLayout>
            <div className="mx-auto grid w-[1200px] grid-cols-2 gap-10 py-20 max-sm:px-4">
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-10 left-[45%] rounded-lg bg-red-500 p-3 text-white"
                        >
                            <p>Error al enviar el pedido</p>
                        </motion.div>
                    )}
                    {succ && (
                        <div>
                            <div className="fixed top-0 left-0 h-screen w-screen bg-black opacity-50"></div>
                            <div className="fixed top-1/2 left-1/2 flex h-[343px] w-[642px] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-evenly bg-white text-black shadow-lg">
                                <h1 className="text-[32px] font-bold">Pedido confirmado</h1>
                                <div className="flex flex-col items-center gap-8">
                                    <p className="w-[90%] text-center text-[#515A53]">
                                        Su pedido #{succID} está en proceso y te avisaremos por email cuando esté listo. Si tienes alguna pregunta, no
                                        dudes en contactarnos.
                                    </p>
                                    <Link
                                        href={'/privada/productos'}
                                        className="bg-primary-orange flex h-[47px] w-[253px] items-center justify-center text-white"
                                    >
                                        VOLVER A PRODUCTOS
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="col-span-2 grid w-full items-start">
                    <div className="w-full">
                        <div className="grid h-[52px] grid-cols-8 items-center bg-[#F5F5F5]">
                            <p></p>
                            <p>Código</p>
                            <p>Marca</p>
                            <p>Modelo</p>
                            <p>Descripción</p>
                            <p>Precio</p>
                            <p className="text-center">Cantidad</p>
                            <p></p>
                        </div>
                        {items?.map((subProducto) => <SubproductosPrivadaRow key={subProducto?.id} subProducto={subProducto} />)}
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="">
                        <Link
                            href={'/privado/productos'}
                            className="border-primary-orange text-primary-orange hover:bg-primary-orange h-[47px] border px-5 py-2 font-semibold transition duration-300 hover:text-white"
                        >
                            SEGUIR COMPRANDO
                        </Link>
                    </div>
                </div>

                <div className="h-[206px] border max-sm:order-1 max-sm:col-span-2">
                    <div className="bg-[#EAEAEA]">
                        <h2 className="p-3 text-xl font-bold">Informacion importante</h2>
                    </div>
                    <div
                        className="p-5"
                        dangerouslySetInnerHTML={{
                            __html: informacion?.text,
                        }}
                    ></div>
                </div>
                <div className="h-[206px] w-full border bg-gray-50 max-sm:order-3 max-sm:col-span-2">
                    <div className="bg-[#EAEAEA] p-3">
                        <h2 className="text-xl font-bold">Entrega</h2>
                    </div>

                    <div className="flex h-[160px] w-full flex-col justify-center gap-6 text-[#74716A]">
                        {/* Opción: Retiro Cliente */}
                        <div
                            className={`flex cursor-pointer items-center justify-between rounded-lg pl-3`}
                            onClick={() => {
                                setSelected('retiro');
                                setTipo_entrega('retiro cliente');
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-5 w-5 rounded-full border-2 ${
                                        selected === 'retiro' ? 'border-primary-orange flex items-center justify-center' : 'border-gray-400'
                                    }`}
                                >
                                    {selected === 'retiro' && <div className="bg-primary-orange h-[10px] w-[10px] rounded-full"></div>}
                                </div>
                                <label className="cursor-pointer">Retiro cliente</label>
                            </div>
                        </div>

                        <div
                            className={`flex cursor-pointer items-center justify-between rounded-lg pl-3`}
                            onClick={() => {
                                setSelected('reparto SR Repuestos');
                                setTipo_entrega('reparto SR Repuestos');
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-5 w-5 rounded-full border-2 ${
                                        selected === 'reparto SR Repuestos'
                                            ? 'border-primary-orange flex items-center justify-center'
                                            : 'border-gray-400'
                                    }`}
                                >
                                    {selected === 'reparto SR Repuestos' && <div className="bg-primary-orange h-[10px] w-[10px] rounded-full"></div>}
                                </div>
                                <label className="cursor-pointer">Reparto SR Repuestos</label>
                            </div>
                        </div>

                        {/* Opción: A convenir */}
                        <div
                            className={`flex cursor-pointer items-center rounded-lg pl-3`}
                            onClick={() => {
                                setSelected('acon');
                                setTipo_entrega('A Convenir');
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-5 w-5 rounded-full border-2 ${
                                        selected === 'acon' ? 'border-primary-orange flex items-center justify-center' : 'border-gray-400'
                                    }`}
                                >
                                    {selected === 'acon' && <div className="bg-primary-orange h-[10px] w-[10px] rounded-full"></div>}
                                </div>
                                <label className="cursor-pointer">A Convenir</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex h-[206px] flex-col gap-3 max-sm:order-2 max-sm:col-span-2">
                    <div className="">
                        <h2 className="text-xl font-bold">Escribinos un mensaje</h2>
                    </div>
                    <textarea
                        onChange={(e) => {
                            pedidoForm.setData('mensaje', e.target.value);
                        }}
                        className="h-[222px] w-full border p-3"
                        name=""
                        id=""
                        rows={10}
                        placeholder="Dias especiales de entrega, cambios de domicilio, expresos, requerimientos especiales en la mercaderia, exenciones."
                    ></textarea>
                </div>

                <div className="h-fit border max-sm:order-5 max-sm:col-span-2">
                    <div className="bg-[#EAEAEA]">
                        <h2 className="p-3 text-xl font-bold">Pedido</h2>
                    </div>

                    <div className="flex flex-col justify-between gap-6 border-b px-4 py-6 text-xl text-[#74716A]">
                        <div className="flex w-full flex-row justify-between">
                            <p>Subtotal</p>
                            <p>
                                ${' '}
                                {Number(subtotal)?.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>

                        <div className="flex w-full flex-row justify-between">
                            <p>IVA 21%</p>
                            <p>
                                ${' '}
                                {Number(iva)?.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>

                        <div className="flex w-full flex-row justify-between">
                            <p>Retención IIBB 3%</p>
                            <p>
                                ${' '}
                                {Number(iibb)?.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between p-3 text-[#74716A]">
                        <p className="text-2xl font-medium">
                            Total <span className="text-base">{'(IVA + IIBB)'}</span>
                        </p>
                        <p className="text-2xl">
                            ${' '}
                            {Number(totalFinal)?.toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 max-sm:order-4 max-sm:col-span-2">
                    <h2 className="text-2xl font-bold">Adjuntar un archivo</h2>
                    <div className="flex w-full items-center justify-between border">
                        <span className="pl-4 text-gray-600">{pedidoForm?.data?.archivo?.name}</span>
                        <label
                            htmlFor="fileInput"
                            className="text-primary-orange h-full cursor-pointer bg-gray-100 p-4 font-semibold hover:bg-gray-200"
                        >
                            ADJUNTAR
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={(e) => {
                                pedidoForm.setData('archivo', e.target.files[0]);
                            }}
                        />
                    </div>
                </div>

                <div className="flex w-full flex-row items-end gap-3 max-sm:order-6 max-sm:col-span-2">
                    <Link
                        href={'/privado/productos'}
                        onClick={emptyCart}
                        className="border-primary-orange text-primary-orange flex h-[47px] w-full items-center justify-center border transition-transform hover:scale-95"
                    >
                        CANCELAR PEDIDO
                    </Link>
                    <button
                        onClick={handleSubmit}
                        className={`h-[47px] w-full text-white transition-transform hover:scale-95 ${isSubmitting ? 'bg-gray-400' : 'bg-primary-orange'}`}
                    >
                        {isSubmitting ? 'Enviando pedido...' : 'REALIZAR PEDIDO'}
                    </button>
                </div>
            </div>
        </DefaultLayout>
    );
}
