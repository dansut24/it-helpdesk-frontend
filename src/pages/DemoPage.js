// src/pages/DemoPage.js
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from '../components/Header';

const DemoPage = () => {
  const theme = useTheme();

  return (
    <>
      <Header />
      <Box
        sx={{
          pt: '100px',
          px: 3,
          pb: 6,
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h4" gutterBottom align="center" fontWeight={600}>
          Explore Our Demo
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            mt: 4,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          <Box textAlign="center">
            <img src="https://img.icons8.com/clouds/100/laptop.png" alt="Live Demo" />
            <Typography variant="h6" gutterBottom>
              Live Demo Access
            </Typography>
            <Typography>
              Experience our platform in action. See how Hi5Tech handles real-world IT challenges.
            </Typography>
          </Box>

          <Box textAlign="center">
            <img src="https://img.icons8.com/clouds/100/presentation.png" alt="Features Preview" />
            <Typography variant="h6" gutterBottom>
              Features Preview
            </Typography>
            <Typography>
              Try the ticketing system, explore the knowledge base, and view analytics in a simulated environment.
            </Typography>
          </Box>

          <Box textAlign="center">
            <img src="https://img.icons8.com/clouds/100/view-file.png" alt="Try Hi5Tech" />
            <Typography variant="h6" gutterBottom>
              Get a Feel for Hi5Tech
            </Typography>
            <Typography>
              No sign-up required. Dive in and see how we simplify IT.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DemoPage;
