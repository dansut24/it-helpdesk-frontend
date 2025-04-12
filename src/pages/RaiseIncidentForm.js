// src/pages/RaiseIncidentForm.js
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { addIncident, fetchNextIncidentRef, fetchTeams } from "../api";

const RaiseIncidentForm = ({ renameTabAfterSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Software",
  });

  const [referenceNumber, setReferenceNumber] = useState("Loading...");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [teams, setTeams] = useState([]);
  const [assignedTeamId, setAssignedTeamId] = useState("");

  useEffect(() => {
    const getNextReference = async () => {
      try {
        const nextRef = await fetchNextIncidentRef();
        setReferenceNumber(nextRef.nextRef);
      } catch (error) {
        console.error("❌ Error fetching next incident reference:", error);
        setReferenceNumber("Error");
      }
    };
  
    const loadTeams = async () => {
      try {
        const allTeams = await fetchTeams();
        setTeams(allTeams);
      } catch (err) {
        console.error("❌ Failed to load teams", err);
      }
    };
  
    getNextReference();
    loadTeams();
  }, []);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.priority || !formData.category) {
      alert("❌ Please fill out all fields before submitting.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    formDataToSend.append("referenceNumber", referenceNumber);

    if (assignedTeamId) {
      formDataToSend.append("assigned_team_id", assignedTeamId);
    }
        
    if (selectedFile) formDataToSend.append("file", selectedFile);

    try {
      console.log("📡 Submitting new incident...");
      const newIncident = await addIncident(formDataToSend);

      if (!newIncident?.referenceNumber) {
        alert("❌ Error creating incident. Try again.");
        return;
      }

      console.log("✅ Incident Created:", newIncident.referenceNumber);

      setTimeout(() => {
        renameTabAfterSubmit("New Incident", newIncident.referenceNumber);
      }, 1000);
    } catch (error) {
      console.error("❌ Error adding incident:", error);
      alert("❌ Failed to raise the incident. Try again.");
    }
  };

  return (
    <Box p={3} sx={{ maxWidth: 600, margin: "auto", bgcolor: "white", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        New Incident - {referenceNumber}
      </Typography>
      <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} margin="normal" />
      <TextField
        fullWidth label="Description" name="description" multiline rows={4}
        value={formData.description} onChange={handleChange} margin="normal"
      />
      <TextField select fullWidth label="Priority" name="priority" value={formData.priority} onChange={handleChange} margin="normal">
        {["Low", "Medium", "High", "Critical"].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
      </TextField>
      <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} margin="normal">
        {["Software", "Hardware", "Network", "Access Request", "Other"].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>
      <TextField
  select
  fullWidth
  label="Assign to Team"
  value={assignedTeamId}
  onChange={(e) => setAssignedTeamId(e.target.value)}
  margin="normal"
>
  <MenuItem value="">-- Unassigned --</MenuItem>
  {teams.map((team) => (
    <MenuItem key={team.id} value={team.id}>
      {team.name}
    </MenuItem>
  ))}
</TextField>


      <Box sx={{ mt: 2 }}>
        <input type="file" onChange={handleFileChange} />
        {filePreview && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <img src={filePreview} alt="Preview" style={{ width: 100, height: 100, borderRadius: 4 }} />
          </Box>
        )}
      </Box>

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default RaiseIncidentForm;
