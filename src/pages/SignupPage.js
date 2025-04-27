// src/pages/SignupPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
  Fade,
  useTheme
} from '@mui/material';
import Header from '../components/Header';

const SignupPage = () => {
  const theme = useTheme();

  const [companyName, setCompanyName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainValid, setSubdomainValid] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (subdomain) checkAvailability(subdomain);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [subdomain]);

  const checkAvailability = async (value) => {
    setChecking(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/check-subdomain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: value }),
      });

      if (!res.ok) throw new Error("Bad response");
      const data = await res.json();
      setSubdomainValid(data.available);
    } catch (err) {
      console.error("Error checking availability:", err);
      setSubdomainValid(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitted(false);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          tenant_domain: subdomain,
          logo_url: ''
        }),
      });
      if (!res.ok) throw new Error('Signup failed');
      setSubmitted(true);
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = `https://${subdomain}-itsm.hi5tech.co.uk/setup`;
      }, 2600);
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg('Signup failed. Please try again.');
    }
  };

  const isFormValid = companyName && subdomain && subdomainValid;

  return (
    <>
      <Header />
      <main style={{
        padding: '2rem',
        maxWidth: 600,
        margin: '0 auto',
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
        minHeight: '100vh',
        paddingTop: '120px'
      }}>
        <Typography variant="h4" gutterBottom>
          Create Your Workspace
        </Typography>
        <Typography variant="body1" gutterBottom>
          Get started with Hi5Tech by creating your organization’s workspace.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} mt={3}>
          <TextField
            label="Company Name"
            fullWidth
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Choose Subdomain"
            fullWidth
            required
            margin="normal"
            value={subdomain}
            onChange={(e) =>
              setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">-itsm.hi5tech.co.uk</InputAdornment>,
            }}
            helperText={
              checking
                ? 'Checking availability...'
                : subdomainValid === false
                ? 'Subdomain not available'
                : subdomainValid === true
                ? 'Subdomain is available'
                : ''
            }
            error={subdomain && subdomainValid === false}
          />

          {errorMsg && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid || checking}
            sx={{ mt: 3 }}
          >
            {checking ? <CircularProgress size={24} /> : 'Create Workspace'}
          </Button>

          <Fade in={redirecting}>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Workspace created successfully!
              </Typography>
              <div className="redirect-pulse" />
            </Box>
          </Fade>
        </Box>

        <style>{`
          .redirect-pulse {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #1976d2;
            margin: 0 auto;
            animation: pulse 1s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </main>
    </>
  );
};

export default SignupPage;
