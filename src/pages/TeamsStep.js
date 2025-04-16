import React, { useState } from 'react';

const TeamsStep = ({ companyId, onNext }) => {
  const [teams, setTeams] = useState([{ name: '' }]);

  const handleChange = (index, value) => {
    const updated = [...teams];
    updated[index].name = value;
    setTeams(updated);
  };

  const addTeam = () => setTeams([...teams, { name: '' }]);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/setup/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, teams }),
      });
      const data = await res.json();
      if (res.ok) onNext();
    } catch (err) {
      console.error('Error submitting teams:', err);
    }
  };

  return (
    <div>
      <h2>Step 2: Teams</h2>
      {teams.map((team, idx) => (
        <input
          key={idx}
          value={team.name}
          onChange={(e) => handleChange(idx, e.target.value)}
          placeholder={`Team ${idx + 1}`}
        />
      ))}
      <button onClick={addTeam}>Add Team</button>
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default TeamsStep;
