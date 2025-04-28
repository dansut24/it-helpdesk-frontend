import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from "@mui/icons-material/Menu"; // ✅ (new for mobile hamburger icon)
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/List";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import {
  Avatar, Drawer, List, ListItem, ListItemText, Divider, Typography,
  IconButton, Box, Paper, BottomNavigation, BottomNavigationAction,
  Menu, MenuItem, Tooltip, TextField, InputAdornment, Button, Select, Popper, Fade, Paper as MuiPaper,
  useMediaQuery
} from "@mui/material"; // ✅ add useMediaQuery
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import BuildIcon from "@mui/icons-material/Build";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { Modal } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "../pages/Dashboard";
import Incidents from "../pages/Incidents";
import ServiceRequests from "../pages/ServiceRequests";
import Profile from "../pages/Profile";
import RaiseIncidentForm from "../pages/RaiseIncidentForm";
import IncidentDetails from "../pages/IncidentDetails";
import ServiceRequestDetails from "../pages/ServiceRequestDetails";
import RaiseServiceRequestForm from "../components/RaiseServiceRequestForm";
import Changes from "../pages/Changes";
import RaiseChangeForm from "../pages/RaiseChangeForm";
import ChangeDetails from "../pages/ChangeDetails";
import { fetchKbArticles } from "../api";
import SearchResults from "../components/SearchResults"; // adjust path if needed
import AdminSettings from "../pages/AdminSettings";
import Tasks from "../pages/Tasks"; // Adjust path if needed
import TaskDetails from "../pages/TaskDetails";
import TopNavbarTabbedView from "../components/TopNavbarTabbedView"; // adjust path if needed



// Due to length, this will be posted in multiple parts

const TabbedView = ({ tabs, setTabs, selectedTab, setSelectedTab, allowedTabs }) => {
  const [moreAnchor, setMoreAnchor] = useState(null);
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [changes, setChanges] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const navigate = useNavigate();
  const [confirmCloseAllOpen, setConfirmCloseAllOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 60;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ✅ detects mobile
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // ✅ tracks mobile sidebar
  
  const navItemStyles = (active, open) => ({
  borderRadius: 2,
  mb: 1,
  px: open ? 2 : 1,
  justifyContent: open ? 'flex-start' : 'center',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  bgcolor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': { bgcolor: theme.palette.action.hover },
});

const navIconStyles = (open) => ({
  mr: open ? 1.5 : 0,
  fontSize: '1.25rem',
});

// HoverMenuItem component
const HoverMenuItem = ({ icon, label, active, open, subItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const timeoutRef = React.useRef();

  const handleEnter = (event) => {
    clearTimeout(timeoutRef.current);
    setAnchorEl(event.currentTarget);
    setMenuVisible(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuVisible(false);
    }, 300);
  };

  return (
    <>
      <ListItem
        button
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        sx={navItemStyles(active, open)}
      >
        {React.cloneElement(icon, { sx: navIconStyles(open) })}
        {open && <ListItemText primary={label} />}
      </ListItem>

      {open && (
        <Popper
          open={menuVisible}
          anchorEl={anchorEl}
          placement="right-start"
          transition
          disablePortal
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleLeave}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <MuiPaper sx={{ p: 1, minWidth: 200, boxShadow: 3 }}>
                {subItems.map((item) => (
                  <MenuItem key={item.label} onClick={item.onClick}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.icon}
                      <Typography variant="body2">{item.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </MuiPaper>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
};
  
  useEffect(() => {
    console.log("📦 selectedRole in sessionStorage:", sessionStorage.getItem("selectedRole"));
  }, []);



    const wasSearching = localStorage.getItem("searchTriggered") === "true";
  
  
    if (wasSearching) {
      setSearchTriggered(true);
    }
  
    const fetchData = async () => {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  
      if (!token) {
        console.error("❌ No token found. Cannot fetch secured data.");
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
  
      try {
        const [incidentsRes, requestsRes, changesRes] = await Promise.all([
          fetch("${process.env.REACT_APP_API_URL}/api/incidents", { headers }),
          fetch("${process.env.REACT_APP_API_URL}/api/service-requests", { headers }),
          fetch("${process.env.REACT_APP_API_URL}/api/changes", { headers }),
        ]);
  
        if (!incidentsRes.ok || !requestsRes.ok || !changesRes.ok) {
          throw new Error("❌ Failed to fetch one or more API responses.");
        }
  
        const incidentsData = await incidentsRes.json();
        const requestsData = await requestsRes.json();
        const changesData = await changesRes.json();
  
        setIncidents(Array.isArray(incidentsData) ? incidentsData : incidentsData.incidents || []);
        setRequests(requestsData);
        setChanges(changesData);
      } catch (err) {
        console.error("❌ Failed to fetch data for global search.", err);
      }
    };
  
    fetchData();
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articles = await fetchKbArticles();
        setKbArticles(articles);
      } catch (err) {
        console.error("❌ Failed to fetch KB articles:", err);
      }
    };
  
    fetchArticles();
  }, []);
  

  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const [socket, setSocket] = useState(null);

  
  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("${process.env.REACT_APP_API_URL}/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : data.notifications || []);
    } catch (err) {
      console.error("❌ Failed to fetch notifications", err);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  
    if (!user?.id || !token) return;
  
    const newSocket = io("http://localhost:5000", {
      auth: {
        token,
      },
    });
  
    newSocket.emit("join", user.id); // ✅ Join the user's private room
  
    newSocket.on("new_notification", (notification) => {
      console.log("📥 New live notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  const openTab = (tab) => {
    if (selectedTab && selectedTab !== tab) {
      setTabHistory((prev) => [...prev, selectedTab]);
    }
    if (!tabs.includes(tab)) {
      setTabs([...tabs, tab]);
    }
    setSelectedTab(tab);
    setMoreAnchor(null);
  };
  
  

  const closeTab = (tab) => {
    if (tab === "Dashboard") return;
    const newTabs = tabs.filter((t) => t !== tab);
    setTabs(newTabs);
    localStorage.setItem("openTabs", JSON.stringify(newTabs));

    if (selectedTab === tab) {
      const newSelectedTab = newTabs[0] || "Dashboard";
      setSelectedTab(newSelectedTab);
      localStorage.setItem("selectedTab", newSelectedTab);
    }
  };

  const handleMoreClick = (e) => setMoreAnchor(e.currentTarget);
  const handleMoreClose = () => setMoreAnchor(null);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("searchTriggered");
    localStorage.removeItem("lastSearchQuery");
    localStorage.clear();
    window.location.reload();
  };

  const handleSwitchRole = () => {
    const userData = JSON.parse(sessionStorage.getItem("user")); // assuming user data is stored
    const roles = userData?.roles || [];
  
    if (roles.length > 1) {
      sessionStorage.removeItem("selectedRole");
      navigate("/select-role", { state: { roles, user: userData } });
    } else {
      alert("Only one role assigned to this account.");
    }
  };
  
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const activeRole = sessionStorage.getItem("selectedRole") || storedUser?.role?.toLowerCase() || "Unknown";


  const [searchResults, setSearchResults] = useState({});

  const [kbArticles, setKbArticles] = useState([]);
  const [kbModalOpen, setKbModalOpen] = useState(false);
  const [selectedKbArticle, setSelectedKbArticle] = useState(null);

  const filteredResults = {
    incidents: incidents.filter((i) =>
      i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.referenceNumber?.toString().toLowerCase().includes(searchQuery.toLowerCase()) // ✅ ensure string
    ),
    requests: requests.filter((r) =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    changes: changes.filter((c) =>
      c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    kb: kbArticles.filter((k) =>
      k.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const clearTabHistory = () => {
    setTabHistory([]);
  };
  
  const [tabHistory, setTabHistory] = useState([]);

  const goBack = () => {
    if (tabHistory.length > 0) {
      const lastTab = tabHistory[tabHistory.length - 1];
  
      // Remove current tab
      const newTabs = tabs.filter((t) => t !== selectedTab);
      setTabs(newTabs);
      localStorage.setItem("openTabs", JSON.stringify(newTabs));
  
      // Navigate back
      setSelectedTab(lastTab);
      localStorage.setItem("selectedTab", lastTab);
      setTabHistory(tabHistory.slice(0, -1));
    }
  };

  const handleMobileMenu = (event, type) => {
    const options = {
      "Incidents": ["Incidents", "New Incident"],
      "Service Requests": ["Service Requests", "Raise Service Request"],
      "Changes": ["Changes", "New Change"]
    };
  
    const menuItems = options[type] || [];
  
    setMoreAnchor({
      ...event,
      menuItems,
    });
  };


  const renderSearchResults = (isMobileView = false) => (
    <Box sx={{ px: isMobileView ? 0 : 2, pt: 1 }}>
      {Object.entries(filteredResults).map(([key, items]) => (
        <React.Fragment key={key}>
          {items.length > 0 && (
            <>
              <Typography variant="caption" sx={{ pl: 2 }} color={isMobileView ? "black" : "white"}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              {items.map((item) => {
  if (key === "kb") {
    return (
      <ListItem
        key={item.id}
        button
        onClick={() => {
          setSelectedKbArticle(item);
          setKbModalOpen(true);
        }}
        sx={{ color: isMobileView ? "black" : "white", pl: 2 }}
      >
        <ListItemText primary={item.title} />
      </ListItem>
    );
  }

  const tabLabel =
    key === "incidents"
      ? `Incident ${item.id}`
      : key === "requests"
      ? `Service Request ${item.id}`
      : key === "changes"
      ? `Change ${item.id}`
      : `Unknown`;

  return (
    <ListItem
      key={item.id}
      button
      onClick={() => {
        openTab(tabLabel);
      }}
      sx={{ color: isMobileView ? "black" : "white", pl: 2 }}
    >
      <ListItemText primary={item.title} />
    </ListItem>
  );
})}

            </>
          )}
        </React.Fragment>
      ))}

      {Object.values(filteredResults).every((arr) => arr.length === 0) && (
        <Typography variant="body2" sx={{ px: 2 }} color={isMobileView ? "black" : "white"}>
          No results found.
        </Typography>
      )}
    </Box>
  );

  const renderContent = () => {
    if (typeof selectedTab !== "string") return null;
  
    if (selectedTab === "Dashboard") return <Dashboard openTab={openTab} />;
    if (selectedTab === "Incidents") return <Incidents openTab={openTab} />;
    if (selectedTab === "Service Requests") return <ServiceRequests openTab={openTab} />;
    if (selectedTab === "Profile") return <Profile />;
    if (selectedTab === "Changes") return <Changes openTab={openTab} />;
    if (selectedTab === "Tasks") return <Tasks openTab={openTab} />;

  
    if (selectedTab === "Search results") {
      const previousTab = tabs.find(tab => tab !== "Search results" && tab !== selectedTab);
      return (
        <SearchResults
          query={searchQuery}
          results={filteredResults} // ✅ This must contain the incidents array
          openTab={openTab}
          previousTab={previousTab}
        />
      );
    }
    
    
    
    if (selectedTab === "Admin Settings" && allowedTabs.includes("Admin Settings")) {
      return <AdminSettings />;
    }    
    
  
    if (selectedTab === "New Incident") {
      return (
        <RaiseIncidentForm
          renameTabAfterSubmit={(oldTab, newRef) => {
            const updatedTabs = tabs.map((t) => (t === oldTab ? `Incident ${newRef}` : t));
            setTabs(updatedTabs);
            setSelectedTab(`Incident ${newRef}`);
          }}
        />
      );
    }
  
    if (selectedTab === "Raise Service Request") {
      return (
        <RaiseServiceRequestForm
          renameTabAfterSubmit={(oldTab, newId) => {
            const newTabName = `Service Request ${newId}`;
            const updatedTabs = tabs.map((t) => (t === oldTab ? newTabName : t));
            setTabs(updatedTabs);
            setSelectedTab(newTabName);
          }}
        />
      );
    }
  
    if (selectedTab === "New Change") {
      return (
        <RaiseChangeForm
          renameTabAfterSubmit={(oldTab, newId) => {
            const updatedTabs = tabs.map((t) => (t === oldTab ? `Change ${newId}` : t));
            setTabs(updatedTabs);
            setSelectedTab(`Change ${newId}`);
          }}
        />
      );
    }
  
    if (selectedTab.startsWith("Incident")) {
      const ref = selectedTab.split(" ")[1];
      const fromSearch = tabs.includes("Search results");
      return (
        <IncidentDetails
          referenceNumber={ref}
          fromSearch={fromSearch}
          openTab={openTab}
        />
      );
    }    
  
    if (selectedTab.startsWith("Service Request")) {
      const id = selectedTab.split(" ")[2];
      return <ServiceRequestDetails id={id} />;
    }
  
    if (selectedTab.startsWith("Change")) {
      const id = selectedTab.split(" ")[1];
      return <ChangeDetails id={id} />;
    }

    if (selectedTab.startsWith("Task")) {
      const id = selectedTab.split(" ")[1];
      return <TaskDetails id={id} openTab={openTab} />;
    }
    
    
    
  
    if (selectedTab.startsWith("KB")) {
      const id = selectedTab.split(" ")[1];
      const article = kbArticles.find((a) => a.id === id);
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">{article?.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Category: {article?.category}
          </Typography>
          <Typography>{article?.content}</Typography>
        </Box>
      );
    }

    if (selectedTab === "Knowledge Base") {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Knowledge Base</Typography>
          {kbArticles.map((article) => (
            <Paper
              key={article.id}
              sx={{ p: 2, mb: 2, cursor: "pointer" }}
              onClick={() => {
                setSelectedKbArticle(article);
                setKbModalOpen(true);
              }}
            >
              <Typography variant="h6">{article.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {article.category}
              </Typography>
            </Paper>
          ))}
        </Box>
      );
    }
  
  
    return null;
  };  

return (
  <>
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}
        >
          <List>
            <Divider textAlign="left" sx={{ width: '100%', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                MAIN
              </Typography>
            </Divider>

            <ListItem
              button
              selected={selectedTab === "Dashboard"}
              onClick={() => {
                openTab("Dashboard");
                setMobileSidebarOpen(false);
              }}
            >
              <HomeIcon sx={{ mr: 1 }} />
              <ListItemText primary="Dashboard" />
            </ListItem>

            <HoverMenuItem
              icon={<FolderIcon />}
              label="Incidents"
              active={selectedTab.includes("Incident")}
              open={true}
              subItems={[
                { label: "View Incidents", onClick: () => { openTab("Incidents"); setMobileSidebarOpen(false); } },
                { label: "New Incident", onClick: () => { openTab("New Incident"); setMobileSidebarOpen(false); } },
              ]}
            />

            <HoverMenuItem
              icon={<BuildIcon />}
              label="Service Requests"
              active={selectedTab.includes("Service Request")}
              open={true}
              subItems={[
                { label: "View Requests", onClick: () => { openTab("Service Requests"); setMobileSidebarOpen(false); } },
                { label: "Raise Request", onClick: () => { openTab("Raise Service Request"); setMobileSidebarOpen(false); } },
              ]}
            />

            <HoverMenuItem
              icon={<MoreVertIcon />}
              label="Changes"
              active={selectedTab.includes("Change")}
              open={true}
              subItems={[
                { label: "Change Log", onClick: () => { openTab("Changes"); setMobileSidebarOpen(false); } },
                { label: "New Change", onClick: () => { openTab("New Change"); setMobileSidebarOpen(false); } },
              ]}
            />

            <Divider textAlign="left" sx={{ width: '100%', mt: 2, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                ADMIN
              </Typography>
            </Divider>

            <ListItem
              button
              selected={selectedTab === "Admin Settings"}
              onClick={() => {
                openTab("Admin Settings");
                setMobileSidebarOpen(false);
              }}
            >
              <SettingsIcon sx={{ mr: 1 }} />
              <ListItemText primary="Admin Settings" />
            </ListItem>

            <Divider sx={{ width: '100%', mt: 2 }} />

            <ListItem
              button
              selected={selectedTab === "Profile"}
              onClick={() => {
                openTab("Profile");
                setMobileSidebarOpen(false);
              }}
            >
              <AccountCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </Drawer>
      ) : (
        <Box
          sx={{
            width: sidebarWidth,
            height: '100vh',
            bgcolor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: 'width 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: sidebarOpen ? 'flex-start' : 'center',
            py: 2,
            px: sidebarOpen ? 2 : 0,
            boxShadow: theme.shadows[1],
            position: 'fixed',
            zIndex: 1200,
            overflowY: 'auto', // Sidebar scrolls if tall
          }}
        >
          {/* Collapse/Expand Arrow */}
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              position: 'absolute',
              top: 16,
              right: sidebarOpen ? -16 : -8,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              zIndex: 1301,
            }}
            size="small"
          >
            {sidebarOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
          </IconButton>

          <List sx={{ width: '100%' }}>
            <Divider textAlign="left" sx={{ width: '100%', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                MAIN
              </Typography>
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

            <HoverMenuItem
              icon={<BuildIcon />}
              label="Service Requests"
              active={selectedTab.includes("Service Request")}
              open={sidebarOpen}
              subItems={[
                { label: "View Requests", onClick: () => openTab("Service Requests") },
                { label: "Raise Request", onClick: () => openTab("Raise Service Request") },
              ]}
            />

            <HoverMenuItem
              icon={<MoreVertIcon />}
              label="Changes"
              active={selectedTab.includes("Change")}
              open={sidebarOpen}
              subItems={[
                { label: "Change Log", onClick: () => openTab("Changes") },
                { label: "New Change", onClick: () => openTab("New Change") },
              ]}
            />

            <Divider textAlign="left" sx={{ width: '100%', mt: 2, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                ADMIN
              </Typography>
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

            <Divider sx={{ width: '100%', mt: 2 }} />

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
      )}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, sm: `${sidebarWidth}px` },
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          transition: 'margin-left 0.3s ease, width 0.3s ease',
        }}
      >
        {/* Top Navbar */}
        <TopNavbarTabbedView
          tabs={tabs}
          setTabs={setTabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          storedUser={storedUser}
          handleLogout={handleLogout}
          handleSwitchRole={handleSwitchRole}
          goBack={goBack}
          tabHistory={tabHistory}
          sidebarWidth={sidebarWidth}
          toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          isMobile={isMobile}
        />

        {/* Scrollable Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            bgcolor: theme.palette.background.default,
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>

{/* ✅ KB Article Modal goes here */}
<Modal open={kbModalOpen} onClose={() => setKbModalOpen(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: 600,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    {selectedKbArticle && (
      <>
        <Typography variant="h5">{selectedKbArticle.title}</Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Category: {selectedKbArticle.category}
        </Typography>
        <Typography>{selectedKbArticle.content}</Typography>
      </>
    )}
  </Box>
</Modal>


{/* ✅ Logout Confirmation Modal */}
<Modal
  open={showLogoutConfirm}
  onClose={() => setShowLogoutConfirm(false)}
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 300,
      bgcolor: 'background.paper',
      boxShadow: 24,
      borderRadius: 2,
      p: 4,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Confirm Logout
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Are you sure you want to log out?
    </Typography>
    <Box display="flex" justifyContent="flex-end" gap={1}>
      <Button variant="outlined" onClick={() => setShowLogoutConfirm(false)}>
        Cancel
      </Button>
      <Button variant="contained" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  </Box>
</Modal>

<Popover
  open={Boolean(notificationAnchorEl)}
  anchorEl={notificationAnchorEl}
  onClose={() => setNotificationAnchorEl(null)}
  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  transformOrigin={{ vertical: "top", horizontal: "left" }}
>
  <Box sx={{ p: 2, minWidth: 320 }}>
    <Typography variant="h6" gutterBottom>
      Notifications
    </Typography>

    {notifications.length === 0 ? (
      <Typography variant="body2">No notifications.</Typography>
    ) : (
      notifications.map((note) => (
        <Paper
          key={note.id}
          sx={{
            p: 1,
            mb: 1,
            bgcolor: note.is_read ? "grey.100" : "#fff8e1",
            opacity: note.is_read ? 0.7 : 1,
          }}
        >
          <Typography variant="body2">{note.message}</Typography>

          <Box mt={1} display="flex" gap={1}>
            {note.link && (
              <Button
                size="small"
                onClick={async () => {
                  try {
                    await axios.put(
                      `${process.env.REACT_APP_API_URL}/api/notifications/${note.id}/read`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                      }
                    );

                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === note.id ? { ...n, is_read: 1 } : n
                      )
                    );

                    openTab(note.link);
                    setNotificationAnchorEl(null);
                  } catch (err) {
                    console.error("❌ Failed to mark as read:", err);
                  }
                }}
              >
                View
              </Button>
            )}

            {!note.is_read && (
              <Button
                size="small"
                onClick={async () => {
                  try {
                    await axios.put(
                      `${process.env.REACT_APP_API_URL}/api/notifications/${note.id}/read`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                      }
                    );

                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === note.id ? { ...n, is_read: 1 } : n
                      )
                    );
                  } catch (err) {
                    console.error("❌ Failed to mark as read:", err);
                  }
                }}
              >
                Mark as Read
              </Button>
            )}
          </Box>
        </Paper>
      ))
    )}

    {notifications.length > 0 && (
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          size="small"
          onClick={async () => {
            try {
              await axios.put(
                "${process.env.REACT_APP_API_URL}/api/notifications/mark-all-read",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                  },
                }
              );

              setNotifications((prev) =>
                Array.isArray(prev)
                  ? prev.map((n) => ({ ...n, is_read: 1 }))
                  : []
              );
            } catch (err) {
              console.error("❌ Failed to mark all as read:", err);
            }
          }}
        >
          Mark all as read
        </Button>
      </Box>
    )}
  </Box>
</Popover>
</> 
  );
};

export default TabbedView;
