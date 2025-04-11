
import React, { useState } from "react";
import { Container, Paper, TextField, Button, Typography } from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError(""); // clear previous error

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("selectedRole", "choose");

      console.log("✅ Login successful");
      window.location.href = "/";
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "100px" }}>
      <Paper elevation={3} style={{ padding: "30px" }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        {error && (
          <Typography color="error" style={{ marginTop: "10px" }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          style={{ marginTop: "20px" }}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
