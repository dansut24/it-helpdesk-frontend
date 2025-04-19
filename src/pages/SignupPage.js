import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  CircularProgress
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    slug: '',
    industry: '',
    size: '',
    timezone: 'Europe/London',
    date_format: 'DD/MM/YYYY',
    maintenance_mode: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Submitting signup payload:', formData);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('Raw signup response:', response);

      if (!response.ok) throw new Error('Signup failed');

      const data = await response.json();
      console.log('Signup successful:', data);
      setSuccess(true);

      // Redirect to the subdomain setup wizard
      window.location.href = `https://${formData.slug}-itsm.hi5tech.co.uk/setup`;
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 8, mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create Your Workspace
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Desired Subdomain"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: <span>.hi5tech.co.uk</span>
            }}
            helperText="Your workspace will be available at https://yourdomain-itsm.hi5tech.co.uk"
          />

          <TextField
            select
            label="Industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {['Tech', 'Education', 'Healthcare', 'Finance', 'Other'].map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Company Size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {['1-10', '11-50', '51-200', '201-500', '500+'].map((size) => (
              <MenuItem key={size} value={size}>{size} employees</MenuItem>
            ))}
          </TextField>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {success && (
            <Typography color="primary" sx={{ mt: 2 }}>
              Signup successful! Redirecting...
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Workspace'}
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default SignupPage;
