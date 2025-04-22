import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CustomReactQuill({ value, onChange, additionalStyles = '' }) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ color: [] }, { background: [] }], // Añade opciones de color de texto y fondo
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'color',
        'background', // Incluye los formatos de color
        'list',
        'bullet',
        'link',
        'image',
    ];

    return (
        <ReactQuill className={`bg-white ${additionalStyles}`} theme="snow" modules={modules} formats={formats} value={value} onChange={onChange} />
    );
}

export default CustomReactQuill;
