import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';

const CompanyStep = ({ onNext }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    subdomain: '',
    industry: '',
    size: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Placeholder for actual backend API call
      console.log('Submitting company data:', formData);
      // Simulate successful response with dummy tenant ID
      setTimeout(() => {
        setLoading(false);
        onNext({ tenantId: 123, ...formData });
      }, 1000);
    } catch (err) {
      console.error('❌ Exception during company submission:', err);
      setError('Unexpected error: ' + (err?.message || 'Something went wrong.'));
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
        variant="outlined"
        margin="normal"
        value={formData.subdomain}
        onChange={(e) =>
          setFormData({ ...formData, subdomain: e.target.value.replace(/[^a-zA-Z0-9-]/g, '') })
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              -itsm.hi5tech.co.uk
            </InputAdornment>
          ),
        }}
        helperText="This will be your unique ITSM URL."
        required
      />

      <TextField
        label="Industry"
        fullWidth
        margin="normal"
        value={formData.industry}
        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
      />

      <TextField
        label="Company Size"
        fullWidth
        margin="normal"
        value={formData.size}
        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
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