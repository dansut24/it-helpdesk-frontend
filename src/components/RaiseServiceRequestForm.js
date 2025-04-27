import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import { fetchTeams } from "../api";

const RaiseServiceRequestForm = ({ onSuccess, renameTabAfterSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    template: "",
  });

  const [teams, setTeams] = useState([]);
  const [assignedTeamId, setAssignedTeamId] = useState("");
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const [teamRes, templateRes] = await Promise.all([
          fetchTeams(),
          axios.get("${process.env.REACT_APP_API_URL}/api/templates", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTeams(Array.isArray(teamRes) ? teamRes : []);

        const rawTemplates = templateRes.data;
        const normalizedTemplates = Array.isArray(rawTemplates)
          ? rawTemplates
          : rawTemplates
          ? [rawTemplates]
          : [];

        console.log("🔍 Template API response:", normalizedTemplates);
        setTemplates(normalizedTemplates);
      } catch (err) {
        console.error("❌ Failed to fetch templates or teams", err);
        setTeams([]);
        setTemplates([]);
      }
    };

    loadInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-fill title and description based on selected template
    if (name === "template") {
      const selected = templates.find((tpl) => String(tpl.id) === String(value));
      if (selected) {
        setForm({
          ...form,
          template: value,
          title: selected.name,
          description: selected.description || "",
        });
        return;
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");

      const payload = {
        ...form,
        template: Number(form.template), // <-- Force it to a number
        assigned_team_id: assignedTeamId || null,
      };

      const response = await axios.post(
        "${process.env.REACT_APP_API_URL}/api/service-requests",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newId = response?.data?.id;

      alert("✅ Service request submitted successfully!");
      setForm({ title: "", description: "", template: "" });
      setAssignedTeamId("");

      if (onSuccess) onSuccess();
      if (renameTabAfterSubmit && newId) {
        renameTabAfterSubmit("Raise Service Request", newId);
      }
    } catch (err) {
      console.error("❌ Error submitting service request:", err);
      alert("❌ Failed to submit service request.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Raise a Service Request
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        multiline
        rows={4}
        value={form.description}
        onChange={handleChange}
        required
      />

      <TextField
        select
        fullWidth
        margin="normal"
        label="Template"
        name="template"
        value={form.template}
        onChange={handleChange}
        required
      >
        {templates.length > 0 ? (
          templates.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            No templates available
          </MenuItem>
        )}
      </TextField>

      <TextField
        select
        fullWidth
        margin="normal"
        label="Assign to Team"
        value={assignedTeamId}
        onChange={(e) => setAssignedTeamId(e.target.value)}
      >
        <MenuItem value="">-- Unassigned --</MenuItem>
        {teams.map((team) => (
          <MenuItem key={team.id} value={team.id}>
            {team.name}
          </MenuItem>
        ))}
      </TextField>

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Submit Request
      </Button>
    </Box>
  );
};

export default RaiseServiceRequestForm;
