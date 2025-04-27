import React, { useState } from 'react';

const PreferencesStep = ({ companyId, onFinish }) => {
  const [timezone, setTimezone] = useState('Europe/London');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/setup/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          timezone,
          dateFormat,
          maintenanceMode,
        }),
      });

      if (res.ok) {
        onFinish();
      }
    } catch (err) {
      console.error('Error submitting preferences:', err);
    }
  };

  return (
    <div>
      <h2>Step 4: Set Preferences</h2>

      <label>Default Timezone:</label><br />
      <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
        <option value="Europe/London">Europe/London</option>
        <option value="America/New_York">America/New_York</option>
        <option value="Asia/Tokyo">Asia/Tokyo</option>
        <option value="Australia/Sydney">Australia/Sydney</option>
      </select>

      <br /><br />

      <label>Date Format:</label><br />
      <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
      </select>

      <br /><br />

      <label>
        <input
          type="checkbox"
          checked={maintenanceMode}
          onChange={() => setMaintenanceMode(!maintenanceMode)}
        />
        Enable Maintenance Mode
      </label>

      <br /><br />
      <button onClick={handleSubmit}>Finish Setup</button>
    </div>
  );
};

export default PreferencesStep;
