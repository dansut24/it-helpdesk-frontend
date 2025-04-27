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
} from "@mui/material";
import { createIncident, reserveIncident } from "../api";

const RaiseIncidentForm = ({ renameTabAfterSubmit }) => {
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
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          {reference ? `New Incident - ${reference}` : "New Incident"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
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

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  startIcon={submitting && <CircularProgress size={20} />}
                >
                  {submitting ? "Submitting..." : "Submit Incident"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default RaiseIncidentForm;


