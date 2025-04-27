import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { getAuthHeaders } from "../api";

const Attachments = ({ entityType, entityId }) => {
  const [attachments, setAttachments] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  const fetchAttachments = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/attachments?type=${entityType}&id=${entityId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Failed to load attachments");
      const data = await res.json();
      setAttachments(data);
    } catch (err) {
      console.error("❌ Error fetching attachments:", err);
    }
  };

  useEffect(() => {
    if (entityType && entityId) fetchAttachments();
  }, [entityType, entityId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("entity_type", entityType);
    formData.append("entity_id", entityId);

    try {
      const response = await fetch("${process.env.REACT_APP_API_URL}/api/attachments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      await fetchAttachments();
      setSelectedFile(null);
      setShowUploadDialog(false);
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Failed to upload attachment.");
    }
  };

  const handlePreview = (file) => {
    const ext = file.original_name?.split(".").pop().toLowerCase();
    const url = `http://localhost:5000${file.file_path}`;

    if (["png", "jpg", "jpeg", "gif", "pdf"].includes(ext)) {
      setPreviewUrl(url);
      setPreviewType(ext);
    } else {
      alert("Preview not supported for this file type.");
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000${file.file_path}`;
    link.download = file.original_name || "attachment";
    link.click();
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, position: "relative" }}>
      <Typography variant="h6">Attachments</Typography>
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8 }}
        onClick={() => setShowUploadDialog(true)}
      >
        <AddCircleOutlineIcon />
      </IconButton>

      {attachments.length > 0 ? (
        <List sx={{ mt: 2 }}>
          {attachments.map((file, index) => (
            <ListItem key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InsertDriveFileIcon sx={{ mr: 1 }} />
                <a
                  href={`http://localhost:5000${file.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.original_name || "Download"}
                </a>
              </Box>
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                Uploaded by: {file.uploaded_by || "Unknown"} • {file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : "Unknown time"}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handlePreview(file)}
                  sx={{ mr: 1 }}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(file)}
                >
                  Download
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2">No attachments found.</Typography>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)}>
        <DialogTitle>Upload Attachment</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewUrl} onClose={() => setPreviewUrl(null)} maxWidth="md" fullWidth>
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>
          {previewType === "pdf" ? (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            ></iframe>
          ) : (
            <img
              src={previewUrl}
              alt="Attachment Preview"
              style={{ maxWidth: "100%", maxHeight: "600px" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewUrl(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Attachments;
