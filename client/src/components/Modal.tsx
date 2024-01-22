import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const handleModalClick = (event) => {
    event.stopPropagation();
};

export const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
    if (!isOpen) return null;
    return (
        <div className='modalCustom' onClick={handleModalClick}>
            <div>
                {children}
            </div>
        </div>

    )
};