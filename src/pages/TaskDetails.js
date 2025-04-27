import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const TaskDetails = ({ id, openTab }) => {
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [assignedUser, setAssignedUser] = useState("");
  const [assignedTeam, setAssignedTeam] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchTask = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
      setAssignedUser(res.data.assigned_user_id || "");
      setAssignedTeam(res.data.assigned_team_id || "");
    } catch (err) {
      console.error("Failed to load task details", err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get("${process.env.REACT_APP_API_URL}/api/users", { headers })
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users:", err));

    axios.get("${process.env.REACT_APP_API_URL}/api/teams", { headers })
      .then(res => setTeams(res.data))
      .catch(err => console.error("Failed to fetch teams:", err));
  }, []);

  const handleReassign = async () => {
    setIsSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${id}/assign`,
        {
          assigned_user_id: assignedUser || null,
          assigned_team_id: assignedTeam || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTask(); // Refresh data after update
    } catch (err) {
      console.error("❌ Failed to reassign task:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!task) return <Box p={3}><CircularProgress /></Box>;

  const filteredUsers = users.filter((u) => u.team_id === task.assigned_team_id);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Task Details</Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1"><strong>Title:</strong> {task.title}</Typography>
      <Typography variant="body1"><strong>Status:</strong> {task.status}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {task.description || "N/A"}</Typography>
      <Typography variant="body1"><strong>Due Date:</strong> {task.due_date || "N/A"}</Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Reassignment</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Assigned User</InputLabel>
        <Select
          value={assignedUser}
          label="Assigned User"
          onChange={(e) => setAssignedUser(e.target.value)}
        >
          <MenuItem value="">Unassigned</MenuItem>
          {filteredUsers.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.first_name} {user.last_name} ({user.username})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled>
        <InputLabel>Assigned Team</InputLabel>
        <Select value={assignedTeam}>
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleReassign}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Assignment"}
      </Button>

      {task.linked_type === "request" && task.linked_id && (
        <Button
          variant="outlined"
          sx={{ mt: 3, ml: 2 }}
          onClick={() => openTab(`Service Request ${task.linked_id}`)}
        >
          Open Linked Service Request
        </Button>
      )}
    </Box>
  );
};

export default TaskDetails;
