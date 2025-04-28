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
  Drawer,
  IconButton,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { fetchIncidents, assignIncidentToMe } from "../api";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";

const Incidents = ({ openTab }) => {
  const [incidents, setIncidents] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

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

        let fetchedIncidents = normalizeList(data.all || data.myIncidents || []);

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

        // If no real incidents, inject some demo ones
        if (fetchedIncidents.length === 0 && fakeIncidents.length === 0) {
          const demoIncidents = Array.from({ length: 5 }).map((_, idx) => ({
            referenceNumber: `DEMO-${1000 + idx}`,
            title: `Test Incident ${idx + 1}`,
            priority: idx % 3 === 0 ? "High" : idx % 2 === 0 ? "Medium" : "Low",
            status: ["Open", "Paused", "Resolved", "Waiting for Customer", "Closed"][idx % 5],
            created_by_user_name: "Demo User",
            assigned_team_name: "Support",
            assigned_user_name: "Technician A",
          }));
          fetchedIncidents = demoIncidents;
        }

        setIncidents([...fakeIncidents, ...fetchedIncidents]);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    getIncidents();
  }, []);

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

  return (
    <Box p={3}>
      {/* Search + Filter Bar */}
      {/* Search + Filter Bar */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    mb: 3,
    backgroundColor: "#f5f5f5",
    p: 2,
    borderRadius: 2,
    mx: -3, // <-- cancels the outer Box p={3} padding!
    flexWrap: isMobile ? "wrap" : "nowrap",
  }}
>
  <TextField
    variant="outlined"
    size="small"
    placeholder="Search incidents..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    sx={{ flexGrow: 1, minWidth: isMobile ? "100%" : "auto" }}
  />

  <IconButton color="primary" onClick={() => setFilterDrawerOpen(true)}>
    <TuneIcon />
  </IconButton>
</Box>
      {/* Incident Cards */}
      {applyFilters(incidents).map((incident) => (
        <Card
          key={incident.referenceNumber}
          variant="outlined"
          sx={{ mb: 3, backgroundColor: "#fff", boxShadow: 2 }}
        >
          <CardContent
            onClick={() => openTab(`Incident ${incident.referenceNumber}`)}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6">
              [{incident.referenceNumber}] {incident.title}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Status: {incident.status || "Open"} | Priority: {incident.priority || "N/A"}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Customer: {incident.created_by_user_name || "Unknown"}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Assigned Team: {incident.assigned_team_name || "Unassigned"}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Assigned User: {incident.assigned_user_name || "Unassigned"}
            </Typography>
          </CardContent>
        </Card>
      ))}

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
