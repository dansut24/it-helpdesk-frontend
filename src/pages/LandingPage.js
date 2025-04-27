import React from 'react';
import { Box, Typography, Button, Stack, useTheme, Paper, Zoom } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const features = [
  {
    title: "Incident Management",
    description: "Quickly capture, assign, and resolve incidents with ease.",
    icon: "https://img.icons8.com/ios-filled/50/38bdf8/error--v1.png",
  },
  {
    title: "Self-Service Portal",
    description: "Empower users to find answers and raise requests directly.",
    icon: "https://img.icons8.com/ios-filled/50/38bdf8/knowledge-sharing.png",
  },
  {
    title: "Automation",
    description: "Automate repetitive tasks and accelerate resolution times.",
    icon: "https://img.icons8.com/ios-filled/50/38bdf8/robot-2.png",
  },
];

const LandingPage = () => {
  const theme = useTheme();

  return (
    <>
      <Header />
      <Box
        sx={{
          pt: '120px',
          px: 3,
          pb: 10,
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight="bold" className="fade-in">
          Modern ITSM for Agile Teams
        </Typography>
        <Typography variant="subtitle1" className="fade-in" sx={{ mt: 1 }}>
          Streamline incidents, service requests, and more — all from one place.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/services/itsm/signup"
            sx={{ fontWeight: 'bold' }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/services/itsm/demo"
            sx={{ fontWeight: 'bold' }}
          >
            View Demo
          </Button>
        </Stack>

        <Box
          sx={{
            mt: 10,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            gap: 4,
            maxWidth: '1100px',
            mx: 'auto',
          }}
        >
          {features.map((feature, index) => (
            <Zoom in timeout={400 + index * 200} key={index}>
              <Paper
                elevation={4}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                  p: 4,
                  borderRadius: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0px 8px 20px ${theme.palette.primary.main}33`,
                  },
                }}
              >
                <img src={feature.icon} alt={feature.title} style={{ height: 40, marginBottom: 16 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Zoom>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default LandingPage;
