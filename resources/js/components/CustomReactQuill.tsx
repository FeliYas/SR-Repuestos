import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CustomReactQuill({ value, onChange, additionalStyles = '' }) {
    const quillRef = useRef(null);

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'color', 'background', 'list', 'bullet', 'link', 'image'];

    // Apply styles after component mounts
    useEffect(() => {
        if (quillRef.current) {
            // Get the editor container
            const editorContainer = quillRef.current.getEditor().container;

            // Apply background color to the editor content area
            const editorContent = editorContainer.querySelector('.ql-editor');
            if (editorContent) {
                editorContent.style.backgroundColor = 'white';
                editorContent.style.minHeight = '200px'; // Optional: set a minimum height
            }
        }
    }, []);

    return (
        <div className="quill-wrapper">
            <ReactQuill
                ref={quillRef}
                className={`bg-white ${additionalStyles}`}
                theme="snow"
                modules={modules}
                formats={formats}
                value={value}
                onChange={onChange}
            />
            <style jsx>{`
                .quill-wrapper :global(.ql-container) {
                    background-color: white;
                }

                .quill-wrapper :global(.ql-editor) {
                    background-color: white;
                }

                .quill-wrapper :global(.ql-toolbar) {
                    background-color: white;
                }
            `}</style>
        </div>
    );
}

export default CustomReactQuill;
