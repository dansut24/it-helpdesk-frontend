import React, { useRef, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Select,
  InputBase,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { useThemeMode } from "../context/ThemeContext";

const TopNavbarTabbedView = ({
  tabs,
  setTabs,
  selectedTab,
  setSelectedTab,
  storedUser,
  handleLogout,
  handleSwitchRole,
  goBack,
  tabHistory,
  sidebarWidth,
  toggleMobileSidebar,
  isMobile,
}) => {
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const updateScrollArrows = () => {
    const node = scrollRef.current;
    if (!node) return;
    setShowLeft(node.scrollLeft > 0);
    setShowRight(node.scrollLeft + node.clientWidth < node.scrollWidth);
  };

  useEffect(() => {
    updateScrollArrows();
  }, [tabs]);

  const openTab = (tab) => {
    if (!tabs.includes(tab)) setTabs([...tabs, tab]);
    setSelectedTab(tab);
  };

  const closeTab = (tab) => {
    if (tab === "Dashboard") return;
    const newTabs = tabs.filter((t) => t !== tab);
    setTabs(newTabs);
    if (selectedTab === tab) setSelectedTab("Dashboard");
  };

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const renderedTabs = ["Dashboard", ...tabs.filter((t) => t !== "Dashboard")];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ml: isMobile ? 0 : `${sidebarWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          bgcolor: theme.palette.primary.main,
          height: 48,
          zIndex: 1201,
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 48, px: 1 }}>
          {/* Hamburger Menu */}
          {isMobile && (
            <IconButton size="small" onClick={toggleMobileSidebar} sx={{ color: "white" }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          )}

          {/* Logo and Title */}
          <Box display="flex" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
            <img src="/logo192.png" alt="Logo" style={{ height: 24 }} />
            {!isMobile && (
              <Typography variant="h6" noWrap sx={{ fontSize: 16, color: "#fff" }}>
                Hi5Tech ITSM
              </Typography>
            )}
          </Box>

          <Box flexGrow={1} />

          {/* Search and Theme */}
          {isMobile ? (
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          ) : (
            <>
              <InputBase
                placeholder="Search…"
                sx={{
                  bgcolor: "#ffffff22",
                  color: "white",
                  px: 1,
                  borderRadius: 1,
                  fontSize: 14,
                  width: 180,
                  mr: 1,
                }}
              />
              {tabHistory.length > 0 && (
                <Tooltip title="Go Back">
                  <IconButton size="small" onClick={goBack} sx={{ color: "white" }}>
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Theme">
                <Select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  size="small"
                  variant="standard"
                  disableUnderline
                  sx={{
                    fontSize: "0.75rem",
                    color: "white",
                    mx: 1,
                    ".MuiSelect-icon": { color: "white" },
                  }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                  <MenuItem value="ocean">Ocean</MenuItem>
                  <MenuItem value="sunset">Sunset</MenuItem>
                  <MenuItem value="forest">Forest</MenuItem>
                </Select>
              </Tooltip>
            </>
          )}

          {/* Avatar / Profile */}
          <IconButton size="small" sx={{ color: "white" }} onClick={handleMenuClick}>
            <Avatar
              src={
                storedUser.avatar_url?.startsWith("http")
                  ? storedUser.avatar_url
                  : storedUser.avatar_url
                  ? `http://localhost:5000${storedUser.avatar_url}`
                  : ""
              }
              sx={{ width: 28, height: 28 }}
            >
              {storedUser.username?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Edit Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
            <MenuItem
              onClick={() => {
                handleSwitchRole();
                handleMenuClose();
              }}
            >
              Switch Role
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Tab Bar */}
      <Box
        sx={{
          position: "fixed",
          top: 48,
          left: isMobile ? 0 : `${sidebarWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          display: "flex",
          alignItems: "center",
          height: 44,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 1,
          zIndex: 1200,
          overflowX: "auto",
          transition: "left 0.3s ease, width 0.3s ease",
          gap: 1,
        }}
      >
        {renderedTabs.map((tab) => (
          <Box
            key={tab}
            sx={{
              px: 2,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              borderRadius: 999,
              height: 32,
              bgcolor:
                selectedTab === tab
                  ? theme.palette.primary.light
                  : theme.palette.action.hover,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: 14,
            }}
            onClick={() => openTab(tab)}
          >
            {tab}
            {tab !== "Dashboard" && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab);
                }}
                sx={{ p: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default TopNavbarTabbedView;
