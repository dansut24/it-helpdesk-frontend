import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const tenant_domain = `${subdomain}-itsm.hi5tech.co.uk`;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          tenant_domain,
          logo_url: '',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');

      window.location.href = `https://${subdomain}-itsm.hi5tech.co.uk/setup`;
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 8, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Create Your ITSM Workspace
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Start your free trial by creating a dedicated workspace for your organization.
          </Typography>

          <Box component="form" onSubmit={handleSignup} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Company Name"
              required
              margin="normal"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <TextField
              fullWidth
              label="Choose Subdomain"
              required
              margin="normal"
              value={subdomain}
              onChange={(e) =>
                setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">-itsm.hi5tech.co.uk</InputAdornment>
                ),
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Workspace'}
            </Button>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default SignupPage;
