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
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";
import { fetchIncidents, assignIncidentToMe } from "../api";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune"; 
import CloseIcon from "@mui/icons-material/Close"; 

const Incidents = ({ openTab }) => {
  const [myIncidents, setMyIncidents] = useState([]);
  const [teamAssigned, setTeamAssigned] = useState([]);
  const [teamUnassigned, setTeamUnassigned] = useState([]);
  const [adminIncidents, setAdminIncidents] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const selectedRole = sessionStorage.getItem("selectedRole");

  useEffect(() => {
    const camelizeIncident = (i) => ({
      ...i,
      referenceNumber: i.reference_number || i.referenceNumber,
      assignedTeamId: i.assigned_team_id || i.assignedTeamId,
      assignedUserId: i.assigned_user_id || i.assignedUserId,
      assigned_team_name: i.assigned_team_name || "Unassigned",
      assigned_user_name: i.assigned_user_name || "Unassigned",
      created_by_user_name: i.created_by_user_name || `${i.created_by_first || ""} ${i.created_by_last || ""}`.trim(),
    });

    const getIncidents = async () => {
      try {
        const data = await fetchIncidents();
        const normalizeList = (list) => (list || []).map(camelizeIncident);

        if (selectedRole === "admin") {
          setAdminIncidents(normalizeList(data.all || []));
          setMyIncidents([]);
          setTeamAssigned([]);
          setTeamUnassigned([]);
        } else if (selectedRole === "selfservice") {
          setMyIncidents(normalizeList(data.myIncidents || []));
          setTeamAssigned([]);
          setTeamUnassigned([]);
        } else {
          setMyIncidents(normalizeList(data.myIncidents || []));
          const unassigned = (data.teamIncidents || []).filter(i => !i.assigned_user_id);
          const assigned = (data.teamIncidents || []).filter(i => i.assigned_user_id);
          setTeamAssigned(normalizeList(assigned));
          setTeamUnassigned(normalizeList(unassigned));
        }

        // Load test incidents from localStorage
        const fakeIncidents = [];
        for (let key in localStorage) {
          if (key.startsWith("fake-incident-")) {
            const item = localStorage.getItem(key);
            if (item) {
              fakeIncidents.push(JSON.parse(item));
            }
          }
        }
        if (fakeIncidents.length > 0) {
          setMyIncidents(prev => [...fakeIncidents, ...prev]);
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
  };

  const applyFilters = (list) => {
    return list.filter((incident) => {
      const matchesSearch = search
        ? (incident.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (incident.referenceNumber || "").toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesPriority = priorityFilter ? incident.priority === priorityFilter : true;
      const matchesStatus = statusFilter ? incident.status === statusFilter : true;
      return matchesSearch && matchesPriority && matchesStatus;
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
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabData.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        {/* NEW Header Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            p: 1,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            sx={{ width: "70%" }}
          />

          <IconButton color="primary" onClick={() => setFilterDrawerOpen(true)}>
            <TuneIcon />
          </IconButton>
        </Box>

        {tabData.length > 0 && renderIncidentCard(tabData[tabIndex].list, tabData[tabIndex].assign)}
      </>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Incidents</Typography>

      {renderTabs()}

      {/* Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              label="Priority"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
              <MenuItem value="Waiting for Customer">Waiting for Customer</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setPriorityFilter("");
              setStatusFilter("");
              setSearch("");
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </Drawer>

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

export default Incidents;
