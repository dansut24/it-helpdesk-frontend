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
} from "@mui/material";
import { createIncident, reserveIncident } from "../api";

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
      console.error("❌ Error submitting incident:", err);
      setError("Failed to submit incident. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: "auto", borderRadius: 2 }}>
        {/* Step Progress */}
        <Typography variant="subtitle2" align="center" sx={{ mb: 2 }}>
          Step {step} of 2
        </Typography>

        {/* Step 1: Customer Search / Entry */}
        <Fade in={step === 1} timeout={400} unmountOnExit>
          <Box>
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
              <Box bgcolor="primary.main" p={1}>
                <Typography color="white" variant="subtitle2">
                  End-User Details
                </Typography>
              </Box>
              <Box p={2}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12}>
                    <TextField
                      placeholder="Search by name or info"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Box textAlign="center" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleCustomerNext}
                    disabled={!customerName.trim()}
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
            {/* New Incident Header */}
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              {reference ? `New Incident - ${reference}` : "New Incident"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* End-User Details Card */}
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
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

            {/* Incident Details Card */}
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
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
                      helperText="Enter a brief summary of the incident."
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
                      helperText="Describe the issue clearly for faster resolution."
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
                          {cat}
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
              >
                {submitting ? "Submitting..." : "Submit Incident"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
};

export default RaiseIncidentForm;
