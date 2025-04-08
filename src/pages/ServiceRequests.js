// src/pages/ServiceRequests.js
import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { fetchServiceRequests } from "../api";

const ServiceRequests = ({ openTab }) => {
  const [requests, setRequests] = useState([]);

  // Fetch service requests from MySQL via Express API
  useEffect(() => {
    const getServiceRequests = async () => {
      try {
        const data = await fetchServiceRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching service requests:", error);
      }
    };
    getServiceRequests();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4">Service Requests</Typography>
      {requests.length > 0 ? (
        <List>
          {requests.map((request) => (
            <ListItem
              button
              key={request.id}
              onClick={() => openTab(`Service Request ${request.id}`)}
            >
              <ListItemText primary={`[${request.id}] ${request.title}`} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No service requests have been raised yet.</Typography>
      )}
    </Box>
  );
};

export default ServiceRequests;
