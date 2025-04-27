// components/TaskForm.js
import React, { useState } from "react";
import { TextField, Button, MenuItem, Box } from "@mui/material";
import axios from "axios";

const TaskForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Open",
    due_date: "",
    linked_type: "request",
    linked_id: "",
  });

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post("${process.env.REACT_APP_API_URL}/api/tasks", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth />
      <TextField name="description" label="Description" value={formData.description} onChange={handleChange} multiline rows={3} fullWidth />
      <TextField name="due_date" type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={formData.due_date} onChange={handleChange} fullWidth />
      <TextField select name="status" label="Status" value={formData.status} onChange={handleChange} fullWidth>
        {["Open", "In Progress", "Completed", "Blocked"].map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>
      <TextField select name="linked_type" label="Linked To" value={formData.linked_type} onChange={handleChange} fullWidth>
        {["incident", "request", "change"].map((type) => (
          <MenuItem key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
      </TextField>
      <TextField name="linked_id" label="Linked ID" value={formData.linked_id} onChange={handleChange} fullWidth />

      <Button variant="contained" onClick={handleSubmit}>
        Save Task
      </Button>
    </Box>
  );
};

export default TaskForm;
