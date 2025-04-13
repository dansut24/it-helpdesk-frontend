
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Divider, Grid, TextField, Autocomplete, Button,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert
} from "@mui/material";
import axios from "axios";
import { fetchIncidentByReference, updateIncidentAssignee, updateIncidentTeam } from "../api";
import { useAuth } from "../context/AuthContext";
import Notes from "../components/Notes";
import Attachments from "../components/Attachments";

const IncidentDetails = ({ referenceNumber, openTab }) => {
  const [incident, setIncident] = useState(null);
  const [slaTimeLeft, setSlaTimeLeft] = useState("");
  const [allTeams, setAllTeams] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const { user } = useAuth();

  const isEditable = !(user?.roles?.length === 1 && user.roles.includes("selfservice"));
  const statusOptions = ["Open", "Paused", "Waiting for Customer", "Resolved", "Closed"];

  useEffect(() => {
    if (!referenceNumber || referenceNumber === "undefined") return;
    loadIncident();
  }, [referenceNumber]);

  const loadIncident = async () => {
    try {
      const data = await fetchIncidentByReference(referenceNumber);
      if (!data || typeof data !== "object") throw new Error("Invalid incident data");

      data.priority = data.priority || "Unknown";
      if (data.sla_due) calculateSlaTimeLeft(data.sla_due, data.total_paused_seconds || 0);
      data.notes = Array.isArray(data.notes) ? data.notes.filter(n => n.content?.trim()) : [];
      data.attachments = Array.isArray(data.attachments) ? data.attachments : [];

      if (!data.created_by_user_name && data.created_by_first && data.created_by_last) {
        data.created_by_user_name = `${data.created_by_first} ${data.created_by_last}`;
      }

      setIncident(data);
      setSelectedTeamId(data.assigned_team_id || null);

      const token = sessionStorage.getItem("token");
      const { data: teams } = await axios.get(`${process.env.REACT_APP_API_URL}/api/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTeams(teams);

      if (data.assigned_team_id) fetchUsersForTeam(data.assigned_team_id);

      if (isEditable) {
        const { data: users } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(users);
      }
    } catch (err) {
      console.error("❌ Failed to load incident:", err);
    }
  };

  const fetchUsersForTeam = async (teamId) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data: users } = await axios.get(`${process.env.REACT_APP_API_URL}/api/teams/${teamId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamUsers(users);
    } catch (err) {
      console.error("❌ Failed to fetch users for team:", err);
    }
  };

  const calculateSlaTimeLeft = (slaDue, pausedSeconds = 0) => {
    const due = new Date(slaDue).getTime() + (pausedSeconds * 1000);
    const now = Date.now();
    const diff = due - now;

    if (incident?.status === "Paused") return setSlaTimeLeft("⏸️ SLA Paused");
    if (diff <= 0) return setSlaTimeLeft("🚨 SLA Breached!");

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setSlaTimeLeft(`⏳ ${hours}h ${minutes}m remaining`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (incident?.sla_due) calculateSlaTimeLeft(incident.sla_due, incident.total_paused_seconds || 0);
    }, 60000);

    if (incident?.sla_due) calculateSlaTimeLeft(incident.sla_due, incident.total_paused_seconds || 0);
    return () => clearInterval(timer);
  }, [incident]);

  const handleSaveAssignment = async () => {
    try {
      if (selectedTeamId !== incident.assigned_team_id) {
        await updateIncidentTeam(incident.id, selectedTeamId);
        await fetchUsersForTeam(selectedTeamId);
      }

      if (selectedUser?.id && selectedUser?.id !== incident.assigned_user_id) {
        await updateIncidentAssignee(incident.id, selectedUser.id);
      }

      setToast({ open: true, message: "✅ Assignment updated", severity: "success" });
      await loadIncident();
    } catch (err) {
      console.error("❌ Saving assignment failed:", err);
      setToast({ open: true, message: "❌ Failed to save assignment", severity: "error" });
    }
  };

  
const handleStatusChange = async (newStatus) => {
  try {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/incidents/${incident.id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
    );

    setIncident((prev) => ({
      ...prev,
      status: newStatus,
    }));

    setToast({ open: true, message: "✅ Status updated", severity: "success" });
  } catch (err) {
    console.error("❌ Failed to update status:", err);
    setToast({ open: true, message: "❌ Failed to update status", severity: "error" });
  }
};

return (
    <Box p={3}>
      {incident ? (
        <>
          <Box sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5">{incident.title}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>{incident.description}</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
              Priority: {incident.priority} | SLA: {slaTimeLeft}
            </Typography>

            <FormControl sx={{ mt: 2, minWidth: 200 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={incident.status || ""}
                onChange={(e) => handleStatusChange(e.target.value)}
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <Typography variant="body2">Assigned Team:</Typography>
              <Autocomplete
                size="small"
                options={allTeams}
                getOptionLabel={(option) => option.name || ""}
                value={allTeams.find(t => t.id === selectedTeamId) || null}
                onChange={(e, newTeam) => {
                  if (newTeam) {
                    setSelectedTeamId(newTeam.id);
                    fetchUsersForTeam(newTeam.id);
                    setSelectedUser(null);
                  }
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
                sx={{ minWidth: 180 }}
                disabled={!isEditable}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <Typography variant="body2">Assigned User:</Typography>
              <Autocomplete
                size="small"
                options={teamUsers}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.username})`}
                value={teamUsers.find(u => u.id === incident.assigned_user_id) || null}
                onChange={(e, newUser) => setSelectedUser(newUser)}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ minWidth: 250 }}
                disabled={!isEditable}
              />
              {isEditable && (
                <Button variant="contained" onClick={handleSaveAssignment}>Save</Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Notes entityType="incident" entityId={incident.id} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Attachments entityType="incident" entityId={incident.id} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IncidentDetails;
