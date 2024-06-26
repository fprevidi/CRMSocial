import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed } from '@fortawesome/free-solid-svg-icons';
const CloseButton: React.FC = () => {
    const handleClose = () => {
        window.close();
    };

    return (
        <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none mr-4"
        >
            <FontAwesomeIcon icon={faDoorClosed} />
        </button>
    );
};

export default CloseButton;
