import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Stack,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link as MuiLink
} from "@mui/material";
import { Link } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import BusinessIcon from "@mui/icons-material/Business";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import logo from "../assets/865F7924-3016-4B89-8DF4-F881C33D72E6.png";
import { useThemeMode } from "../context/ThemeContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { mode, setMode } = useThemeMode();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Hardcoded login bypass
  const handleLogin = () => {
    if (formData.username.trim() === "" || formData.password.trim() === "") {
      setError("Please enter username and password.");
      return;
    }

    const mockUser = {
      id: 1,
      username: formData.username,
      avatar_url: "",
      roles: ["admin", "selfservice"]
    };

    sessionStorage.setItem("user", JSON.stringify(mockUser));
    sessionStorage.setItem("token", "mock-token");
    sessionStorage.setItem("selectedRole", "admin");
    window.location.href = "/";
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box sx={{ textAlign: "right", mb: 1 }}>
        <FormControl variant="standard" size="small">
          <InputLabel sx={{ color: "text.primary" }}>Theme</InputLabel>
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="light">
              <LightModeIcon fontSize="small" sx={{ mr: 1 }} /> Light
            </MenuItem>
            <MenuItem value="dark">
              <DarkModeIcon fontSize="small" sx={{ mr: 1 }} /> Dark
            </MenuItem>
            <MenuItem value="system">
              <SettingsBrightnessIcon fontSize="small" sx={{ mr: 1 }} /> System
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={4} sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
        <img src={logo} alt="Hi5Tech Logo" style={{ height: 60, marginBottom: 16 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Welcome to Hi5Tech
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to your workspace
        </Typography>

        <Stack spacing={1.5} mb={3}>
          <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth>
            Sign in with Google
          </Button>
          <Button variant="outlined" startIcon={<BusinessIcon />} fullWidth>
            Sign in with Microsoft
          </Button>
          <Button variant="outlined" startIcon={<GitHubIcon />} fullWidth>
            Sign in with GitHub
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }}>or</Divider>

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="dense"
        />
        <Box sx={{ textAlign: "right", mt: 1 }}>
          <MuiLink component={Link} to="/reset-password" underline="hover" fontSize="0.875rem">
            Forgot password?
          </MuiLink>
        </Box>

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 1.2, fontWeight: "bold" }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>

      <Typography
        variant="caption"
        display="block"
        align="center"
        sx={{ mt: 3, color: "text.secondary" }}
      >
        Powered by Hi5Tech
      </Typography>
    </Container>
  );
};

export default Login;
