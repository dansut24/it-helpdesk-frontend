import React, { useState, useEffect } from "react";
import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { addIncident, getNextIncidentRef, getTeams } from "../api";

const RaiseIncidentForm = ({ onIncidentCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
  });
  const [referenceNumber, setReferenceNumber] = useState("");
  const [assignedTeamId, setAssignedTeamId] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchRef = async () => {
      try {
        const ref = await getNextIncidentRef();
        setReferenceNumber(ref);
      } catch (err) {
        console.error("Failed to fetch next incident ref", err);
      }
    };

    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    };

    fetchRef();
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.priority || !formData.category) {
      alert("❌ Please fill out all fields before submitting.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      category: formData.category,
      referenceNumber: referenceNumber,
      assigned_team_id: assignedTeamId || null,
    };

    try {
      console.log("📡 Submitting new incident...");
      const newIncident = await addIncident(payload);
      console.log("✅ Incident created:", newIncident);
      if (onIncidentCreated) onIncidentCreated(newIncident);
    } catch (err) {
      console.error("❌ Error creating incident:", err);
      alert("❌ Failed to create incident. See console for details.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Raise New Incident - {referenceNumber || "Loading..."}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            name="description"
            label="Description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="priority"
            label="Priority"
            select
            value={formData.priority}
            onChange={handleChange}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="category"
            label="Category"
            select
            value={formData.category}
            onChange={handleChange}
          >
            <MenuItem value="Hardware">Hardware</MenuItem>
            <MenuItem value="Software">Software</MenuItem>
            <MenuItem value="Network">Network</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Assign to Team (Optional)"
            value={assignedTeamId}
            onChange={(e) => setAssignedTeamId(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Incident
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RaiseIncidentForm;
