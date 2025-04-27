// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

const defaultThemes = {
  light: {
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      background: { default: "#f5f5f5", paper: "#ffffff" },
    },
  },
  dark: {
    palette: {
      mode: "dark",
      primary: { main: "#90caf9" },
      background: { default: "#121212", paper: "#1e1e1e" },
    },
  },
  ocean: {
    palette: {
      mode: "light",
      primary: { main: "#00bcd4" },
      background: { default: "#e0f7fa", paper: "#ffffff" },
    },
  },
  sunset: {
    palette: {
      mode: "light",
      primary: { main: "#ff7043" },
      background: { default: "#fff3e0", paper: "#ffffff" },
    },
  },
  forest: {
    palette: {
      mode: "light",
      primary: { main: "#4caf50" },
      background: { default: "#e8f5e9", paper: "#ffffff" },
    },
  },
};

export const ThemeProviderCustom = ({ children }) => {
  const getInitialTheme = () => localStorage.getItem("themeMode") || "system";
  const [mode, setMode] = useState(getInitialTheme);
  const [customTheme, setCustomTheme] = useState(() => {
    const stored = localStorage.getItem("customTheme");
    return stored ? JSON.parse(stored) : null;
  });

  const resolvedMode = useMemo(() => {
    if (mode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return mode === "custom" ? "custom" : mode;
  }, [mode]);

  const muiTheme = useMemo(() => {
    if (resolvedMode === "custom" && customTheme) {
      return createTheme({
        palette: {
          mode: "light",
          primary: { main: customTheme.primary || "#1976d2" },
          background: {
            default: customTheme.background || "#ffffff",
            paper: customTheme.paper || "#f7f7f7",
          },
        },
      });
    }

    const themeConfig = defaultThemes[resolvedMode] || defaultThemes.light;
    return createTheme(themeConfig);
  }, [resolvedMode, customTheme]);

  useEffect(() => {
    if (mode === "system") {
      localStorage.removeItem("themeMode");
    } else {
      localStorage.setItem("themeMode", mode);
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, setMode, muiTheme, setCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
