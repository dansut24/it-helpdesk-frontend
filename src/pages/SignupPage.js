import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Paper } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SignupPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [tenantDomain, setTenantDomain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/setup/company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          tenant_domain: tenantDomain,
          logo_url: "",
        }),
      });

      console.log("Raw signup response", response);

      const data = await response.json();
      console.log("Parsed signup response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Redirect to the setup wizard on the new subdomain
      window.location.href = `https://${tenantDomain}/setup`;
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 10, mb: 6 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create Your Workspace
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Start your 14-day free trial with Hi5Tech. Set up your company workspace now.
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Company Name"
              fullWidth
              required
              margin="normal"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <TextField
              label="Subdomain"
              fullWidth
              required
              margin="normal"
              value={tenantDomain}
              onChange={(e) =>
                setTenantDomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
              }
              helperText="Your workspace will be created at https://[subdomain]-itsm.hi5tech.co.uk"
            />

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default SignupPage;
