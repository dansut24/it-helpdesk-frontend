
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const { username, password } = formData;

    if (username === "testuser" && password === "password123") {
      const mockUser = {
        id: 1,
        username: "testuser",
        roles: ["admin"],
        team_id: 1,
        token: "fake-jwt-token"
      };

      sessionStorage.setItem("user", JSON.stringify(mockUser));
      sessionStorage.setItem("token", mockUser.token);
      sessionStorage.setItem("selectedRole", mockUser.roles[0]);

      navigate("/select-role");
    } else {
      setError("Invalid test credentials");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
