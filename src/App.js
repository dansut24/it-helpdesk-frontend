// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TabbedView from "./components/TabbedView";
import Login from "./pages/Login";
import RoleSelector from "./pages/RoleSelector";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import ItsmLanding from "./pages/ItsmLanding";
import Signup from "./pages/Signup";

const theme = createTheme();

const AppContent = () => {
  const { user, logout } = useAuth();
  const [tabs, setTabs] = useState(() => JSON.parse(sessionStorage.getItem("openTabs")) || ["Dashboard"]);
  const [selectedTab, setSelectedTab] = useState(() => sessionStorage.getItem("selectedTab") || "Dashboard");
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem("role") || "");
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");

  const isTenant = window.location.hostname.includes("-itsm.");

  useEffect(() => {
    sessionStorage.setItem("openTabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    sessionStorage.setItem("selectedTab", selectedTab);
  }, [selectedTab]);

  const allowedTabs = [
    "Dashboard",
    "Incidents",
    "Service Requests",
    ...(user?.role?.toLowerCase() !== "selfservice" ? ["Changes", "Tasks"] : []),
    "Profile",
    ...(user?.role?.toLowerCase() === "admin" ? ["Admin Settings"] : []),
    ...(["user", "selfservice"].includes(user?.role?.toLowerCase()) ? ["Knowledge Base"] : []),
  ];

  const openTab = (tab) => {
    if (!tabs.includes(tab)) {
      setTabs([...tabs, tab]);
    }
    setSelectedTab(tab);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    logout();
    setUserRole(null);
    setToken(null);
    window.location.reload();
  };

  return (
    <Router>
      <Routes>
        {isTenant ? (
          <>
            <Route
              path="/login"
              element={
                <Login
                  setUserRole={(role) => {
                    setUserRole(role);
                    sessionStorage.setItem("role", role);
                  }}
                  setToken={(t) => {
                    setToken(t);
                    sessionStorage.setItem("token", t);
                  }}
                />
              }
            />
            <Route
              path="/*"
              element={
                token ? (
                  <TabbedView
                    tabs={tabs}
                    setTabs={setTabs}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    openTab={openTab}
                    allowedTabs={allowedTabs}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/itsm" element={<ItsmLanding />} />
            <Route path="/services/itsm/signup" element={<Signup />} />
            <Route path="/services/itsm/demo" element={<Navigate to="https://demo-itsm.hi5tech.co.uk" replace />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
