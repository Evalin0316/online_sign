import React, { useState } from 'react';

const AddTextModal = ({ showModal, onHideTextModal }) => {
  const [text, setText] = useState('');

  const addText = () => {
      window.bus.emit('saveText', text);
      onHideTextModal();
  };

  const closeWarning = () => {
      setText('');
      onHideTextModal();
  };

  if (!showModal) return null;

  return (
    <div
      className="w-full left-0 top-0 fixed h-screen"
      style={{ background: 'rgba(140, 93, 25, 0.3)' }}
    >
      <div className="text__container">
        <div className="text__container__header mt-3" onClick={closeWarning}>
            <img src="../assets/images/icon_Close_Square_n.png" alt="Close" />
        </div>
        <div className="text__container__content">
          <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="textInput"
          />
        </div>
        <div className="text__container__button" onClick={addText}>
            新增文字
        </div>
      </div>
    </div>
  );
};


export default AddTextModal;