import React from 'react';

const Tooltip = ({ tipText, children }) => {
  return (
    <a className="jastips">
      {children}
      <div dangerouslySetInnerHTML={{ __html: tipText }}></div>
    </a>
  );
};

export default Tooltip;
