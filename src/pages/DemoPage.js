import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box, Typography, Button, Container } from '@mui/material';

const DemoPage = () => {
  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h3" gutterBottom>
          Try the ITSM Demo
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Explore a live instance of our ITSM platform. No setup required — just click and start exploring.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="https://demo-itsm.hi5tech.co.uk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Launch Demo
        </Button>
      </Container>
      <Footer />
    </>
  );
};

export default DemoPage;
