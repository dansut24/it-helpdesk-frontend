import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TabbedView from "./components/TabbedView";
import Login from "./pages/Login";
import RoleSelector from "./pages/RoleSelector";
import Signup from "./pages/Signup";

const theme = createTheme();

const AppContent = () => {
  const { user, logout } = useAuth();
  const [tabs, setTabs] = useState(() => {
    return JSON.parse(sessionStorage.getItem("openTabs")) || ["Dashboard"];
  });
  const [selectedTab, setSelectedTab] = useState(() => {
    return sessionStorage.getItem("selectedTab") || "Dashboard";
  });
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem("role") || "");
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");

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
  <Route path="/signup" element={<Signup />} />
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
        <Route path="/select-role" element={<RoleSelector setUserRole={setUserRole} />} />
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
            )
          }
        />
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
