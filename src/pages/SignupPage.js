import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import '../styles/PageStyles.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add backend POST here if needed
    console.log('Signing up with:', formData);

    // Navigate to setup wizard
    navigate('/setup');
  };

  return (
    <>
      <Header />
      <main className="page animated fadeIn">
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <Box
            sx={{
              background: '#ffffffcc',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <img
              src="https://img.icons8.com/clouds/100/add-user-group-man-man.png"
              alt="Signup Icon"
              style={{ width: '80px', marginBottom: '1rem' }}
            />
            <Typography variant="h4" gutterBottom>
              Create Your Hi5Tech Account
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Start your 14-day free trial. No credit card required.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Company Name"
                name="company"
                variant="outlined"
                margin="normal"
                value={formData.company}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
              >
                Get Started
              </Button>
            </form>
          </Box>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default SignupPage;
