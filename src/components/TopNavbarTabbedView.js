import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";

const TopNavbarTabbedView = ({
  tabs,
  setTabs,
  selectedTab,
  setSelectedTab,
  storedUser,
  handleLogout,
  sidebarOpen,
  toggleSidebar,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const openTab = (tab) => {
    if (!tabs.includes(tab)) setTabs([...tabs, tab]);
    setSelectedTab(tab);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const sidebarItems = [
    { label: "Dashboard", icon: <HomeIcon />, tab: "Dashboard" },
    { label: "Incidents", icon: <FolderIcon />, tab: "Incidents" },
    { label: "Service Requests", icon: <BuildIcon />, tab: "Service Requests" },
    { label: "Changes", icon: <SettingsIcon />, tab: "Changes" },
    { label: "Tasks", icon: <ListAltIcon />, tab: "Tasks" },
    { label: "Profile", icon: <AccountCircleIcon />, tab: "Profile" },
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar variant="dense">
          {isMobile && (
            <IconButton color="inherit" onClick={() => setMobileSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ITSM Workspace
          </Typography>

          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>

          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          <IconButton color="inherit" onClick={openMenu}>
            <Avatar sx={{ width: 28, height: 28 }}>{storedUser?.username?.[0]?.toUpperCase() || "U"}</Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileSidebarOpen : true}
        onClose={() => setMobileSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? 240 : 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            top: isMobile ? 0 : 48, // offset for AppBar height
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List sx={{ overflowY: "auto" }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.label}
              selected={selectedTab === item.tab}
              onClick={() => openTab(item.tab)}
            >
              {item.icon}
              <ListItemText primary={item.label} sx={{ ml: 2 }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default TopNavbarTabbedView;
