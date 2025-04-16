import React from 'react';

const FinishStep = ({ companyId }) => {
  const handleFinish = async () => {
    try {
      const res = await fetch('/api/setup/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId }),
      });
      if (res.ok) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Error completing setup:', err);
    }
  };

  return (
    <div>
      <h2>Setup Complete</h2>
      <p>You're all set! Click below to log in.</p>
      <button onClick={handleFinish}>Go to Login</button>
    </div>
  );
};

export default FinishStep;
