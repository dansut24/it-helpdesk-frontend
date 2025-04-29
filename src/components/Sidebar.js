import React from 'react';
import { Box, List, ListItem, ListItemText, Divider, IconButton, Typography } from '@mui/material';
import { Home as HomeIcon, Folder as FolderIcon, Build as BuildIcon, MoreVert as MoreVertIcon, Settings as SettingsIcon, AccountCircle as AccountCircleIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import HoverMenuItem from './HoverMenuItem'; // Make sure you move or import HoverMenuItem correctly

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarWidth,
  selectedTab,
  openTab,
  navItemStyles,
  navIconStyles,
  isMobile,
  mobileSidebarOpen,
  setMobileSidebarOpen
}) => {
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}
      >
        <List>
          {/* Mobile Sidebar Items */}
          {/* (similar to your current Drawer List) */}
        </List>
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: sidebarWidth,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        position: 'fixed',
        top: 64, // Below AppBar
        left: 0,
        zIndex: 1200,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: sidebarOpen ? 'flex-start' : 'center',
        overflow: 'hidden',
        py: 2,
        px: sidebarOpen ? 2 : 0,
      }}
    >
      {/* Collapse Button */}
      <IconButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{
          alignSelf: sidebarOpen ? 'flex-end' : 'center',
          mb: 2,
          backgroundColor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          transition: 'all 0.3s ease',
        }}
        size="small"
      >
        {sidebarOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
      </IconButton>

      {/* Sidebar List Items */}
      <List sx={{ width: '100%', pt: 2 }}>
        <Divider textAlign="left" sx={{ width: '100%', mb: 1 }}>
          {sidebarOpen && (
            <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
              MAIN
            </Typography>
          )}
        </Divider>

        <ListItem
          button
          selected={selectedTab === "Dashboard"}
          onClick={() => openTab("Dashboard")}
          sx={navItemStyles(selectedTab === "Dashboard", sidebarOpen)}
        >
          <HomeIcon sx={navIconStyles(sidebarOpen)} />
          {sidebarOpen && <ListItemText primary="Dashboard" />}
        </ListItem>

        {/* Other HoverMenuItem sections like Incidents, Service Requests, Changes */}
        <HoverMenuItem
          icon={<FolderIcon />}
          label="Incidents"
          active={selectedTab.includes("Incident")}
          open={sidebarOpen}
          subItems={[
            { label: "View Incidents", onClick: () => openTab("Incidents") },
            { label: "New Incident", onClick: () => openTab("New Incident") },
          ]}
        />

        {/* Same for Service Requests, Changes */}

        <Divider textAlign="left" sx={{ width: '100%', mt: 2, mb: 1 }}>
          {sidebarOpen && (
            <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
              ADMIN
            </Typography>
          )}
        </Divider>

        <ListItem
          button
          selected={selectedTab === "Admin Settings"}
          onClick={() => openTab("Admin Settings")}
          sx={navItemStyles(selectedTab === "Admin Settings", sidebarOpen)}
        >
          <SettingsIcon sx={navIconStyles(sidebarOpen)} />
          {sidebarOpen && <ListItemText primary="Admin Settings" />}
        </ListItem>

        <ListItem
          button
          selected={selectedTab === "Profile"}
          onClick={() => openTab("Profile")}
          sx={navItemStyles(selectedTab === "Profile", sidebarOpen)}
        >
          <AccountCircleIcon sx={navIconStyles(sidebarOpen)} />
          {sidebarOpen && <ListItemText primary="Profile" />}
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
