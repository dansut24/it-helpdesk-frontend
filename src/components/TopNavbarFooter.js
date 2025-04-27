// TopNavbarFooter.js
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const TopNavbarFooter = ({ storedUser, handleLogout, handleSwitchRole, openTab }) => {
  const roles = storedUser?.roles || [];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        px: 2,
        py: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "center",
      }}
    >
      {roles.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          Roles: {roles.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary">
        Powered by Hi5Tech
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} mt={1}>
        <Tooltip title="Profile">
          <IconButton onClick={() => openTab("Profile")} size="small">
            <Avatar
              src={
                storedUser.avatar_url?.startsWith("http")
                  ? storedUser.avatar_url
                  : storedUser.avatar_url
                  ? `http://localhost:5000${storedUser.avatar_url}`
                  : ""
              }
              sx={{ width: 30, height: 30 }}
            >
              {storedUser.username?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Tooltip title="Switch Role">
          <IconButton onClick={handleSwitchRole} size="small">
            <AccountCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} size="small">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TopNavbarFooter;
