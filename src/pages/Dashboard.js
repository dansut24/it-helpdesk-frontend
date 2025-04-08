import React from "react";
import { Box, Button, Typography, Grid, Paper, Stack } from "@mui/material";

const Dashboard = ({ openTab }) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const currentRole = sessionStorage.getItem("selectedRole") || user.role;
  const isSelfService = currentRole === "selfservice";

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* INCIDENTS CARD */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Incidents</Typography>
            <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => openTab("Incidents")}>
                View Incidents
              </Button>
              <Button variant="contained" color="secondary" onClick={() => openTab("New Incident")}>
                Raise Incident
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* SERVICE REQUESTS CARD */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Service Requests</Typography>
            <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => openTab("Service Requests")}>
                View Requests
              </Button>
              <Button variant="contained" color="secondary" onClick={() => openTab("Raise Service Request")}>
                Raise Request
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* CHANGES CARD */}
        {!isSelfService && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Change Management</Typography>
              <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={() => openTab("Changes")}>
                  View Changes
                </Button>
                <Button variant="contained" color="secondary" onClick={() => openTab("New Change")}>
                  Raise Change
                </Button>
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
