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
  Drawer,
  IconButton,
  Divider,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { fetchIncidents } from "../api";
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
    const getIncidents = async () => {
      try {
        const data = await fetchIncidents();
        const normalizeList = (list) => (list || []).map((i) => ({
          referenceNumber: i.reference_number || i.referenceNumber,
          title: i.title,
          priority: i.priority || "Medium",
          status: i.status || "Open",
          created_by_user_name: i.created_by_user_name || "Unknown",
          created_at: i.created_at || new Date().toISOString(),
        }));

        let fetched = normalizeList(data.all || data.myIncidents || []);

        if (fetched.length === 0) {
          fetched = Array.from({ length: 5 }).map((_, idx) => ({
            referenceNumber: `TEST-${1000 + idx}`,
            title: `Test Incident ${idx + 1}`,
            priority: ["High", "Medium", "Low"][idx % 3],
            status: ["Open", "Paused", "Waiting for Customer", "Resolved", "Closed"][idx % 5],
            created_by_user_name: "Demo User",
            created_at: new Date().toISOString(),
          }));
        }

        setIncidents(fetched);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);

        const demoIncidents = Array.from({ length: 5 }).map((_, idx) => ({
          referenceNumber: `TEST-${1000 + idx}`,
          title: `Test Incident ${idx + 1}`,
          priority: ["High", "Medium", "Low"][idx % 3],
          status: ["Open", "Paused", "Waiting for Customer", "Resolved", "Closed"][idx % 5],
          created_by_user_name: "Demo User",
          created_at: new Date().toISOString(),
        }));

        setIncidents(demoIncidents);
      }
    };

    getIncidents();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ff4d4f"; // red
      case "Medium":
        return "#faad14"; // orange
      case "Low":
        return "#52c41a"; // green
      default:
        return "#d9d9d9"; // grey
    }
  };

  const formatDate = (dateStr) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "primary";
      case "Paused": return "warning";
      case "Resolved": return "success";
      case "Waiting for Customer": return "info";
      case "Closed": return "default";
      default: return "default";
    }
  };

  const applyFilters = (list) => {
    return list.filter((incident) => {
      const matchesSearch = search
        ? incident.title.toLowerCase().includes(search.toLowerCase()) ||
          incident.referenceNumber.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesPriority = priorityFilter ? incident.priority === priorityFilter : true;
      const matchesStatus = statusFilter ? incident.status === statusFilter : true;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  };

  return (
    <Box p={3}>
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          backgroundColor: "#f5f5f5",
          p: 2,
          borderRadius: 2,
          mx: -3,
          px: { xs: 2, sm: 3 },
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
          sx={{ flexGrow: 1, minWidth: 0 }}
        />
        <IconButton
          color="primary"
          onClick={() => setFilterDrawerOpen(true)}
          sx={{ ml: 1 }}
        >
          <TuneIcon />
        </IconButton>
      </Box>

      {/* Incident Cards */}
      {applyFilters(incidents).map((incident) => (
        <Card
          key={incident.referenceNumber}
          variant="outlined"
          sx={{
            mb: 2,
            cursor: "pointer",
            display: "flex",
            borderLeft: `6px solid ${getPriorityColor(incident.priority)}`,
            transition: "background-color 0.2s",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
          onClick={() => openTab(`Incident ${incident.referenceNumber}`)}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            {/* Left side (Priority Chip + Title + User) */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Chip
                  label={incident.priority}
                  size="small"
                  sx={{
                    backgroundColor: getPriorityColor(incident.priority),
                    color: "#fff",
                    height: 20,
                  }}
                />
                <Typography variant="subtitle2" fontWeight="bold">
                  {incident.title}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {incident.created_by_user_name}
              </Typography>
            </Box>

            {/* Right side (ID + Date + Status badge) */}
            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary">
                ID: {incident.referenceNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {formatDate(incident.created_at)}
              </Typography>
              <Chip
                label={incident.status}
                size="small"
                color={getStatusColor(incident.status)}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Drawer */}
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
