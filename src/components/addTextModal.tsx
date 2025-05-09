import React, { useState } from 'react';

import iconClose from '../assets/images/icon_Close_Square_n.png';

interface AddTextModalProps {
  setShowTextModal: (show: boolean) => void;
  addTextFromInput: (text: string) => void;
}

const AddTextModal = ({ setShowTextModal, addTextFromInput }: AddTextModalProps) => {
  const [text, setText] = useState('');

  return (
    <div
      className="w-full left-0 top-0 fixed h-screen"
      style={{ background: 'rgba(140, 93, 25, 0.3)' }}
    >
      <div className="text-container">
        <div className="text-container-header mt-3" onClick={() => { setShowTextModal(false) }}>
          <img src={iconClose} alt="Close" />
        </div>
        <div className="text-container-content">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="textInput"
          />
        </div>
        <div className="text-container-button text-center" onClick={() => { addTextFromInput(text) }}>
          新增文字
        </div>
      </div>
    </div>
  );
};


export default AddTextModal;