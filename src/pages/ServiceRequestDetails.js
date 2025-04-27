// src/components/ServiceRequestDetails.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { fetchServiceRequestById } from "../api";
import { useAuth } from "../context/AuthContext";
import Notes from "../components/Notes";
import Attachments from "../components/Attachments"; // ✅ New import
import axios from "axios"; // ✅ For fetching tasks

const ServiceRequestDetails = ({ id }) => {
  const [request, setRequest] = useState(null);
  const [tasks, setTasks] = useState([]); // ✅ Tasks state
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    loadServiceRequest();
  }, [id]);

  const loadServiceRequest = async () => {
    try {
      const data = await fetchServiceRequestById(id);
      setRequest(data);
      loadTasks(data.id);
    } catch (err) {
      console.error("❌ Error loading service request:", err);
    }
  };

  const loadTasks = async (requestId) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/type/request/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });      
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err);
    }
  };

  return (
    <Box p={3}>
      {request ? (
        <>
          <Box sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5">{request.title}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {request.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
              Template: {request.template} | Status: {request.status}
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "gray" }}>
              Created: {new Date(request.created_at).toLocaleString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            {/* ✅ Centralized Attachments Component */}
            <Grid item xs={12} md={6}>
              <Attachments entityType="service_request" entityId={request.id} />
            </Grid>

            {/* ✅ Notes Section */}
            <Grid item xs={12} md={6}>
              <Notes entityType="service_request" entityId={request.id} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* ✅ Linked Tasks Section */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Linked Tasks
          </Typography>
          {tasks.length > 0 ? (
            <List dense>
              {tasks.map((task) => (
                <ListItem key={task.id} divider>
                  <ListItemText
                    primary={task.title}
                    secondary={`Status: ${task.status} | Due: ${task.due_date || "N/A"}`}
                  />
                  <Chip
                    label={task.status}
                    color={
                      task.status === "Completed"
                        ? "success"
                        : task.status === "In Progress"
                        ? "primary"
                        : task.status === "Blocked"
                        ? "error"
                        : "default"
                    }
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tasks linked to this request.
            </Typography>
          )}
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default ServiceRequestDetails;
