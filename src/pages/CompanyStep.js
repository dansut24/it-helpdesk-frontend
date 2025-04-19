import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';

const CompanyStep = ({ next }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    subdomain: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pre-fill values from session or hostname
    const storedCompany = sessionStorage.getItem('companyName');
    const hostname = window.location.hostname;
    const match = hostname.match(/^([a-z0-9-]+)-itsm\.hi5tech\.co\.uk$/);
    const subdomain = match ? match[1] : '';

    setFormData({
      companyName: storedCompany || '',
      subdomain
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        company_name: formData.companyName,
        tenant_domain: formData.subdomain,
        logo_url: ''
      };

      console.log("Submitting company data:", payload);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Company response:", data);

      if (!response.ok) throw new Error(data.error || 'Failed to submit');

      next({ tenantId: data.id, ...formData });
    } catch (err) {
      console.error("❌ Exception during company submission:", err);
      setError('Unexpected error: ' + (err.message || 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Company Details
      </Typography>

      <TextField
        label="Company Name"
        fullWidth
        required
        margin="normal"
        value={formData.companyName}
        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
      />

      <TextField
        label="Subdomain"
        fullWidth
        required
        margin="normal"
        value={formData.subdomain}
        disabled
        InputProps={{
          endAdornment: <InputAdornment position="end">-itsm.hi5tech.co.uk</InputAdornment>
        }}
        helperText="This subdomain is already locked for your workspace."
      />

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={loading}>
        {loading ? 'Submitting...' : 'Next'}
      </Button>
    </Box>
  );
};

export default CompanyStep;
