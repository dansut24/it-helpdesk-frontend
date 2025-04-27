// src/pages/ServicesPage.js
import React from 'react';
import Header from '../components/Header';
import { Typography, useTheme } from '@mui/material';

const ServicesPage = () => {
  const theme = useTheme();

  return (
    <>
      <Header />
      <main style={{
        padding: '2rem',
        paddingTop: '120px',
        maxWidth: '960px',
        margin: '0 auto',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        <Typography variant="h4" gutterBottom>Our Services</Typography>
        <Typography variant="body1" gutterBottom>
          Explore the modules that power your IT operations with Hi5Tech.
        </Typography>

        <section style={{ marginTop: '2rem' }}>
          <img src="https://img.icons8.com/clouds/100/alarm.png" alt="Incident Management" />
          <Typography variant="h6" mt={1}>Incident Management</Typography>
          <Typography variant="body2" color="textSecondary">
            Log, track, and resolve incidents efficiently with customizable workflows.
          </Typography>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <img src="https://img.icons8.com/clouds/100/online-support.png" alt="Service Requests" />
          <Typography variant="h6" mt={1}>Service Requests</Typography>
          <Typography variant="body2" color="textSecondary">
            Empower end users to request services through a clean, user-friendly portal.
          </Typography>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <img src="https://img.icons8.com/clouds/100/available-updates.png" alt="Change Management" />
          <Typography variant="h6" mt={1}>Change Management</Typography>
          <Typography variant="body2" color="textSecondary">
            Plan, assess, and track changes to minimize disruption.
          </Typography>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <img src="https://img.icons8.com/clouds/100/book.png" alt="Knowledge Base" />
          <Typography variant="h6" mt={1}>Knowledge Base</Typography>
          <Typography variant="body2" color="textSecondary">
            Publish articles and guides to help teams self-serve and resolve common issues.
          </Typography>
        </section>
      </main>
    </>
  );
};

export default ServicesPage;
