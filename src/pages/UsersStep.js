import React, { useState } from 'react';

const UsersStep = ({ companyId, onNext }) => {
  const [users, setUsers] = useState([
    { name: '', email: '', password: '' }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...users];
    updated[index][field] = value;
    setUsers(updated);
  };

  const addUser = () => {
    setUsers([...users, { name: '', email: '', password: '' }]);
  };

  const handleSubmit = async () => {
    const validUsers = users.filter(u => u.name && u.email && u.password);

    try {
      const res = await fetch('/api/setup/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, users: validUsers }),
      });
      if (res.ok) {
        onNext();
      }
    } catch (err) {
      console.error('Error submitting users:', err);
    }
  };

  return (
    <div>
      <h2>Step 3: Add Users</h2>
      {users.map((user, idx) => (
        <div key={idx} style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Full Name"
            value={user.name}
            onChange={(e) => handleChange(idx, 'name', e.target.value)}
            style={{ marginRight: '8px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => handleChange(idx, 'email', e.target.value)}
            style={{ marginRight: '8px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => handleChange(idx, 'password', e.target.value)}
          />
        </div>
      ))}
      <button onClick={addUser}>+ Add Another User</button>
      <br /><br />
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default UsersStep;
