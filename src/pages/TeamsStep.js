import React, { useState } from 'react';

const TeamsStep = ({ companyId, onNext }) => {
  const [teams, setTeams] = useState(['']);

  const handleChange = (index, value) => {
    const updated = [...teams];
    updated[index] = value;
    setTeams(updated);
  };

  const addTeam = () => {
    setTeams([...teams, '']);
  };

  const handleSubmit = async () => {
    const teamObjects = teams
      .filter(name => name.trim() !== '')
      .map(name => ({ name }));

    try {
      const res = await fetch('/api/setup/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, teams: teamObjects }),
      });
      if (res.ok) {
        onNext();
      }
    } catch (err) {
      console.error('Error submitting teams:', err);
    }
  };

  return (
    <div>
      <h2>Step 2: Add Teams</h2>
      {teams.map((team, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Team ${idx + 1}`}
          value={team}
          onChange={(e) => handleChange(idx, e.target.value)}
          style={{ display: 'block', marginBottom: '8px' }}
        />
      ))}
      <button onClick={addTeam}>+ Add Another Team</button>
      <br /><br />
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default TeamsStep;
