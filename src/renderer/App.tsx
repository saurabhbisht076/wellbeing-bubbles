import React from 'react';

const App: React.FC = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      background: 'rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    <h1 style={{ color: '#222', fontWeight: 900, fontSize: 28 }}>
      Wellbeing Bubbles (Starter)
    </h1>
  </div>
);

export default App;