export default function PedidoTemplate({ pedido, user, productos }) {
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
                    Información del Cliente:
                </h1>
                <p>
                    <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                    <strong>Correo:</strong> {user.email ? user.email : 'Sin correo'}
                </p>
                <p>
                    <strong>Telefono:</strong> {user.telefono}
                </p>
                <p>
                    <strong>CUIT:</strong> {user.cuit}
                </p>

                <p>
                    <strong>Dirección:</strong> {user.direccion}
                </p>
                <p>
                    <strong>Provincia:</strong> {user.provincia}
                </p>
                <p>
                    <strong>Localidad:</strong> {user.localidad}
                </p>
            </div>

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
                        {productos?.map(
                            (item, index) => (
                                console.log(productos[0]),
                                (
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
                                            {item.code}
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
                                            {item?.description}
                                        </td>
                                        <td
                                            style={{
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                            }}
                                        >
                                            ${item?.price}
                                        </td>
                                        <td
                                            style={{
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                            }}
                                        >
                                            {item?.quantity}
                                        </td>
                                    </tr>
                                )
                            ),
                        )}
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
