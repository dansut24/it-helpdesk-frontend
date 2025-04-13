import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import { fetchIncidents, assignIncidentToMe } from "../api";
import SearchIcon from "@mui/icons-material/Search";

const Incidents = ({ openTab }) => {
  const [myIncidents, setMyIncidents] = useState([]);
  const [teamAssigned, setTeamAssigned] = useState([]);
  const [teamUnassigned, setTeamUnassigned] = useState([]);
  const [adminIncidents, setAdminIncidents] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const selectedRole = sessionStorage.getItem("selectedRole");

  useEffect(() => {
    
const camelizeIncident = (i) => ({
  ...i,
  referenceNumber: i.reference_number,
  assignedTeamId: i.assigned_team_id,
  assignedUserId: i.assigned_user_id,
  assigned_team_name: i.assigned_team_name || "Unassigned",
  assigned_user_name: i.assigned_user_name || "Unassigned",
  created_by_user_name: i.created_by_user_name || `${i.created_by_first || ""} ${i.created_by_last || ""}`.trim(),
});

  const getIncidents = async () => {
      try {
        const data = await fetchIncidents();

      const normalizeList = (list) => (list || []).map(camelizeIncident);

        if (selectedRole === "admin") {
          setAdminIncidents(data.all || []);
          setMyIncidents([]);
          setTeamAssigned([]);
          setTeamUnassigned([]);
        } else if (selectedRole === "selfservice") {
          setMyIncidents(data.myIncidents || []);
          setTeamAssigned([]);
          setTeamUnassigned([]);
        } else {
          setMyIncidents(data.myIncidents || []);
          const unassigned = (data.teamIncidents || []).filter(i => !i.assigned_user_id);
          const assigned = (data.teamIncidents || []).filter(i => i.assigned_user_id);
          setTeamAssigned(assigned);
          setTeamUnassigned(unassigned);
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    getIncidents();
  }, [selectedRole]);

  const handleAssignToMe = async (incidentId) => {
    try {
      const res = await assignIncidentToMe(incidentId);
      if (res.status === 200) {
        setToast({ open: true, message: "✅ Incident assigned to you.", severity: "success" });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setToast({ open: true, message: "⚠️ This incident was already assigned.", severity: "warning" });
      } else {
        setToast({ open: true, message: "❌ Failed to assign incident.", severity: "error" });
      }
    }

    const updated = await fetchIncidents();
    setMyIncidents(updated.myIncidents || []);
    const unassigned = (updated.teamIncidents || []).filter(i => !i.assigned_user_id);
    const assigned = (updated.teamIncidents || []).filter(i => i.assigned_user_id);
    setTeamAssigned(assigned);
    setTeamUnassigned(unassigned);
  };

  const applyFilters = (list) => {
    return list.filter((incident) => {
      const matchesSearch = search
        ? incident.title.toLowerCase().includes(search.toLowerCase()) ||
          incident.referenceNumber.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesPriority = priorityFilter ? incident.priority === priorityFilter : true;
      return matchesSearch && matchesPriority;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "#fdecea";
      case "Medium": return "#fff4e5";
      case "Low": return "#e7f4e4";
      default: return "#f4f4f4";
    }
  };

  const renderIncidentCard = (list, showAssignButton = false) => (
    <Card variant="outlined" sx={{ mb: 3, backgroundColor: "#fff", boxShadow: 2 }}>
      <CardContent>
        <List>
          {applyFilters(list).map((incident) => (
            <ListItem
              key={incident.referenceNumber}
              divider
              sx={{ backgroundColor: getPriorityColor(incident.priority), borderRadius: 1, mb: 1 }}
              secondaryAction={
                showAssignButton && (
                  <Button variant="contained" size="small" onClick={() => handleAssignToMe(incident.id)}>
                    Assign to Me
                  </Button>
                )
              }
              button={!showAssignButton}
              onClick={() => {
                if (!showAssignButton) {
                  openTab(`Incident ${incident.referenceNumber}`);
                }
              }}
            >
              <ListItemText
                primary={`[${incident.referenceNumber}] ${incident.title}`}
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">Status: {incident.status || "Open"}</Typography>
                    <Typography variant="body2" color="textSecondary">Customer: {incident.created_by_user_name || "Unknown"}</Typography>
                    <Typography variant="body2" color="textSecondary">Assigned Team: {incident.assigned_team_name || "Unassigned"}</Typography>
                    <Typography variant="body2" color="textSecondary">Assigned User: {incident.assigned_user_name || "Unassigned"}</Typography>
                    <Typography variant="body2" color="textSecondary">Most Recent Note: {incident.latest_note?.trim() || "None"}</Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderTabs = () => {
    const tabData = [];
    if (selectedRole === "admin") tabData.push({ label: "All", list: adminIncidents });
    if (selectedRole !== "admin") tabData.push({ label: "My", list: myIncidents });
    if (selectedRole !== "admin" && selectedRole !== "selfservice") {
      tabData.push({ label: "Team Assigned", list: teamAssigned });
      tabData.push({ label: "Team Unassigned", list: teamUnassigned, assign: true });
    }

    return (
      <>
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          sx={{ mb: 2 }}
          textColor="primary"
          indicatorColor="primary"
        >
          {tabData.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        {tabData.length > 0 && renderIncidentCard(tabData[tabIndex].list, tabData[tabIndex].assign)}
      </>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Incidents</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Priority</InputLabel>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} label="Priority">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {renderTabs()}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Incidents;
