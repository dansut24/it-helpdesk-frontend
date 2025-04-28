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
        customer_name: customerName, // Include customer name
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
    <Box p={3}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        {/* Step Indicator */}
        <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
          Step {step} of 2
        </Typography>

        {/* Customer Name Step */}
        <Fade in={step === 1} timeout={500} unmountOnExit>
          <Box>
            <Typography variant="h5" gutterBottom align="center">
              Start New Incident
            </Typography>
            <Divider sx={{ my: 2 }} />
            <TextField
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              required
              helperText="Enter the name of the customer reporting the issue."
            />
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCustomerNext}
                disabled={!customerName.trim()}
                size="large"
              >
                Next
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Full Incident Form Step */}
        <Fade in={step === 2} timeout={500} unmountOnExit>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom align="center">
              {reference ? `New Incident - ${reference}` : "New Incident"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Customer Info Section */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Customer Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              label="Customer Name"
              value={customerName}
              fullWidth
              disabled
              sx={{ mb: 3 }}
            />

            {/* Incident Details Section */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Incident Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              helperText="Enter a brief summary of the incident."
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              helperText="Please describe the issue in as much detail as possible."
              sx={{ mb: 3 }}
            />

            {/* Priority and Category */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Priority and Category
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  select
                  fullWidth
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

            {/* Submit Button */}
            <Box display="flex" justifyContent="center" mt={5}>
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
