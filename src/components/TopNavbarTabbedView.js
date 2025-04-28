import React, { useRef, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Select,
  MenuItem,
  Paper,
  InputBase,
  Menu,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mode, setMode } = useThemeMode();
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const renderedTabs = ["Dashboard", ...tabs.filter((t) => t !== "Dashboard")];

  const updateScrollArrows = () => {
    const node = scrollRef.current;
    if (!node) return;
    setShowLeft(node.scrollLeft > 0);
    setShowRight(node.scrollLeft + node.clientWidth < node.scrollWidth);
  };

  useEffect(() => {
    updateScrollArrows();
  }, [tabs]);

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ml: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          bgcolor: theme.palette.primary.main,
          height: 48,
          zIndex: 1201,
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <Toolbar variant="dense" sx={{ px: 1, minHeight: 48 }}>
          <Box display="flex" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
            <img src="/logo192.png" alt="Logo" style={{ height: 24 }} />
            {!isMobile && (
              <Typography variant="h6" noWrap sx={{ fontSize: 16, color: "#fff" }}>
                Hi5Tech ITSM
              </Typography>
            )}
          </Box>

          <Box flexGrow={1} />

          {isMobile ? (
            <>
              <IconButton
                size="small"
                sx={{ color: "white" }}
                onClick={() => setSearchOpen((prev) => !prev)}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </>
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
                    <ArrowBackIcon fontSize="small" />
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

        {/* Mobile Collapsible Search */}
        {isMobile && searchOpen && (
          <Box sx={{ px: 2, pb: 1, backgroundColor: theme.palette.primary.main }}>
            <InputBase
              placeholder="Search..."
              fullWidth
              sx={{
                bgcolor: "#ffffff",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: 14,
              }}
            />
          </Box>
        )}
      </AppBar>

      {/* Tab Bar */}
      <Box
        sx={{
          position: "fixed",
          top: 48,
          left: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          display: "flex",
          alignItems: "center",
          height: 44,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 1,
          zIndex: 1200,
          transition: "left 0.3s ease, width 0.3s ease",
        }}
      >
        {showLeft && (
          <IconButton size="small" onClick={() => (scrollRef.current.scrollLeft -= 150)}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          onScroll={updateScrollArrows}
          sx={{
            overflowX: "auto",
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.75,
            minHeight: 44,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {renderedTabs.map((tab) => (
            <Paper
              key={tab}
              elevation={0}
              sx={{
                px: 1.5,
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
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => openTab(tab)}
            >
              <Typography
                variant="body2"
                sx={{ whiteSpace: "nowrap", pl: 1, pr: tab !== "Dashboard" ? 0.5 : 1.25 }}
              >
                {tab}
              </Typography>
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
            </Paper>
          ))}
        </Box>

        {showRight && (
          <IconButton size="small" onClick={() => (scrollRef.current.scrollLeft += 150)}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </>
  );
};

export default TopNavbarTabbedView;
