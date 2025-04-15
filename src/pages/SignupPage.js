import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated success logic
    const slug = companyName.trim().toLowerCase().replace(/\s+/g, '');
    setMessage(`Account created for ${companyName}. Redirecting...`);

    setTimeout(() => {
      window.location.href = `https://${slug}-itsm.hi5tech.co.uk/setup`;
    }, 2000);
  };

  return (
    <>
      <Header />
      <main className="page-content" style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Sign Up</h1>
        <p>Create your Hi5Tech workspace. Start your free trial today and streamline your IT operations.</p>
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "2rem auto" }}>
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "10px 20px" }}>Create Workspace</button>
        </form>
        {message && <p>{message}</p>}
      </main>
      <Footer />
    </>
  );
};

export default SignupPage;
