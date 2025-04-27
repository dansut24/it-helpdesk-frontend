import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { useThemeMode } from "../context/ThemeContext";

const predefinedThemes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "Ocean", value: "ocean" },
  { name: "Sunset", value: "sunset" },
  { name: "Forest", value: "forest" },
];

const ThemeSettings = () => {
  const { mode, setMode, setCustomTheme } = useThemeMode();
  const [selectedTheme, setSelectedTheme] = useState(mode);
  const [customColors, setCustomColors] = useState({
    primary: "#1976d2",
    background: "#ffffff",
    paper: "#f7f7f7",
  });

  useEffect(() => {
    if (mode === "custom") {
      const saved = localStorage.getItem("customTheme");
      if (saved) setCustomColors(JSON.parse(saved));
    }
  }, [mode]);

  const handlePredefinedChange = (e) => {
    const value = e.target.value;
    setSelectedTheme(value);
    setMode(value);
  };

  const handleCustomChange = (field) => (e) => {
    setCustomColors({ ...customColors, [field]: e.target.value });
  };

  const applyCustomTheme = () => {
    localStorage.setItem("themeMode", "custom");
    localStorage.setItem("customTheme", JSON.stringify(customColors));
    setCustomTheme(customColors);
    setMode("custom");
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Theme Settings
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Predefined Theme</InputLabel>
        <Select
          value={selectedTheme}
          label="Select Predefined Theme"
          onChange={handlePredefinedChange}
        >
          {predefinedThemes.map((theme) => (
            <MenuItem key={theme.value} value={theme.value}>
              {theme.name}
            </MenuItem>
          ))}
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1" gutterBottom>
        Customize Your Own Theme
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Primary Color"
          type="color"
          value={customColors.primary}
          onChange={handleCustomChange("primary")}
        />
        <TextField
          label="Background Color"
          type="color"
          value={customColors.background}
          onChange={handleCustomChange("background")}
        />
        <TextField
          label="Paper Color"
          type="color"
          value={customColors.paper}
          onChange={handleCustomChange("paper")}
        />

        <Button variant="contained" onClick={applyCustomTheme}>
          Apply Custom Theme
        </Button>
      </Box>
    </Paper>
  );
};

export default ThemeSettings;
