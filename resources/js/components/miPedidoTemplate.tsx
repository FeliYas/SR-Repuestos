import { usePage } from '@inertiajs/react';

export default function MiPedidoTemplate({ pedido, productos }) {
    const { subproductos } = usePage().props;

    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                maxWidth: '1000px',
                margin: 'auto',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
            }}
            className="scrollbar-hide relative max-h-[90vh] overflow-y-auto"
        >
            <div style={{ marginBottom: '20px' }}>
                <h1
                    style={{
                        borderBottom: '2px solid #333',
                        paddingBottom: '5px',
                    }}
                >
                    Información del Pedido:
                </h1>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginBottom: '20px',
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                backgroundColor: '#333',
                                color: '#fff',
                            }}
                        >
                            <th
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                }}
                            >
                                Código
                            </th>
                            <th
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                }}
                            >
                                Marca
                            </th>
                            <th
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                }}
                            >
                                Modelo
                            </th>
                            <th
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                }}
                            >
                                Descripcion
                            </th>
                            <th
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                }}
                            >
                                Precio
                            </th>

                            <th
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                }}
                            >
                                Cantidad
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos?.map((item, index) => (
                            <tr
                                key={index}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#fff' : '#f2f2f2',
                                }}
                            >
                                <td
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    {subproductos.find((subprod) => item?.subproducto_id == subprod?.id).code}
                                </td>
                                <td
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    {item?.producto?.marca?.name}
                                </td>
                                <td
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    {item?.producto?.name}
                                </td>
                                <td
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    {subproductos.find((subprod) => item?.subproducto_id == subprod?.id)?.description}
                                </td>
                                <td
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    ${item?.subtotal_prod}
                                </td>
                                <td
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    {item?.cantidad}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p>
                    <strong>Mensaje:</strong> {pedido?.mensaje}
                </p>
                <p>
                    <strong>Tipo de entrega:</strong> {pedido?.tipo_entrega}
                </p>

                <div
                    style={{
                        backgroundColor: '#f2f2f2',
                        padding: '10px',
                        borderRadius: '5px',
                        marginTop: '10px',
                    }}
                >
                    <p>
                        <strong>Subtotal:</strong> $
                        {Number(pedido?.subtotal)?.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>

                    <p>
                        <strong>IVA:</strong> $
                        {Number(pedido?.iva)?.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>

                    <p>
                        <strong>IIBB:</strong> $
                        {Number(pedido?.iibb)?.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>

                    <p
                        style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                        }}
                    >
                        <strong>Total del pedido:</strong> $
                        {Number(pedido?.total)?.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
