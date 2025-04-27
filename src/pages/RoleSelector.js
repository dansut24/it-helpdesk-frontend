import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const RoleSelector = ({ setUserRole }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { roles = [], user = {} } = location.state || {};

  useEffect(() => {
    if (!roles.length || !user) {
      // No roles or user passed, redirect or show error
      navigate("/login");
    }
  }, [roles, user, navigate]);

  const handleSelect = (role) => {
    const normalizedRole = role.toLowerCase();
    sessionStorage.setItem("selectedRole", normalizedRole);
    if (setUserRole) setUserRole(normalizedRole);
    login({ ...user, role: normalizedRole });
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 10, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Select Your Role
        </Typography>
        {roles.map((role) => (
          <Box key={role} sx={{ my: 2 }}>
            <Button variant="contained" fullWidth onClick={() => handleSelect(role)}>
              Continue as {role}
            </Button>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default RoleSelector;
