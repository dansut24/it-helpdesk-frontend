import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getAuthHeaders } from "../api";
console.log("🔐 Auth headers test:", getAuthHeaders());

const getRandomColor = (() => {
  const colorCache = {};
  const colors = [
    "#e3f2fd", "#fce4ec", "#e8f5e9", "#fff3e0", "#f3e5f5", "#ede7f6",
    "#fbe9e7", "#e0f7fa", "#f9fbe7", "#f1f8e9"
  ];
  let index = 0;
  return (username) => {
    if (!colorCache[username]) {
      colorCache[username] = colors[index % colors.length];
      index++;
    }
    return colorCache[username];
  };
})();

const Notes = ({ entityType, entityId }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notes?type=${entityType}&id=${entityId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Failed to load notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("❌ Error fetching notes:", err);
    }
  };

  useEffect(() => {
    if (entityType && entityId) fetchNotes();
  }, [entityType, entityId]);

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    try {
      const res = await fetch("${process.env.REACT_APP_API_URL}/api/notes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          content: noteContent.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to save note");
      setNoteContent("");
      fetchNotes();
    } catch (err) {
      console.error("❌ Error saving note:", err);
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Notes
      </Typography>
      <List>
        {notes.length > 0 ? (
          notes.map((note, idx) => (
            <ListItem
              key={idx}
              alignItems="flex-start"
              sx={{ bgcolor: getRandomColor(note.username), borderRadius: 2, mb: 1 }}
            >
              <Avatar
  src={
    note.avatar_url?.startsWith("http")
      ? note.avatar_url
      : note.avatar_url
      ? `http://localhost:5000${note.avatar_url}`
      : undefined
  }
  sx={{
    mr: 2,
    bgcolor: !note.avatar_url ? getRandomColor(note.username) : undefined,
    color: "black",
  }}
>
  {!note.avatar_url && (note.username?.[0]?.toUpperCase() || "?")}
</Avatar>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {note.username}{" "}
                  <span style={{ fontSize: "0.8em", color: "gray" }}>
                    {new Date(note.timestamp).toLocaleString()}
                  </span>
                </Typography>
                <ListItemText primary={note.content} />
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2">No notes yet.</Typography>
        )}
      </List>
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Add a note"
          variant="outlined"
          size="small"
          fullWidth
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddNote}>
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default Notes;
