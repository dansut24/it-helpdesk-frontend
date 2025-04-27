// src/pages/AboutPage.js
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from '../components/Header';

const AboutPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
          About Hi5Tech
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
            <img src="https://img.icons8.com/clouds/100/goal.png" alt="Mission Icon" />
            <Typography variant="h6" gutterBottom>
              Our Mission
            </Typography>
            <Typography>
              At Hi5Tech, we believe IT should be simple, powerful, and accessible. Our mission is to streamline operations and empower teams with cutting-edge ITSM tools.
            </Typography>
          </Box>

          <Box textAlign="center">
            <img src="https://img.icons8.com/clouds/100/star.png" alt="Why Choose Us Icon" />
            <Typography variant="h6" gutterBottom>
              Why Choose Us
            </Typography>
            <Typography>
              Hi5Tech combines modern design with powerful automation to help businesses reduce downtime and boost productivity.
            </Typography>
          </Box>

          <Box textAlign="center">
            <img src="https://img.icons8.com/clouds/100/team.png" alt="Team Icon" />
            <Typography variant="h6" gutterBottom>
              The Team Behind Hi5Tech
            </Typography>
            <Typography>
              We’re a team of developers, designers, and IT professionals passionate about transforming IT operations.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AboutPage;
