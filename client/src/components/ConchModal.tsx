import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
 
}
const handleModalClick = (event) => {
  event.stopPropagation();
};
export const ConchModal: React.FC<ModalProps> = ({ isOpen, onClose, children}) =>{    
  if (!isOpen) { return null; }
  return (
<div id='conchBackdrop'>
    <div id='conchChild'>
    {children}
    </div>
    <div className='ocean'>
        <div className='wave'></div>
    </div>
</div>

  );
};