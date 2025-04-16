import React, { useState } from 'react';

const CompanyStep = ({ onNext }) => {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/setup/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: companyName }),
      });
      const data = await res.json();
      if (res.ok) onNext(data.companyId);
    } catch (err) {
      console.error('Error submitting company:', err);
    }
  };

  return (
    <div>
      <h2>Step 1: Company Info</h2>
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default CompanyStep;
