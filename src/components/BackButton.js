// components/BackButton.js
import React from "react";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton = ({ fallbackTab = null, openTab = null }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (openTab && fallbackTab) {
      openTab(fallbackTab); // Fallback tab (e.g., "Incidents", "Search results")
    } else {
      navigate("/"); // Fallback to home if nothing else
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outlined"
      size="small"
      startIcon={<ArrowBackIcon />}
      sx={{ mb: 2 }}
    >
      Back
    </Button>
  );
};

export default BackButton;
