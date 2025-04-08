// src/pages/Changes.js
import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { fetchChanges } from "../api";

const Changes = ({ openTab }) => {
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    const getChanges = async () => {
      try {
        const data = await fetchChanges();
        setChanges(data);
      } catch (error) {
        console.error("Error fetching changes:", error);
      }
    };
    getChanges();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4">Change Requests</Typography>
      {changes.length > 0 ? (
        <List>
          {changes.map((change) => (
            <ListItem
              button
              key={change.id}
              onClick={() => openTab(`Change ${change.id}`)}
            >
              <ListItemText primary={`[${change.id}] ${change.title}`} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No change requests submitted yet.</Typography>
      )}
    </Box>
  );
};

export default Changes;
