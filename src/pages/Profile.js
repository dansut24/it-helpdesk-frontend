import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
  CircularProgress,
  TextField,
  Grid,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useAuth } from "../context/AuthContext";
import ThemeSettings from "../components/ThemeSettings";

const Profile = () => {
  const { user, login } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
  });

  useEffect(() => {
    if (user?.avatar_url) {
      const fullUrl = `${process.env.REACT_APP_API_BASE_URL}${user.avatar_url}`;
      setAvatarPreview(fullUrl);
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();

      const fullUrl = `${process.env.REACT_APP_API_BASE_URL}${data.avatar_url}?t=${Date.now()}`;
      setAvatarPreview(fullUrl);

      const updatedUser = { ...user, avatar_url: data.avatar_url };
      login(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("❌ Avatar upload failed:", error);
      alert("Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Profile</Typography>
      <Typography mb={3}>View and edit your profile details.</Typography>

      <Stack spacing={2} alignItems="center">
        <Avatar src={avatarPreview} sx={{ width: 100, height: 100 }}>
          {user?.username?.[0]?.toUpperCase() || "U"}
        </Avatar>

        <label htmlFor="avatar-upload">
          <input
            accept="image/*"
            id="avatar-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <IconButton component="span" color="primary" disabled={uploading}>
            <PhotoCamera />
          </IconButton>
        </label>

        {uploading && <CircularProgress size={24} />}
      </Stack>

      <Box mt={4}>
        <Grid container spacing={2}>
          {Object.entries(profileData).map(([key, value]) => (
            <Grid key={key} item xs={12} md={6}>
              <TextField
                label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                value={value}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Theme Settings Section */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Theme Preferences
        </Typography>
        <Typography variant="body2" mb={2}>
          Choose from predefined themes or create your own palette.
        </Typography>
        <ThemeSettings />
      </Box>
    </Box>
  );
};

export default Profile;
