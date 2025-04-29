import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Toolbar, Popover, Paper, Typography, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
import SearchResults from "../components/SearchResults";
import AdminSettings from "../pages/AdminSettings";
import Tasks from "../pages/Tasks";
import TaskDetails from "../pages/TaskDetails";
import TopNavbarTabbedView from "../components/TopNavbarTabbedView";
import Sidebar from "../components/Sidebar";

const TabbedView = ({ tabs, setTabs, selectedTab, setSelectedTab, allowedTabs }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarWidth = sidebarOpen ? 240 : 60;

  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [confirmCloseAllOpen, setConfirmCloseAllOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [tabHistory, setTabHistory] = useState([]);
  const [kbArticles, setKbArticles] = useState([]);
  const [kbModalOpen, setKbModalOpen] = useState(false);
  const [selectedKbArticle, setSelectedKbArticle] = useState(null);
  const [searchResults, setSearchResults] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [changes, setChanges] = useState([]);
  const [socket, setSocket] = useState(null);

  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

  const openTab = (tab) => {
    if (selectedTab && selectedTab !== tab) {
      setTabHistory((prev) => [...prev, selectedTab]);
    }
    if (!tabs.includes(tab)) {
      setTabs([...tabs, tab]);
    }
    setSelectedTab(tab);
  };

  const closeTab = (tab) => {
    if (tab === "Dashboard") return;
    const newTabs = tabs.filter((t) => t !== tab);
    setTabs(newTabs);
    if (selectedTab === tab) {
      setSelectedTab(newTabs[0] || "Dashboard");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
  };

  const handleSwitchRole = () => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const roles = userData?.roles || [];
    if (roles.length > 1) {
      sessionStorage.removeItem("selectedRole");
      navigate("/select-role", { state: { roles, user: userData } });
    } else {
      alert("Only one role assigned to this account.");
    }
  };

  const goBack = () => {
    if (tabHistory.length > 0) {
      const lastTab = tabHistory[tabHistory.length - 1];
      const newTabs = tabs.filter((t) => t !== selectedTab);
      setTabs(newTabs);
      setSelectedTab(lastTab);
      setTabHistory(tabHistory.slice(0, -1));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [incidentsRes, requestsRes, changesRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/incidents`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/service-requests`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/changes`, { headers }),
        ]);
        setIncidents(await incidentsRes.json());
        setRequests(await requestsRes.json());
        setChanges(await changesRes.json());
      } catch (err) {
        console.error("Error fetching data", err);
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
        console.error("Failed to fetch KB articles", err);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user?.id || !token) return;
    const newSocket = io("http://localhost:5000", { auth: { token } });
    newSocket.emit("join", user.id);
    newSocket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const renderContent = () => {
    if (typeof selectedTab !== "string") return null;
    switch (true) {
      case selectedTab === "Dashboard":
        return <Dashboard openTab={openTab} />;
      case selectedTab === "Incidents":
        return <Incidents openTab={openTab} />;
      case selectedTab === "Service Requests":
        return <ServiceRequests openTab={openTab} />;
      case selectedTab === "Profile":
        return <Profile />;
      case selectedTab === "Changes":
        return <Changes openTab={openTab} />;
      case selectedTab === "Tasks":
        return <Tasks openTab={openTab} />;
      case selectedTab.startsWith("Incident"):
        return <IncidentDetails referenceNumber={selectedTab.split(" ")[1]} />;
      case selectedTab.startsWith("Service Request"):
        return <ServiceRequestDetails id={selectedTab.split(" ")[2]} />;
      case selectedTab.startsWith("Change"):
        return <ChangeDetails id={selectedTab.split(" ")[1]} />;
      case selectedTab.startsWith("Task"):
        return <TaskDetails id={selectedTab.split(" ")[1]} openTab={openTab} />;
      case selectedTab === "Admin Settings":
        return <AdminSettings />;
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarWidth={sidebarWidth}
          selectedTab={selectedTab}
          openTab={openTab}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        <Box sx={{ flexGrow: 1, marginLeft: { xs: 0, sm: `${sidebarWidth}px` }, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', transition: 'margin-left 0.3s ease, width 0.3s ease' }}>
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
          <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: theme.palette.background.default }}>
            <Toolbar />
            <Box sx={{ p: { xs: 0, sm: 3 }, paddingBottom: '80px' }}>
              {renderContent()}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TabbedView;
