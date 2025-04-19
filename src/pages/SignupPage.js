import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css'; // assuming styles are defined

const SignupPage = () => {
  const [form, setForm] = useState({
    companyName: '',
    subdomain: '',
    industry: '',
    size: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://api.hi5tech.co.uk'}/api/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.tenantId) {
        const subdomain = form.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        window.location.href = `https://${subdomain}-itsm.hi5tech.co.uk/setup`;
      } else {
        throw new Error(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Start your Free ITSM Trial</h2>
      <form onSubmit={handleSubmit}>
        <input name="companyName" placeholder="Company Name" required value={form.companyName} onChange={handleChange} />
        <input name="subdomain" placeholder="Subdomain (e.g. mycompany)" required value={form.subdomain} onChange={handleChange} />
        <input name="industry" placeholder="Industry" required value={form.industry} onChange={handleChange} />
        <input name="size" placeholder="Company Size" required value={form.size} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
