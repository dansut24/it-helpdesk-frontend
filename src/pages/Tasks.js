import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, Paper } from "@mui/material";
import TaskForm from "../components/TaskForm";
import axios from "axios";

const Tasks = ({ openTab }) => {
  const [tasks, setTasks] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("${process.env.REACT_APP_API_URL}/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenTask = (task) => {
    openTab(`Task ${task.id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Task Management
      </Typography>

      <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ mb: 2 }}>
        + Create Task
      </Button>

      {tasks.length === 0 ? (
        <Typography>No tasks assigned to you or your team.</Typography>
      ) : (
        tasks.map((task) => (
          <Paper
            key={task.id}
            elevation={2}
            sx={{
              p: 2,
              mb: 1,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
            onClick={() => handleOpenTask(task)}
          >
            <Typography variant="subtitle1">{task.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              Status: {task.status || "Open"}
            </Typography>
            {task.due_date && (
              <Typography variant="body2" color="textSecondary">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </Typography>
            )}
          </Paper>
        ))
      )}

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Box sx={{ p: 3, bgcolor: "white", m: "auto", mt: "10%", width: "40%", borderRadius: 2 }}>
          <TaskForm
            onSuccess={() => {
              setOpenForm(false);
              fetchTasks();
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Tasks;
