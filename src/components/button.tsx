import React from 'react';

interface ButtonProps {
  buttonText: string;
  textPosition: string;
  otherClass: string;
  children: React.ReactNode;
  applyFn: () => void;
}

const Button = ({ buttonText, textPosition, otherClass, children, applyFn }: ButtonProps) => {
  return (
    <div 
      className="btn flex items-center cursor-pointer relative rounded"
      onClick={applyFn}
    >
      <div className="flex justify-center items-center px-4 py-3">
        <div className="slot-image">{children}</div>
        <a className={`block ${textPosition} ${otherClass}`}>{buttonText}</a>
      </div>
    </div>
  );
};

export default Button;
