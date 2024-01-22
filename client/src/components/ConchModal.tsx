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
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
  <div className='shell'>
    <img src={require('../style/conch.png')} style={{width:'4rem', height:'auto'}}></img>
  </div>
    <div id='conchChild'>
    {children}
    </div>
    <div className='ocean'>
        <div className='wave'></div>
    </div>
</div>

  );
};