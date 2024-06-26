// NumeroRigheSelector.tsx
import React from 'react';

interface Props {
    onChange: (numeroRighe: number) => void;
}

const NumeroRigheSelector: React.FC<Props> = ({ onChange }) => {
    return (
        <select
            onChange={(e) => onChange(e.target.value === 'tutti' ? Infinity : parseInt(e.target.value))}
            className="border px-2 py-1 rounded"
        >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="tutti">Tutti</option>
        </select>
    );
};

export default NumeroRigheSelector
