import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTimes } from '@fortawesome/free-solid-svg-icons';

interface DropzoneProps {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const Dropzone: React.FC<DropzoneProps> = ({ files, setFiles }) => {
    const defaultDivContent = 'Trascina qui i files PDF o clicca per selezionarli';
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [divContent, setDivContent] = useState<string>(defaultDivContent)
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            const fileList = Array.from(droppedFiles);
            setFiles(prevFiles => [...prevFiles, ...fileList]);
            setDivContent('')
        }
    };

    const handleDropZoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;

        if (selectedFiles && selectedFiles.length > 0) {
            const fileList = Array.from(selectedFiles);
            setFiles(prevFiles => [...prevFiles, ...fileList]);
            setDivContent('')
        } else {
            setDivContent(defaultDivContent)
        }
    };

    return (
        <div onClick={handleDropZoneClick} onDrop={handleDrop} onDragOver={event => event.preventDefault()}
        
       
            style={{
                border: '2px dashed #ccc',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px',
                height: '200px',
            }}>
            <span>{divContent}</span>
            <input accept=".pdf" type="file" ref={fileInputRef} multiple onChange={handleFileChange} style={{ display: 'none' }} />
            {files.map((_, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block' }} className="ml-2 mr-2">
                    <FontAwesomeIcon icon={faFilePdf} size="2x" style={{ marginRight: '11px' }} />
                    <span style={{ position: 'absolute', top: -10, right: 0, cursor: 'pointer' }} onClick={(event) => {
                        event.stopPropagation();
                        const newFiles = files.filter((_, i) => i !== index);
                        setFiles(newFiles);
                        if (!(newFiles.length > 0)) {
                            setDivContent(defaultDivContent)
                        }
                    }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>
               
            ))}
        </div>
    );
};

export default Dropzone;
