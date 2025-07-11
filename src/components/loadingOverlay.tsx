import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';

const OverlayLoader = () => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = () => {
    setLoading(true);
    // 模擬一個 async 操作
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <button onClick={toggleLoading}>Load Something</button>

      {loading && (
        <div style={overlayStyle}>
          <ClipLoader size={60} color="#ffffff" loading={true} />
        </div>
      )}
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

export default OverlayLoader;
