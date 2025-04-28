import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Fade,
  Divider,
  LinearProgress,
  Fab,
} from "@mui/material";
import { createIncident, reserveIncident } from "../api";
import AddIcon from "@mui/icons-material/Add";
import ComputerIcon from "@mui/icons-material/Computer";
import BuildIcon from "@mui/icons-material/Build";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";

const RaiseIncidentForm = ({ renameTabAfterSubmit }) => {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
  });
  const [reference, setReference] = useState("");
  const [incidentId, setIncidentId] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function reserveRef() {
      try {
        const res = await reserveIncident();
        if (res?.referenceNumber && res?.incidentId) {
          setReference(res.referenceNumber);
          setIncidentId(res.incidentId);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("❌ Failed to reserve incident:", err);
        setError("Error reserving incident number");
      }
    }
    reserveRef();
  }, []);

  const handleCustomerNext = () => {
    if (customerName.trim() !== "") {
      setStep(2);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    const result = await createIncident({
      id: incidentId,
      reference_number: reference,
      customer_name: customerName,
      ...formData,
    });

    const refNum = result?.referenceNumber || reference;
    const id = result?.id || incidentId;

    if (refNum && id) {
      if (renameTabAfterSubmit) {
        renameTabAfterSubmit("New Incident", refNum, id);
      }
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (err) {
  console.error("❌ Error submitting incident (simulating success):", err);

  const simulatedReference = reference || `SIM${Math.floor(Math.random() * 10000)}`;
  
  // Save using REFERENCE number
  localStorage.setItem(`fake-incident-${simulatedReference}`, JSON.stringify({
    referenceNumber: simulatedReference,
    customerName: customerName,
    ...formData
  }));

  if (renameTabAfterSubmit) {
    renameTabAfterSubmit("New Incident", simulatedReference, simulatedReference); // openTab uses ref
  }
} finally {
    setSubmitting(false);
  }
};

  const categoryIcons = {
    Hardware: <ComputerIcon fontSize="small" sx={{ mr: 1 }} />,
    Software: <BuildIcon fontSize="small" sx={{ mr: 1 }} />,
    Network: <SettingsEthernetIcon fontSize="small" sx={{ mr: 1 }} />,
  };

  return (
    <Box p={2} position="relative">
      {/* Animated Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={step === 1 ? 50 : 100}
        sx={{ height: 8, borderRadius: 5, mb: 2 }}
      />

      {/* Main Form Container */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          maxWidth: 800,
          mx: "auto",
          borderRadius: 2,
          transition: "0.3s",
          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        {/* Step 1: Customer Search */}
        <Fade in={step === 1} timeout={400} unmountOnExit>
          <Box>
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                mb: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <Box bgcolor="primary.main" p={1}>
                <Typography color="white" variant="subtitle2">
                  End-User Details
                </Typography>
              </Box>
              <Box p={2}>
                <TextField
                  placeholder="Search by name or info"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  fullWidth
                  size="small"
                />

                <Box textAlign="center" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleCustomerNext}
                    disabled={!customerName.trim()}
                    sx={{
                      borderRadius: 8,
                      px: 4,
                      "&:hover": { backgroundColor: "primary.dark" },
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>

        {/* Step 2: Incident Details */}
        <Fade in={step === 2} timeout={400} unmountOnExit>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              {reference ? `New Incident - ${reference}` : "New Incident"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* End-User Section */}
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                mb: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <Box bgcolor="primary.main" p={1}>
                <Typography color="white" variant="subtitle2">
                  End-User Details
                </Typography>
              </Box>
              <Box p={2}>
                <TextField
                  label="Customer Name"
                  value={customerName}
                  fullWidth
                  size="small"
                  disabled
                />
              </Box>
            </Paper>

            {/* Incident Details Section */}
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                mb: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <Box bgcolor="primary.main" p={1}>
                <Typography color="white" variant="subtitle2">
                  Incident Details
                </Typography>
              </Box>
              <Box p={2}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      required
                      helperText="Briefly summarize the issue."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      required
                      helperText="Provide as much detail as possible."
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      select
                      fullWidth
                      size="small"
                      required
                    >
                      {["Low", "Medium", "High"].map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      select
                      fullWidth
                      size="small"
                      required
                    >
                      {["Hardware", "Software", "Network"].map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          <Box display="flex" alignItems="center">
                            {categoryIcons[cat]}
                            {cat}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Submit Button */}
            <Box textAlign="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
                startIcon={submitting && <CircularProgress size={20} />}
                sx={{
                  borderRadius: 8,
                  px: 5,
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                {submitting ? "Submitting..." : "Submit Incident"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Paper>

      {/* Floating Add Button (just a visual addition) */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          boxShadow: 6,
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default RaiseIncidentForm;
