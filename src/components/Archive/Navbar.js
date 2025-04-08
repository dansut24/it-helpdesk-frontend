import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Navbar = ({ openTab, handleLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#1976d2", zIndex: 1200 }}>
        <Toolbar>
          {/* ✅ Mobile View: Only Show Logo */}
          {isMobile ? (
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
              My App
            </Typography>
          ) : (
            /* ✅ Desktop View: Full Navbar */
            <>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>My App</Typography>
              <Button color="inherit" onClick={() => openTab("Incidents")}>Incidents</Button>
              <Button color="inherit" onClick={() => openTab("Service Requests")}>Service Requests</Button>
              <Button color="inherit" onClick={() => openTab("Profile")}>Profile</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;