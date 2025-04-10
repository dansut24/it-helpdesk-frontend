import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import {
  Avatar, Drawer, List, ListItem, ListItemText, Divider, Typography,
  IconButton, Box, Paper, BottomNavigation, BottomNavigationAction,
  Menu, MenuItem, Tooltip, TextField, InputAdornment, Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import BuildIcon from "@mui/icons-material/Build";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";
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

// Due to length, this will be posted in multiple parts

const TabbedView = ({ tabs, setTabs, selectedTab, setSelectedTab, allowedTabs }) => {
  
const [moreAnchor, setMoreAnchor] = useState(null);
  
const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSwitchRole = () => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    const roles = userData?.roles || [];

    if (roles.length > 1) {
      sessionStorage.removeItem("selectedRole");
      navigate("/select-role", { state: { roles, user: userData } });
    } else {
      alert("Only one role assigned to this account.");
    }
  };

const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [changes, setChanges] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const navigate = useNavigate();
    useEffect(() => {
    console.log("📦 selectedRole in sessionStorage:", sessionStorage.getItem("selectedRole"));
  }, []);

  
  useEffect(() => {
    const savedQuery = localStorage.getItem("lastSearchQuery");
if (savedQuery) {
  setSearchQuery(savedQuery);
  setLastSearchQuery(savedQuery);
}


    const wasSearching = localStorage.getItem("searchTriggered") === "true";
  
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  
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
          fetch(`${process.env.REACT_APP_API_URL}/api/incidents`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/service-requests`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/changes`, { headers }),
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
  }, []);
  
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications`, {
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

  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}") || {};
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
      "Changes": ["Changes", "New Change"],
      "More": ["Profile", "Logout"]
    };

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
          setShowSearch(false);
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
        setSearchQuery("");
        setShowSearch(false);
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
      {!isMobile && (
        <Drawer
          anchor="left"
          open
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
  width: 250,
  bgcolor: "#1976d2",
  color: "white",
  display: "flex",
  flexDirection: "column",
  fontSize: "0.85rem",             // ⬅️ smaller font size
  "& .MuiListItem-root": {
    py: 0.5,                        // ⬅️ tighter vertical padding
    minHeight: "36px",             // ⬅️ compact height
  },
  "& .MuiListItemText-primary": {
    fontSize: "0.90rem",           // ⬅️ shrink text
  },

},
          }}
        >
          <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 2,
    py: 2,
    bgcolor: "#0056b3",
  }}
>
  <Typography variant="h6" sx={{ color: "white" }}>
    IT Helpdesk
  </Typography>

  <Tooltip title="Notifications">
    <IconButton onClick={(e) => setNotificationAnchorEl(e.currentTarget)} sx={{ color: "white" }}>
        <Badge
      badgeContent={
        Array.isArray(notifications)
          ? notifications.filter((n) => !n.is_read).length  // ✅ use is_read not read
          : 0
    }
        color="error"
      >
        <NotificationsIcon />
      </Badge>
    </IconButton>
  </Tooltip>
</Box>



          <Box sx={{ px: 2, pt: 2 }}>
            <TextField
              fullWidth
              placeholder="Search everything..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
              
                if (value) {
                  setLastSearchQuery(value);
                  localStorage.setItem("lastSearchQuery", value);
              
                  if (selectedTab !== "Search results") {
                    setSearchTriggered(true);
                    localStorage.setItem("searchTriggered", "true");
                    openTab("Search results");
                  }
                }
              
                // ❌ Remove this — don't reset the trigger when clearing text
                // if (!value) {
                //   setSearchTriggered(false);
                //   localStorage.removeItem("searchTriggered");
                // }
              }}
              
              
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {searchQuery && !searchTriggered && renderSearchResults(false)}



          <Divider sx={{ bgcolor: "white", mt: 2 }} />
          <List>
  {allowedTabs.map((navItem) => {
    const showPlus = ["Incidents", "Service Requests", "Changes"].includes(navItem);
    const plusTab = navItem === "Incidents"
      ? "New Incident"
      : navItem === "Service Requests"
      ? "Raise Service Request"
      : navItem === "Changes"
      ? "New Change"
      : null;

    return (
      <ListItem key={navItem} sx={{ pl: 2, pr: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box
            onClick={() => openTab(navItem)}
            sx={{ cursor: "pointer", flexGrow: 1 }}
          >
            <ListItemText primary={navItem} />
          </Box>

          {showPlus && (
            <Tooltip title={`Raise ${navItem.slice(0, -1)}`}>
              <IconButton
                size="small"
                sx={{ color: "white", ml: 1 }}
                onClick={() => openTab(plusTab)}
              >
                <Typography fontWeight="bold">+</Typography>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </ListItem>
    );
  })}
</List>


          <Divider sx={{ bgcolor: "white" }} />
          <Box sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "calc(100vh - 340px)" }}>
  <List dense>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        py: 1,
      }}
    >
      <Typography sx={{ fontWeight: "bold" }}>Open Tabs</Typography>
      <IconButton
  size="small"
  sx={{ color: "white" }}
  onClick={() => {
    const dashboardOnly = tabs.includes("Dashboard") ? ["Dashboard"] : [];
    setTabs(dashboardOnly);
    setSelectedTab("Dashboard");
    localStorage.setItem("openTabs", JSON.stringify(dashboardOnly));
    localStorage.setItem("selectedTab", "Dashboard");
    clearTabHistory(); // ✅ Actually clears it now
  }}
>
  <CloseIcon fontSize="small" />
</IconButton>


    </Box>

    {tabs.map((tab) => (
      <ListItem
        key={tab}
        sx={{ display: "flex", justifyContent: "space-between" }}
        onClick={() => openTab(tab)}
        button
      >
        <ListItemText primary={tab} />
        {tab !== "Dashboard" && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab);
            }}
            sx={{ color: "white" }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </ListItem>
    ))}
  </List>
</Box>



          <Divider sx={{ bgcolor: "white" }} />
          <List>

          <ListItem>
  <Box display="flex" alignItems="center" gap={1} width="100%">
    <Avatar
      src={
        storedUser.avatar_url?.startsWith("http")
          ? storedUser.avatar_url
          : storedUser.avatar_url
          ? `http://localhost:5000${storedUser.avatar_url}`
          : ""
      }
      sx={{ width: 40, height: 40 }}
    >
      {storedUser?.username?.[0]?.toUpperCase() || "U"}
    </Avatar>

    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="body2" color="white">
        Logged in as: {storedUser.username || "User"}
        <IconButton
          onClick={handleLogout}
          size="small"
          sx={{ ml: 1, color: "white" }}
        >
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Typography>

      <Typography variant="body2" color="white">
        Current role: {activeRole}
        <IconButton
          onClick={handleSwitchRole}
          size="small"
          sx={{ ml: 1, color: "white" }}
        >
          <AccountCircleIcon fontSize="small" />
        </IconButton>
      </Typography>
    </Box>
  </Box>

</ListItem>

<ListItem>
  <Button
    variant="contained"
    fullWidth
    size="small"
    onClick={async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const token = sessionStorage.getItem("token");

        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/notifications`,
          {
            user_id: user.id,
            message: "🧪 Live test notification from UI",
            link: "Dashboard"
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Test notification sent.");
      } catch (err) {
        console.error("❌ Failed to send test notification:", err);
      }
    }}
  >
    Send Test Notification
  </Button>
</ListItem>

</List>


        </Drawer>
      )}

      {isMobile && (
        <>
          <Tooltip title="Search">
            <IconButton
              onClick={() => setShowSearch(true)}
              sx={{
                position: "fixed",
                top: 10,
                left: 10,
                zIndex: 1300,
                bgcolor: "white",
                boxShadow: 3,
              }}
            >
              <SearchIcon />
            </IconButton>

          </Tooltip>

          {showSearch && (
            <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bgcolor: "white",
              zIndex: 1400,
              p: 2,
              pt: 4, // ✅ Add extra top padding (or use safe area inset if desired)
              boxShadow: 3,
            }}
          >
              <TextField
                fullWidth
                placeholder="Search everything..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                
                  if (value) {
                    setLastSearchQuery(value);
                    localStorage.setItem("lastSearchQuery", value);
                
                    if (selectedTab !== "Search results") {
                      setSearchTriggered(true);
                      localStorage.setItem("searchTriggered", "true");
                      openTab("Search results");
                    }
                  }
                
                  // ❌ Do NOT reset searchTriggered here — we want to keep the last search even if input is cleared
                }}
                
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => { setShowSearch(false); setSearchQuery(""); }}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
             {searchQuery && !searchTriggered && (
              <Box sx={{ mt: 2, maxHeight: "60vh", overflowY: "auto" }}>
                {renderSearchResults(true)}
            </Box>
              )}

            </Box>
          )}

<Box
  sx={{
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100vw",
    zIndex: 1200,
    height: "80px",
    backgroundColor: "white",
    overflow: "hidden",
    paddingBottom: "env(safe-area-inset-bottom)",
  }}
>
  <BottomNavigation
    value={selectedTab}
    onChange={(event, newValue) => {
      if (newValue === "More") {
        setMoreAnchor(event.currentTarget);
      } else if (newValue === "Logout") {
        setShowLogoutConfirm(true);
      } else {
        openTab(newValue);
      }
    }}
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "space-around",
      maxWidth: "100vw",
      overflow: "hidden",
    }}
    showLabels
  >
    <BottomNavigationAction label="Dashboard" value="Dashboard" icon={<HomeIcon />} />
    <BottomNavigationAction label="Incidents" value="Incidents" icon={<FolderIcon />} />
    <BottomNavigationAction label="Requests" value="Service Requests" icon={<BuildIcon />} />
    <BottomNavigationAction label="Changes" value="Changes" icon={<BuildIcon />} />
<BottomNavigationAction label="More" value="More" icon={<MoreVertIcon />} />
</BottomNavigation>
</Box>


<Menu
  anchorEl={moreAnchor?.currentTarget || moreAnchor}
  open={Boolean(moreAnchor)}
  onClose={handleMoreClose}
  PaperProps={{
    sx: {
      minWidth: 200,
      borderRadius: 2,
      boxShadow: 5,
      p: 1,
      bgcolor: "background.paper",
    },
  }}
>
  <Typography variant="subtitle2" sx={{ px: 2, pt: 1, pb: 0.5, color: "text.secondary" }}>
    {moreAnchor?.menuItems ? "Select Option" : "Open Tabs"}
  </Typography>

  <Divider sx={{ mb: 1 }} />

  {moreAnchor?.menuItems ? (
    moreAnchor.menuItems.map((item) => (
      <MenuItem
        key={item}
        onClick={() => {
          if (item === "Logout") {
          setShowLogoutConfirm(true);
        } else {
          openTab(item);
        }
        handleMoreClose();
        }}
        sx={{
          "&:hover": {
            bgcolor: "primary.light",
            color: "white",
          },
          borderRadius: 1,
          mb: 0.5,
        }}
      >
        {item}
      </MenuItem>
    ))
  ) : (
    tabs.length > 0 ? (
      tabs.map((tab) => (
        <MenuItem
          key={tab}
          onClick={() => {
            openTab(tab);
            handleMoreClose();
          }}
          sx={{
            "&:hover": {
              bgcolor: "primary.light",
              color: "white",
            },
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          {tab}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Open Tabs</MenuItem>
    )
  )}
</Menu>



          {selectedTab !== "Dashboard" && (
            <Tooltip title="Close Tab">
              <IconButton
                onClick={() => closeTab(selectedTab)}
                sx={{
                  position: "fixed",
                  top: 10,
                  right: 10,
                  zIndex: 1300,
                  bgcolor: "white",
                  boxShadow: 3,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}

{!isMobile && tabHistory.length > 0 && (
  <Tooltip title="Go Back">
    <IconButton
      onClick={goBack}
      sx={{
        position: "fixed",
        top: 10,
        left: 260, // Just outside the sidebar
        zIndex: 1300,
        bgcolor: "white",
        boxShadow: 3,
      }}
    >
      <Typography variant="body2" fontWeight="bold">⬅</Typography>
    </IconButton>
  </Tooltip>
)}

{tabHistory.length > 0 && selectedTab !== "Dashboard" && (
  <Tooltip title="Go Back">
    <IconButton
      onClick={goBack}
      sx={{
        position: "fixed",
        top: 10,
        left: isMobile ? 60 : 260,
        zIndex: 1300,
        bgcolor: "white",
        boxShadow: 3,
      }}
    >
      <Typography variant="body2" fontWeight="bold">⬅</Typography>
    </IconButton>
  </Tooltip>
)}



<Box
  sx={{
    marginLeft: !isMobile ? "250px" : 0,
    marginTop: isMobile ? "56px" : 0,  // ✅ pushes content down
    padding: "24px",
    minHeight: "100vh",
    bgcolor: "#f4f4f4",
    overflowX: "hidden",
  }}
>
  {renderContent()}

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
                `${process.env.REACT_APP_API_URL}/api/notifications/mark-all-read`,
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