import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [tenantDomain, setTenantDomain] = useState('');
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkSubdomain = async (slug) => {
    setChecking(true);
    setAvailability(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/check-subdomain/${slug}`);
      const result = await res.json();
      setAvailability(result.available);
    } catch (err) {
      console.error('Error checking availability:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          tenant_domain: tenantDomain,
          logo_url: ''
        }),
      });

      const data = await response.json();
      if (data.id) {
        navigate(`https://${tenantDomain}-itsm.hi5tech.co.uk/setup`);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError('An error occurred during signup.');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Create Your Workspace
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
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
            value={tenantDomain}
            onChange={(e) => {
              const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
              setTenantDomain(slug);
              checkSubdomain(slug);
            }}
            InputProps={{
              endAdornment: <span style={{ marginLeft: 8 }}>.hi5tech.co.uk</span>,
            }}
            helperText={
              checking
                ? 'Checking availability...'
                : availability === true
                ? 'Subdomain is available'
                : availability === false
                ? 'Subdomain is already taken'
                : ''
            }
            error={availability === false}
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={checking || availability === false}
            sx={{ mt: 3 }}
          >
            {checking ? <CircularProgress size={24} /> : 'Create Workspace'}
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default SignupPage;
