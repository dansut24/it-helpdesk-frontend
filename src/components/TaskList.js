// components/TaskList.js
import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const TaskList = ({ tasks }) => {
  if (!tasks.length) {
    return <Typography sx={{ mt: 2 }}>No tasks found.</Typography>;
  }

  return (
    <Box sx={{ mt: 3 }}>
      {tasks.map((task) => (
        <Paper key={task.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{task.title}</Typography>
          <Typography>Status: {task.status}</Typography>
          <Typography>Due: {task.due_date}</Typography>
          <Typography variant="body2">{task.description}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default TaskList;
