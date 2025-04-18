// src/pages/SignupPage.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PageStyles.css';

const SignupPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, subdomain }),
      });

      if (!response.ok) throw new Error('Failed to create tenant');
      const { tenant } = await response.json();

      window.location.href = `https://${tenant.subdomain}-itsm.hi5tech.co.uk/setup`;
    } catch (err) {
      setError('Signup failed: ' + err.message);
      console.error('❌ Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="page animated fadeIn">
        <h1>Start Your Free Trial</h1>
        <p>Create your ITSM workspace in just a few clicks.</p>
        <form className="form-card" onSubmit={handleSubmit}>
          <label>Company Name</label>
          <input
            type="text"
            required
            placeholder="e.g. TechSolutions Ltd"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <label>Subdomain</label>
          <div className="subdomain-field">
            <input
              type="text"
              required
              placeholder="yourcompany"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
            />
            <span className="suffix">-itsm.hi5tech.co.uk</span>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Get Started'}
          </button>
        </form>
      </main>
      <Footer />

      <style>{`
        .form-card {
          max-width: 500px;
          margin: 2rem auto;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .subdomain-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .subdomain-field input {
          flex: 1;
        }
        .suffix {
          background: #f0f0f0;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #444;
        }
        .error {
          color: red;
          font-weight: bold;
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default SignupPage;
