
import React from 'react';

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>Welcome to Hi5Tek</h1>
      <p>The modern ITSM platform for teams who move fast.</p>
      <a href="/signup" style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        backgroundColor: '#2D9CDB',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '1.2rem'
      }}>
        Get Started Free
      </a>
    </div>
  );
};

export default LandingPage;
