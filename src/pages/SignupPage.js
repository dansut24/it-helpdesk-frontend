import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, InputAdornment, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [tenantDomain, setTenantDomain] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const checkAvailability = async () => {
    if (!tenantDomain) return;
    setChecking(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/check-subdomain?slug=${tenantDomain}`);
      const result = await res.json();
      setAvailable(result.available);
    } catch (err) {
      setAvailable(null);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          tenant_domain: tenantDomain,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess(true);

      setTimeout(() => {
        window.location.href = `https://${tenantDomain}-itsm.hi5tech.co.uk/setup`;
      }, 2800);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          mt: 10, mb: 8, mx: 'auto', maxWidth: 500, px: 3, py: 4,
          backgroundColor: '#fff', borderRadius: 3, boxShadow: 3
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create your workspace
        </Typography>
        <Typography variant="subtitle1" mb={3}>
          Start your free trial and set up your Hi5Tech ITSM in seconds.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Subdomain"
            value={tenantDomain}
            onChange={(e) => {
              setTenantDomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
              setAvailable(null);
            }}
            onBlur={checkAvailability}
            fullWidth
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">-itsm.hi5tech.co.uk</InputAdornment>,
            }}
            sx={{ mb: 1 }}
          />
          {checking && <Typography variant="caption" color="text.secondary">Checking availability...</Typography>}
          {available === true && (
            <Alert severity="success" sx={{ mb: 2 }}>Subdomain is available!</Alert>
          )}
          {available === false && (
            <Alert severity="error" sx={{ mb: 2 }}>Subdomain is already taken.</Alert>
          )}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && (
            <Alert severity="success" sx={{ mb: 2, animation: 'fadeIn 1s ease-in-out' }}>
              Signup successful! Redirecting to setup wizard...
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!available || submitting}
            fullWidth
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Workspace'}
          </Button>
        </form>
      </Box>
      <Footer />
    </>
  );
};

export default SignupPage;
