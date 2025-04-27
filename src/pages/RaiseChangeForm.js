// src/pages/RaiseChangeForm.js
import React, { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { submitChange } from "../api";

const RaiseChangeForm = ({ renameTabAfterSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    riskLevel: "Medium",
    requestedDate: "",
    testingPlan: "",
    backoutPlan: "",
    justification: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { title, description, riskLevel, requestedDate, testingPlan, backoutPlan, justification } = formData;
  
    if (!title || !description || !riskLevel) {
      alert("❌ Please complete all required fields.");
      return;
    }
  
    const payload = {
      title,
      description,
      risk_level: riskLevel,
      requested_date: requestedDate,
      testing_plan: testingPlan,
      backout_plan: backoutPlan,
      justification,
    };
  
    try {
      const res = await submitChange(payload);
  
      if (!res || !res.insertId) {
        alert("❌ Failed to submit change.");
        return;
      }
  
      console.log("✅ Change submitted:", res);
      renameTabAfterSubmit("Change " + res.insertId, res.insertId);
    } catch (error) {
      console.error("❌ Error submitting change:", error);
      alert("❌ Submission failed.");
    }
  };
  
  return (
    <Box p={3} sx={{ maxWidth: 600, margin: "auto", bgcolor: "white", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        New Change Request
      </Typography>
      <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} margin="normal" />
      <TextField fullWidth multiline rows={4} label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" />
      <TextField select fullWidth label="Risk Level" name="riskLevel" value={formData.riskLevel} onChange={handleChange} margin="normal">
        {["Low", "Medium", "High"].map((level) => (
          <MenuItem key={level} value={level}>{level}</MenuItem>
        ))}
      </TextField>
      <TextField fullWidth type="date" label="Requested Date" name="requestedDate" value={formData.requestedDate} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} />
      <TextField fullWidth label="Testing Plan" name="testingPlan" value={formData.testingPlan} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Backout Plan" name="backoutPlan" value={formData.backoutPlan} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Business Justification" name="justification" value={formData.justification} onChange={handleChange} margin="normal" />

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default RaiseChangeForm;
