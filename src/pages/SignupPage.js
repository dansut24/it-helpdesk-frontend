import React, { useState } from 'react';
import { TextField, InputAdornment, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
  const [form, setForm] = useState({
    companyName: '',
    subdomain: '',
    industry: '',
    size: '',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setConfirmOpen(true); // Show confirmation dialog
  };

  const confirmSubmit = async () => {
    setLoading(true);
    setConfirmOpen(false);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://api.hi5tech.co.uk'}/api/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.tenantId) {
        const cleanSubdomain = form.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        window.location.href = `https://${cleanSubdomain}-itsm.hi5tech.co.uk/setup`;
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
    <>
      <Header />
      <div style={{ padding: '4rem 1rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>Start your Free ITSM Trial</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TextField
            name="companyName"
            label="Company Name"
            fullWidth
            required
            value={form.companyName}
            onChange={handleChange}
          />

          <TextField
            name="subdomain"
            label="Subdomain"
            required
            value={form.subdomain}
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">-itsm.hi5tech.co.uk</InputAdornment>,
            }}
            helperText="This will be your ITSM portal address."
          />

          <TextField
            name="industry"
            label="Industry"
            fullWidth
            required
            value={form.industry}
            onChange={handleChange}
          />

          <TextField
            name="size"
            label="Company Size"
            fullWidth
            required
            value={form.size}
            onChange={handleChange}
          />

          <TextField
            name="timezone"
            label="Timezone"
            select
            fullWidth
            value={form.timezone}
            onChange={handleChange}
          >
            <MenuItem value="Europe/London">Europe/London</MenuItem>
            <MenuItem value="America/New_York">America/New_York</MenuItem>
            <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
            <MenuItem value="Australia/Sydney">Australia/Sydney</MenuItem>
          </TextField>

          <TextField
            name="dateFormat"
            label="Date Format"
            select
            fullWidth
            value={form.dateFormat}
            onChange={handleChange}
          >
            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
          </TextField>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Button variant="contained" type="submit" disabled={loading} sx={{ padding: '12px' }}>
            {loading ? 'Submitting...' : 'Continue'}
          </Button>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Your Signup</DialogTitle>
        <DialogContent>
          <p>You're about to create a new tenant for <strong>{form.companyName}</strong>.</p>
          <p>Your URL will be: <strong>{form.subdomain}-itsm.hi5tech.co.uk</strong></p>
          <p>Do you want to continue?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={confirmSubmit} color="primary" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

export default SignupPage;
