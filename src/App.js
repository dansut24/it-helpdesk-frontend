// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProviderCustom, useThemeMode } from "./context/ThemeContext";

import TabbedView from "./components/TabbedView";
import Login from "./pages/Login";
import RoleSelector from "./pages/RoleSelector";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import ItsmLanding from "./pages/ItsmLanding";
import SignupPage from "./pages/SignupPage";
import SetupWizard from "./pages/SetupWizard";
import DemoPage from "./pages/DemoPage";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";

const AppContent = () => {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const [tabs, setTabs] = useState(() => JSON.parse(sessionStorage.getItem("openTabs")) || ["Dashboard"]);
  const [selectedTab, setSelectedTab] = useState(() => sessionStorage.getItem("selectedTab") || "Dashboard");
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem("role") || "");
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");

  const isTenant = window.location.hostname.includes("-itsm.");
  const location = useLocation();

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

  const routes = isTenant ? (
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
      <Route path="/setup" element={<SetupWizard />} />
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/itsm" element={<ItsmLanding />} />
      <Route path="/services/itsm/signup" element={<SignupPage />} />
      <Route path="/services/itsm/demo" element={<DemoPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/demo" element={<DemoPage />} />
    </>
  );

  return (
    <>
      <Routes>{routes}</Routes>
      {!isTenant && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <ThemeProviderCustom>
      <AppWithTheme />
    </ThemeProviderCustom>
  );
};

const AppWithTheme = () => {
  const { muiTheme } = useThemeMode();

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
