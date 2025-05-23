import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Grid,
  Stack,
  Paper,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip as RechartTooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "@mui/material/styles";

const initialWidgets = [
  { id: "1", type: "pie", title: "Incidents by Status" },
  { id: "2", type: "bar", title: "Monthly Requests" },
  { id: "3", type: "line", title: "Changes Over Time" },
];

const samplePieData = [
  { name: "Open", value: 8 },
  { name: "Closed", value: 12 },
  { name: "Pending", value: 5 },
];

const sampleBarData = [
  { name: "Jan", Requests: 5 },
  { name: "Feb", Requests: 9 },
  { name: "Mar", Requests: 7 },
  { name: "Apr", Requests: 12 },
];

const sampleLineData = [
  { name: "Week 1", Changes: 3 },
  { name: "Week 2", Changes: 5 },
  { name: "Week 3", Changes: 2 },
  { name: "Week 4", Changes: 7 },
];

const COLORS = ["#ff6f61", "#6a67ce", "#6fcf97", "#56ccf2", "#f2994a"];

const Dashboard = () => {
  const theme = useTheme();
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem("dashboardWidgets");
    return saved ? JSON.parse(saved) : initialWidgets;
  });
  const [editMode, setEditMode] = useState(false);
  const [newWidgetOpen, setNewWidgetOpen] = useState(false);
  const [newWidgetType, setNewWidgetType] = useState("pie");
  const [newWidgetTitle, setNewWidgetTitle] = useState("");

  useEffect(() => {
    localStorage.setItem("dashboardWidgets", JSON.stringify(widgets));
  }, [widgets]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(widgets);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setWidgets(reordered);
  };

  const addWidget = () => {
    const newId = Date.now().toString();
    setWidgets([...widgets, { id: newId, type: newWidgetType, title: newWidgetTitle || "Untitled" }]);
    setNewWidgetOpen(false);
    setNewWidgetType("pie");
    setNewWidgetTitle("");
  };

  const deleteWidget = (id) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  const resetLayout = () => {
    localStorage.removeItem("dashboardWidgets");
    setWidgets(initialWidgets);
  };

  const updateWidgetTitle = (id, newTitle) => {
    setWidgets(widgets.map((w) => (w.id === id ? { ...w, title: newTitle } : w)));
  };

  const renderWidget = (widget) => {
    if (widget.type === "pie") {
      return (
        <PieChart width={250} height={200}>
          <Pie
            data={samplePieData}
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {samplePieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartTooltip />
        </PieChart>
      );
    }
    if (widget.type === "bar") {
      return (
        <BarChart width={250} height={200} data={sampleBarData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="Requests" fill={theme.palette.primary.main} />
          <RechartTooltip />
        </BarChart>
      );
    }
    if (widget.type === "line") {
      return (
        <LineChart width={250} height={200} data={sampleLineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="monotone" dataKey="Changes" stroke={theme.palette.primary.main} />
          <RechartTooltip />
        </LineChart>
      );
    }
  };

  return (
   <Box sx={{ p: { xs: 1, md: 3 }, backgroundColor: theme.palette.background.default }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>

        <Stack direction="row" spacing={1}>
          {editMode ? (
            <>
              <Button variant="contained" size="small" color="success" onClick={() => setEditMode(false)}>
                Save
              </Button>
              <Button variant="outlined" size="small" onClick={() => resetLayout()}>
                Reset Layout
              </Button>
            </>
          ) : (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditMode(true)}>
              Edit Dashboard
            </Button>
          )}
        </Stack>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!editMode}>
                  {(provided) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Paper
                        elevation={4}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]} 0%, ${theme.palette.primary.main} 100%)`,
                          color: "white",
                          minHeight: 280,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          position: "relative",
                        }}
                      >
                        <Box>
                          {editMode ? (
                            <TextField
                              value={widget.title}
                              onChange={(e) => updateWidgetTitle(widget.id, e.target.value)}
                              variant="standard"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                style: { fontSize: 18, fontWeight: "bold", color: "white" },
                              }}
                              sx={{ mb: 2 }}
                            />
                          ) : (
                            <Typography variant="h6" fontWeight="bold" mb={2}>
                              {widget.title}
                            </Typography>
                          )}
                          <Box display="flex" justifyContent="center">
                            {renderWidget(widget)}
                          </Box>
                        </Box>

                        {editMode && (
                          <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => deleteWidget(widget.id)}
                            sx={{ position: "absolute", top: 8, right: 8 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Paper>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Widget Modal */}
      <Modal open={newWidgetOpen} onClose={() => setNewWidgetOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add Widget
          </Typography>

          <TextField
            fullWidth
            label="Title"
            value={newWidgetTitle}
            onChange={(e) => setNewWidgetTitle(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            select
            label="Widget Type"
            value={newWidgetType}
            onChange={(e) => setNewWidgetType(e.target.value)}
            margin="normal"
          >
            <MenuItem value="pie">Pie Chart</MenuItem>
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="line">Line Chart</MenuItem>
          </TextField>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={addWidget}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
