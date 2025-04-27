import React, { useEffect, useState } from "react";
import {
  Box, Typography, Divider, Grid
} from "@mui/material";
import { fetchChangeById } from "../api";
import Notes from "../components/Notes";
import Attachments from "../components/Attachments"; // ✅ Added Attachments component

const ChangeDetails = ({ id }) => {
  const [change, setChange] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const data = await fetchChangeById(id);
        setChange(data);
      } catch (err) {
        console.error("❌ Error fetching change details:", err);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Box p={3}>
      {change ? (
        <>
          <Box sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5">{change.title}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>{change.description}</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
              Risk Level: {change.riskLevel} | Requested Date: {change.requestedDate}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            {/* DETAILS SECTION */}
            <Grid item xs={12} md={8}>
              <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
                <Typography variant="h6">Change Details</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Backout Plan:</strong> {change.backoutPlan}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Testing Plan:</strong> {change.testingPlan}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Justification:</strong> {change.justification}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Status:</strong> {change.status}</Typography>
              </Box>
            </Grid>

            {/* METADATA & ATTACHMENTS */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2 }}>
                <Typography variant="h6">Metadata</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Created At: {new Date(change.createdAt).toLocaleString()}
                </Typography>
              </Box>

              {/* ✅ Attachments Section */}
              <Attachments entityType="change" entityId={change.id} />
            </Grid>

            {/* ✅ Notes Section */}
            <Grid item xs={12}>
              <Notes entityType="change" entityId={change.id} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography>Loading change details...</Typography>
      )}
    </Box>
  );
};

export default ChangeDetails;
