export default function EmailTemplate({ info }) {
    return (
        <div
            style={{
                backgroundColor: '#f3f3f3',
                padding: '40px',
                textAlign: 'center',
            }}
        >
            <table
                align="center"
                width="100%"
                style={{
                    maxWidth: '600px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    padding: '20px',
                    border: '1px solid #ddd',
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                }}
            >
                <tr>
                    <td>
                        <h1
                            style={{
                                fontSize: '24px',
                                color: '#0077cc',
                                marginBottom: '20px',
                            }}
                        >
                            Detalles de Contacto
                        </h1>
                        <p
                            style={{
                                fontSize: '18px',
                                color: '#333',
                                margin: '10px 0',
                            }}
                        >
                            <strong>Nombre:</strong> {info?.name}
                        </p>
                        <p
                            style={{
                                fontSize: '18px',
                                color: '#333',
                                margin: '10px 0',
                            }}
                        >
                            <strong>Teléfono:</strong> {info?.celular}
                        </p>
                        <p
                            style={{
                                fontSize: '18px',
                                color: '#333',
                                margin: '10px 0',
                            }}
                        >
                            <strong>Email:</strong>{' '}
                            <a
                                href={`mailto:${info?.email}`}
                                style={{
                                    color: '#0077cc',
                                    textDecoration: 'none',
                                }}
                            >
                                {info?.email}
                            </a>
                        </p>
                        <p
                            style={{
                                fontSize: '18px',
                                color: '#333',
                                margin: '10px 0',
                            }}
                        >
                            <strong>Empresa</strong> {info?.empresa}
                        </p>
                        <p
                            style={{
                                fontSize: '18px',
                                color: '#0077cc',
                                fontWeight: 'bold',
                                marginTop: '20px',
                            }}
                        >
                            Mensaje:
                        </p>
                        <p
                            style={{
                                fontSize: '16px',
                                fontStyle: 'italic',
                                color: '#555',
                                padding: '10px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '5px',
                            }}
                        >
                            {info?.mensaje}
                        </p>
                    </td>
                </tr>
            </table>
        </div>
    );
}
