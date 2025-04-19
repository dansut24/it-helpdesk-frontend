import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';

const SignupPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);

  const checkAvailability = async (slug) => {
    if (!slug) return;
    setChecking(true);
    setAvailable(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/check-domain?slug=${slug}`);
      const data = await res.json();
      setAvailable(data.available);
    } catch (err) {
      console.error('Domain check failed:', err);
    }
    setChecking(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const tenant_domain = subdomain.toLowerCase().replace(/[^a-z0-9\-]/g, '');
    const payload = {
      company_name: companyName,
      tenant_domain,
      logo_url: ''
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess('Workspace created! Redirecting to setup...');
      setTimeout(() => {
        window.location.href = `https://${tenant_domain}-itsm.hi5tech.co.uk/setup`;
      }, 2500);
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 10, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create Your Workspace
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Sign up to create your own Hi5Tech instance.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Company Name"
            fullWidth
            required
            margin="normal"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            label="Subdomain"
            fullWidth
            required
            margin="normal"
            value={subdomain}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');
              setSubdomain(val);
              checkAvailability(val);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">-itsm.hi5tech.co.uk</InputAdornment>
              )
            }}
            helperText={
              checking
                ? 'Checking availability...'
                : available === false
                ? 'Subdomain is already taken'
                : available === true
                ? 'Subdomain is available'
                : ' '
            }
            error={available === false}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={checking || available === false}
          >
            Create Workspace
          </Button>
        </form>
      </Box>

      {success && (
        <Box
          sx={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'green', mb: 2 }}>
            {success}
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 80,
              border: '6px solid #4caf50',
              borderTop: '6px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </Box>
      )}

      <Footer />

      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </>
  );
};

export default SignupPage;
