import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  IconButton,
  MenuItem,
TableContainer,
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions, 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import {
  fetchUsers,
  updateUserRole,
  resetUserPassword,
  updateUserStatus,
  fetchEmailSettings,
  saveEmailSettings,
  fetchSlaSettings,
  saveSlaSettings,
  fetchKbArticles,
  saveKbArticle,
  deleteKbArticle,
  fetchAuditLogs,
  fetchSystemSettings, // ✅ ADD THIS
  saveSystemSettings,  // ✅ AND THIS
  fetchRoles, 
  fetchPermissions,
  fetchRolePermissions,
  updateRolePermissions,
  fetchEmailTemplates,
  saveEmailTemplate,
  deleteEmailTemplate,
  fetchTeams,
  createTeam,
  assignUserToTeam,
  createUser,
  checkUserExists,
} from "../api";

const AdminSettings = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // KB State
  const [kbArticles, setKbArticles] = useState([]);
  const [kbForm, setKbForm] = useState({ id: "", title: "", category: "", content: "" });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({ from_name: "", from_email: "" });

  // SLA Settings
  const [slaSettings, setSlaSettings] = useState({ Critical: "", High: "", Medium: "", Low: "" });

  // Users
  const [users, setUsers] = useState([]);

  const [systemSettings, setSystemSettings] = useState({
    system_name: "",
    timezone: "",
    date_format: "",
    maintenance_mode: false,
  });

  const handleSaveSystemSettings = async () => {
    try {
      await saveSystemSettings(systemSettings);
      alert("✅ System settings saved successfully.");
    } catch (err) {
      console.error("❌ Failed to save system settings", err);
    }
  };

  


  const [roles, setRoles] = useState([]);
const [permissions, setPermissions] = useState([]);
const [selectedRoleId, setSelectedRoleId] = useState(null);
const [selectedPermissions, setSelectedPermissions] = useState([]);

const [templates, setTemplates] = useState([]);
const [templateForm, setTemplateForm] = useState({ id: "", name: "", subject: "", body: "" });

const [teams, setTeams] = useState([]);
const [newTeamName, setNewTeamName] = useState("");
const [teamAssignments, setTeamAssignments] = useState({});

const [passwordInputs, setPasswordInputs] = useState({});

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

const [selectedUser, setSelectedUser] = useState(null);
const [editedRoles, setEditedRoles] = useState([]); // ✅ ADD THIS LINE
const handleSelectUser = (user) => {
  setSelectedUser(user);
  setEditedRoles(user.roles || []);
};



const [selectedUserIds, setSelectedUserIds] = useState([]);

const [userFilter, setUserFilter] = useState("");

const [activeUserFilter, setActiveUserFilter] = useState("all");
const filteredUsers = users
.filter((u) =>
  u.username?.toLowerCase().includes(userFilter.toLowerCase()) ||
  u.email?.toLowerCase().includes(userFilter.toLowerCase()) ||
  u.role?.toLowerCase().includes(userFilter.toLowerCase())
)
.filter((u) => {
  if (activeUserFilter === "admin") return u.role === "admin";
  if (activeUserFilter === "user") return u.role === "user";
  if (activeUserFilter === "inactive") return !u.active;
  return true; // "all"
});
  

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    first_name: "",
    last_name: "",
  });

  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    roles: ["selfservice"], // ✅ always include selfservice
  });
  
  const [showUserModal, setShowUserModal] = useState(false);
  

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [page, setPage] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
const [filterRole, setFilterRole] = useState("");
const [filterTeam, setFilterTeam] = useState("");
const [filterStatus, setFilterStatus] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 10;
const paginatedUsers = filteredUsers.slice(page * usersPerPage, (page + 1) * usersPerPage);

const handleUserFilterTabChange = (filterType) => {
    setActiveUserFilter(filterType);
    setPage(0); // Reset to first page if using pagination
  };
  


const handleBulkDeactivate = async () => {
    if (selectedUserIds.length === 0) return alert("No users selected.");
    const confirm = window.confirm("Are you sure you want to deactivate selected users?");
    if (!confirm) return;
  
    try {
      for (const userId of selectedUserIds) {
        await updateUserStatus(userId, false);
      }
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      setSelectedUserIds([]);
      alert("✅ Selected users deactivated.");
    } catch (err) {
      console.error("❌ Bulk deactivate failed", err);
      alert("Failed to deactivate users.");
    }
  };

  
  const handleBulkRoleChange = async (newRole) => {
    if (selectedUserIds.length === 0) return alert("No users selected.");
  
    try {
      for (const userId of selectedUserIds) {
        await updateUserRole(userId, newRole);
      }
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      setSelectedUserIds([]);
      alert("✅ Role updated for selected users.");
    } catch (err) {
      console.error("❌ Bulk role change failed", err);
      alert("Failed to change roles.");
    }
  };
  
  const [serviceTemplates, setServiceTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("${process.env.REACT_APP_API_URL}/api/templates", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const templates = Array.isArray(response.data) ? response.data : [];
        console.log("📦 Loaded templates:", templates); // Ensure this logs a valid array
        setServiceTemplates(templates);
      } catch (err) {
        console.error("❌ Failed to fetch templates:", err);
      }
    };
  
    loadTemplates();
  }, []);
  


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [articles, email, sla, usersList, auditLogData, system, roles, perms, emailTemplates, teamsData, userList] = await Promise.all([
        fetchKbArticles(),
        fetchEmailSettings(),
        fetchSlaSettings(),
        fetchUsers(),
        fetchAuditLogs(),
        fetchSystemSettings(),
        fetchRoles(),
        fetchPermissions(),
        fetchEmailTemplates(),
        fetchTeams(),
        fetchUsers(),
      ]);

      setKbArticles(articles);
      setEmailSettings(email);
      const slaObj = {};
      sla.forEach(({ priority, hours }) => {
        slaObj[priority] = hours;
      });
      setSlaSettings(slaObj);
      setUsers(usersList);
      setAuditLogs(auditLogData);
      setSystemSettings(system);
      setRoles(roles);
      setPermissions(perms);
      if (roles.length > 0) {
        setSelectedRoleId(roles[0].id);
        const assigned = await fetchRolePermissions(roles[0].id);
        setSelectedPermissions(assigned.map(p => p.permission_id));
      }
      setTemplates(emailTemplates);
      setTeams(teamsData);
      setUsers(userList);
      
    } catch (err) {
      console.error("❌ Failed to load admin data", err);
    }
  };

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  // KB Handlers
  const handleKbChange = (e) => {
    const { name, value } = e.target;
    setKbForm({ ...kbForm, [name]: value });
  };

  const handleSaveKbArticle = async () => {
    try {
      const saved = await saveKbArticle(kbForm);
      if (kbForm.id) {
        setKbArticles((prev) =>
          prev.map((a) => (a.id === kbForm.id ? { ...a, ...kbForm } : a))
        );
      } else {
        setKbArticles((prev) => [{ ...kbForm, id: saved.id }, ...prev]);
      }
      setKbForm({ id: "", title: "", category: "", content: "" });
    } catch (err) {
      console.error("❌ Failed to save KB article", err);
    }
  };

  const handleDeleteKb = async (id) => {
    try {
      await deleteKbArticle(id);
      setKbArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete KB article", err);
    }
  };

  // Email
  const handleEmailChange = (e) => {
    setEmailSettings({ ...emailSettings, [e.target.name]: e.target.value });
  };

  const handleSaveEmail = async () => {
    try {
      await saveEmailSettings(emailSettings);
    } catch (err) {
      console.error("❌ Failed to save email settings", err);
    }
  };

  // SLA
  const handleSlaChange = (e) => {
    setSlaSettings({ ...slaSettings, [e.target.name]: e.target.value });
  };

  const handleSaveSla = async () => {
    try {
      await saveSlaSettings(slaSettings);
    } catch (err) {
      console.error("❌ Failed to save SLA settings", err);
    }
  };

  // Users
  const handleResetPassword = async (id, password) => {
    if (!password) {
      alert("Please enter or generate a password before resetting.");
      return;
    }
  
    try {
      await resetUserPassword(id, password);
      alert("✅ Password updated.");
      setPasswordInputs((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("❌ Failed to reset password", err);
      alert("Failed to reset password.");
    }
  };
  

  const handleToggleStatus = async (id, active) => {
    try {
      await updateUserStatus(id, !active);
      console.log("✅ Toggle success for user:", id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: !active } : u))
      );
    } catch (err) {
      console.error("❌ Toggle failed", err);
    }
  };
  

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("❌ Role change failed", err);
    }
  };

  const [auditLogs, setAuditLogs] = useState([]);

useEffect(() => {
  const loadAuditLogs = async () => {
    try {
      const response = await fetch("${process.env.REACT_APP_API_URL}/api/audit-logs", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      setAuditLogs(data);
    } catch (err) {
      console.error("❌ Failed to load audit logs:", err);
    }
  };

  loadAuditLogs();
}, []);

const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return alert("Please enter a team name.");
  
    try {
      await createTeam(newTeamName);
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
      setNewTeamName("");
      alert("✅ Team created.");
    } catch (err) {
      console.error("❌ Failed to create team", err);
      alert("Failed to create team.");
    }
  };
  
  const handleAssignTeam = async (userId) => {
    const teamId = teamAssignments[userId];
  
    try {
      await assignUserToTeam(userId, teamId);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      alert("✅ Team assignment updated.");
    } catch (err) {
      console.error("❌ Failed to assign team", err);
      alert("Failed to assign team.");
    }
  };

  const handleCreateUser = async () => {
    const { username, email, password, first_name, last_name, roles } = newUserForm;
  
    if (!username || !email || !password || !roles || !first_name || !last_name) {
      alert("Please fill out all required fields.");
      return;
    }
  
    try {
      const exists = await checkUserExists(username, email);
      if (exists) {
        alert("❌ Username or email already in use.");
        return;
      }
  
      const finalRoles = [...new Set(["selfservice", ...(roles || [])])]; // ✅ Ensure selfservice is always included
  
      await createUser({ username, email, password, first_name, last_name, roles: finalRoles }); // ✅ Pass enforced roles
      alert("✅ User created!");
  
      setNewUserForm({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        roles: ["selfservice"], // ✅ Reset form with selfservice included again
      });
  
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (err) {
      console.error("❌ Error creating user", err);
      alert("❌ Failed to create user.");
    }
  };
  
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Settings
      </Typography>

      <Paper sx={{ mb: 3 }}>
      <Tabs
  value={tabIndex}
  onChange={handleTabChange}
  variant="scrollable"
  scrollButtons="auto"
  allowScrollButtonsMobile
>
          <Tab label="Knowledge Base" />
          <Tab label="Email Settings" />
          <Tab label="SLA Definitions" />
          <Tab label="User Management" />
          <Tab label="Audit Logs" /> 
          <Tab label="System Settings" /> 
          <Tab label="Role & Permission Editor" />
          <Tab label="Email Templates" />
          <Tab label="Teams & User Assignment" />
          <Tab label="Service Request Templates" />

        </Tabs>
      </Paper>

      {/* KB */}
      {tabIndex === 0 && (
        <Box>
          <Typography variant="h6">Manage Knowledge Base</Typography>
          <TextField label="Title" name="title" fullWidth sx={{ my: 1 }} value={kbForm.title} onChange={handleKbChange} />
          <TextField label="Category" name="category" fullWidth sx={{ my: 1 }} value={kbForm.category} onChange={handleKbChange} />
          <TextField label="Content" name="content" fullWidth multiline rows={4} sx={{ my: 1 }} value={kbForm.content} onChange={handleKbChange} />
          <Button onClick={handleSaveKbArticle} variant="contained">
            {kbForm.id ? "Update Article" : "Save Article"}
          </Button>

          <Divider sx={{ my: 2 }} />
          {kbArticles.map((a) => (
            <Paper key={a.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1">{a.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {a.category}
              </Typography>
              <Typography sx={{ mt: 1 }}>{a.content}</Typography>
              <Box sx={{ mt: 1 }}>
                <Button size="small" onClick={() => setKbForm(a)}>Edit</Button>
                <IconButton size="small" onClick={() => handleDeleteKb(a.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Email */}
      {tabIndex === 1 && (
        <Box>
          <Typography variant="h6">Email Configuration</Typography>
          <TextField label="From Name" name="from_name" fullWidth sx={{ my: 1 }} value={emailSettings.from_name} onChange={handleEmailChange} />
          <TextField label="From Email" name="from_email" fullWidth sx={{ my: 1 }} value={emailSettings.from_email} onChange={handleEmailChange} />
          <Button variant="contained" onClick={handleSaveEmail}>Save Email Settings</Button>
        </Box>
      )}

      {/* SLA */}
      {tabIndex === 2 && (
        <Box>
          <Typography variant="h6">SLA Response Times</Typography>
          {["Critical", "High", "Medium", "Low"].map((priority) => (
            <TextField
              key={priority}
              label={`${priority} Priority SLA (hours)`}
              name={priority}
              type="number"
              fullWidth
              value={slaSettings[priority]}
              onChange={handleSlaChange}
              sx={{ my: 1 }}
            />
          ))}
          <Button variant="contained" onClick={handleSaveSla}>Save SLA Settings</Button>
        </Box>
      )}

{tabIndex === 3 && (
  <Box>
    <Typography variant="h6" gutterBottom>User Management</Typography>

    <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
      <TextField
        placeholder="Search users..."
        size="small"
        value={userFilter}
        onChange={(e) => setUserFilter(e.target.value)}
      />
      <TextField label="Role" select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} size="small">
        <MenuItem value="">All</MenuItem>
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      <TextField label="Team" select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} size="small">
        <MenuItem value="">All</MenuItem>
        {teams.map((t) => (
          <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
        ))}
      </TextField>
      <TextField label="Status" select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} size="small">
        <MenuItem value="">All</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </TextField>
      <Button variant="contained" onClick={() => setShowUserModal(true)}>
        Create New User
      </Button>

      {selectedUsers.length > 0 && (
        <>
          <Button onClick={handleBulkDeactivate} variant="outlined" color="warning">Deactivate Selected</Button>
          <Button onClick={handleBulkRoleChange} variant="outlined" color="info">Toggle Role</Button>
        </>
      )}
    </Box>

    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell>First Name</TableCell>
          <TableCell>Last Name</TableCell>
          <TableCell>Username</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedUsers.map((user) => (
          <TableRow
            key={user.id}
            hover
            selected={selectedUsers.includes(user.id)}
            onClick={() => handleSelectUser(user)}
          >
            <TableCell padding="checkbox">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => {
                  setSelectedUsers((prev) =>
                    prev.includes(user.id)
                      ? prev.filter((id) => id !== user.id)
                      : [...prev, user.id]
                  );
                }}
              />
            </TableCell>
            <TableCell>{user.first_name}</TableCell>
            <TableCell>{user.last_name}</TableCell>
            <TableCell>{user.username}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Box mt={2} display="flex" justifyContent="center">
      {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
        <Button key={i} onClick={() => setCurrentPage(i + 1)} disabled={currentPage === i + 1}>
          {i + 1}
        </Button>
      ))}
    </Box>

    <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)}>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        <Typography><strong>Username:</strong> {selectedUser?.username}</Typography>
        <Typography><strong>Email:</strong> {selectedUser?.email}</Typography>
        <Typography><strong>Roles:</strong></Typography>
<TextField
  select
  fullWidth
  SelectProps={{ multiple: true }}
  value={editedRoles}
  onChange={(e) => {
    const selected = e.target.value;
    // Always force selfservice in selection
    const newRoles = [...new Set(["selfservice", ...selected.filter(r => r !== "selfservice")])];
    setEditedRoles(newRoles);
  }}
  sx={{ mb: 2 }}
>
  {roles.map((role) => (
    <MenuItem
      key={role.name}
      value={role.name}
      disabled={role.name === "selfservice"} // Prevent deselecting selfservice
    >
      {role.name}
    </MenuItem>
  ))}
</TextField>
<Button
  variant="contained"
  fullWidth
  onClick={async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${selectedUser.id}/roles`,
        { roles: editedRoles },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, roles: editedRoles } : u
        )
      );
      alert("✅ Roles updated.");
    } catch (err) {
      console.error("❌ Failed to update roles", err);
      alert("❌ Failed to update roles.");
    }
  }}
>
  Save Roles
</Button>


        <Typography><strong>Status:</strong> {selectedUser?.active ? "Active" : "Inactive"}</Typography>
        <Typography><strong>Team:</strong> {teams.find(t => t.id === selectedUser?.team_id)?.name || "Unassigned"}</Typography>

        <Divider sx={{ my: 2 }} />

        <TextField
          label="New Password"
          type="text"
          fullWidth
          sx={{ mb: 1 }}
          value={passwordInputs[selectedUser?.id] || ""}
          onChange={(e) =>
            setPasswordInputs({ ...passwordInputs, [selectedUser.id]: e.target.value })
          }
        />
        <Button
          fullWidth
          variant="contained"
          onClick={() => handleResetPassword(selectedUser.id, passwordInputs[selectedUser.id])}
        >
          Reset Password
        </Button>
        <Button
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => handleRoleChange(selectedUser.id, selectedUser.role)}
        >
          Toggle Role
        </Button>
        <Button
          fullWidth
          sx={{ mt: 1 }}
          color={selectedUser?.active ? "warning" : "success"}
          onClick={() => handleToggleStatus(selectedUser.id, selectedUser.active)}
        >
          {selectedUser?.active ? "Deactivate" : "Activate"}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedUser(null)}>Close</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={showUserModal} onClose={() => setShowUserModal(false)}>
  <DialogTitle>Create New User</DialogTitle>
  <DialogContent>
    <TextField
      margin="dense"
      fullWidth
      label="First Name"
      name="first_name"
      value={newUserForm.first_name}
      onChange={(e) => setNewUserForm({ ...newUserForm, first_name: e.target.value })}
    />
    <TextField
      margin="dense"
      fullWidth
      label="Last Name"
      name="last_name"
      value={newUserForm.last_name}
      onChange={(e) => setNewUserForm({ ...newUserForm, last_name: e.target.value })}
    />
    <TextField
      margin="dense"
      fullWidth
      label="Username"
      name="username"
      value={newUserForm.username}
      onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
    />
    <TextField
      margin="dense"
      fullWidth
      label="Email"
      name="email"
      value={newUserForm.email}
      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
    />
    <TextField
      margin="dense"
      fullWidth
      label="Password"
      type="password"
      name="password"
      value={newUserForm.password}
      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
    />
    <TextField
  margin="dense"
  select
  fullWidth
  label="Roles"
  SelectProps={{ multiple: true }}
  value={newUserForm.roles || []}
  onChange={(e) => setNewUserForm({ ...newUserForm, roles: e.target.value })}
>
  {roles.map((role) => (
    <MenuItem key={role.name} value={role.name}>
      {role.name}
    </MenuItem>
  ))}

    </TextField>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowUserModal(false)}>Cancel</Button>
    <Button onClick={handleCreateUser} variant="contained">Create</Button>
  </DialogActions>
</Dialog>

  </Box>
)}


{tabIndex === 4 && (
  <Box>
    <Typography variant="h6" gutterBottom>
      Audit Logs
    </Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Details</TableCell>
          <TableCell>Timestamp</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {auditLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.username}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.details}</TableCell>
            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
)}

{tabIndex === 5 && (
  <Box>
    <Typography variant="h6" gutterBottom>System Settings</Typography>
    <TextField
      label="System Name"
      fullWidth
      name="system_name"
      value={systemSettings.system_name}
      onChange={(e) => setSystemSettings({ ...systemSettings, system_name: e.target.value })}
      sx={{ my: 1 }}
    />
    <TextField
      label="Default Timezone"
      fullWidth
      name="timezone"
      value={systemSettings.timezone}
      onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
      sx={{ my: 1 }}
    />
    <TextField
      label="Date Format"
      fullWidth
      name="date_format"
      value={systemSettings.date_format}
      onChange={(e) => setSystemSettings({ ...systemSettings, date_format: e.target.value })}
      sx={{ my: 1 }}
    />
    <Box>
      <label>
        <input
          type="checkbox"
          checked={systemSettings.maintenance_mode}
          onChange={(e) => setSystemSettings({ ...systemSettings, maintenance_mode: e.target.checked })}
        />
        Enable Maintenance Mode
      </label>
    </Box>
    <Button variant="contained" onClick={handleSaveSystemSettings} sx={{ mt: 2 }}>
      Save System Settings
    </Button>
  </Box>
)}

{tabIndex === 6 && (
  <Box>
    <Typography variant="h6" gutterBottom>Role & Permission Editor</Typography>

    <TextField
      select
      label="Select Role"
      fullWidth
      value={selectedRoleId || ""}
      onChange={async (e) => {
        const roleId = e.target.value;
        setSelectedRoleId(roleId);
        const assigned = await fetchRolePermissions(roleId);
        setSelectedPermissions(assigned.map(p => p.permission_id));
      }}
      SelectProps={{ native: true }}
      sx={{ my: 2 }}
    >
      <option value="">-- Select Role --</option>
      {roles.map((r) => (
        <option key={r.id} value={r.id}>{r.name}</option>
      ))}
    </TextField>

    {permissions.map((perm) => (
      <Box key={perm.id}>
        <label>
          <input
            type="checkbox"
            checked={selectedPermissions.includes(perm.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPermissions((prev) => [...prev, perm.id]);
              } else {
                setSelectedPermissions((prev) =>
                  prev.filter((id) => id !== perm.id)
                );
              }
            }}
          />
          {perm.name}
        </label>
      </Box>
    ))}

    <Button
      variant="contained"
      sx={{ mt: 2 }}
      onClick={async () => {
        await updateRolePermissions(selectedRoleId, selectedPermissions);
        alert("✅ Permissions updated.");
      }}
    >
      Save Permissions
    </Button>
  </Box>
)}

{tabIndex === 7 && (
  <Box>
    <Typography variant="h6" gutterBottom>Email Templates</Typography>

    <TextField
      label="Template Name"
      fullWidth
      name="name"
      sx={{ my: 1 }}
      value={templateForm.name}
      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
    />
    <TextField
      label="Subject"
      fullWidth
      name="subject"
      sx={{ my: 1 }}
      value={templateForm.subject}
      onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
    />
    <TextField
      label="Body"
      fullWidth
      multiline
      rows={4}
      name="body"
      sx={{ my: 1 }}
      value={templateForm.body}
      onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
    />
    <Button
      variant="contained"
      sx={{ mb: 2 }}
      onClick={async () => {
        try {
          const saved = await saveEmailTemplate(templateForm);
          const updatedList = templateForm.id
            ? templates.map((t) => (t.id === templateForm.id ? { ...templateForm } : t))
            : [{ ...templateForm, id: saved.id }, ...templates];
          setTemplates(updatedList);
          setTemplateForm({ id: "", name: "", subject: "", body: "" });
        } catch (err) {
          console.error("❌ Failed to save template", err);
        }
      }}
    >
      {templateForm.id ? "Update Template" : "Save Template"}
    </Button>

    <Divider sx={{ my: 2 }} />

    {templates.map((t) => (
      <Paper key={t.id} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">{t.name}</Typography>
        <Typography variant="caption" color="text.secondary">{t.subject}</Typography>
        <Typography sx={{ mt: 1 }}>{t.body}</Typography>
        <Box sx={{ mt: 1 }}>
          <Button size="small" onClick={() => setTemplateForm(t)}>Edit</Button>
          <IconButton size="small" onClick={async () => {
            await deleteEmailTemplate(t.id);
            setTemplates((prev) => prev.filter((tpl) => tpl.id !== t.id));
          }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    ))}
  </Box>
)}

{tabIndex === 8 && (
  <Box>
    <Typography variant="h6" gutterBottom>Manage Teams</Typography>

    <Box display="flex" gap={2} mb={3}>
      <TextField
        label="New Team Name"
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)}
      />
      <Button variant="contained" onClick={handleCreateTeam}>
        Create Team
      </Button>
    </Box>

    {/* ✅ Show a table of created teams */}
    <Typography variant="subtitle1" gutterBottom>Existing Teams</Typography>
    <Table size="small" sx={{ mb: 4 }}>
      <TableHead>
        <TableRow>
          <TableCell>Team ID</TableCell>
          <TableCell>Team Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>{team.id}</TableCell>
            <TableCell>{team.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Typography variant="h6" gutterBottom>Assign Users to Teams</Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Current Team</TableCell>
          <TableCell>Assign To</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              {teams.find((t) => t.id === user.team_id)?.name || "None"}
            </TableCell>
            <TableCell>
              <TextField
                select
                size="small"
                value={teamAssignments[user.id] || ""}
                onChange={(e) =>
                  setTeamAssignments({
                    ...teamAssignments,
                    [user.id]: e.target.value,
                  })
                }
              >
                <MenuItem value="">Unassigned</MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            </TableCell>
            <TableCell>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAssignTeam(user.id)}
              >
                Assign
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
)}

{tabIndex === 9 && (
  <Box>
    <Typography variant="h6" gutterBottom>Service Request Templates</Typography>

    <Box sx={{ mb: 2 }}>
      <Button
        variant="contained"
        onClick={() =>
          setSelectedTemplate({
            id: null,
            name: "",
            description: "",
            auto_tasks: [],
          })
        }
      >
        + New Template
      </Button>
    </Box>

    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ width: "30%" }}>
        <Typography variant="subtitle1">Templates</Typography>
        {serviceTemplates.map((tpl) => (
          <Paper
            key={tpl.id}
            sx={{
              p: 2,
              mb: 1,
              cursor: "pointer",
              bgcolor: selectedTemplate?.id === tpl.id ? "grey.300" : "white",
            }}
            onClick={() => setSelectedTemplate({ ...tpl, auto_tasks: JSON.parse(tpl.auto_tasks || "[]") })}
          >
            <Typography>{tpl.name}</Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {selectedTemplate && (
          <>
            <TextField
              fullWidth
              label="Template Name"
              sx={{ mb: 2 }}
              value={selectedTemplate.name}
              onChange={(e) =>
                setSelectedTemplate({ ...selectedTemplate, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Description"
              sx={{ mb: 2 }}
              value={selectedTemplate.description}
              onChange={(e) =>
                setSelectedTemplate({ ...selectedTemplate, description: e.target.value })
              }
            />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Auto-generated Tasks
            </Typography>
            {selectedTemplate.auto_tasks.map((task, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 2, mb: 1 }}>
                <TextField
                  label="Task Title"
                  value={task.title}
                  onChange={(e) => {
                    const updated = [...selectedTemplate.auto_tasks];
                    updated[idx].title = e.target.value;
                    setSelectedTemplate({ ...selectedTemplate, auto_tasks: updated });
                  }}
                  fullWidth
                />
                <TextField
                  select
                  label="Team"
                  value={task.assigned_team_id || ""}
                  onChange={(e) => {
                    const updated = [...selectedTemplate.auto_tasks];
                    updated[idx].assigned_team_id = e.target.value;
                    setSelectedTemplate({ ...selectedTemplate, auto_tasks: updated });
                  }}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {teams.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton
                  onClick={() => {
                    const updated = [...selectedTemplate.auto_tasks];
                    updated.splice(idx, 1);
                    setSelectedTemplate({ ...selectedTemplate, auto_tasks: updated });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              onClick={() =>
                setSelectedTemplate({
                  ...selectedTemplate,
                  auto_tasks: [...selectedTemplate.auto_tasks, { title: "", assigned_team_id: "" }],
                })
              }
              variant="outlined"
            >
              + Add Task
            </Button>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    const token = sessionStorage.getItem("token");
                    const payload = {
                      name: selectedTemplate.name,
                      description: selectedTemplate.description,
                      auto_tasks: selectedTemplate.auto_tasks,
                    };

                    if (selectedTemplate.id) {
                      await axios.put(
                        `${process.env.REACT_APP_API_URL}/api/templates/${selectedTemplate.id}`,
                        payload,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      alert("✅ Template updated");
                    } else {
                      const res = await axios.post(
                        `${process.env.REACT_APP_API_URL}/api/templates`,
                        payload,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      setSelectedTemplate({ ...selectedTemplate, id: res.data.id });
                      alert("✅ Template created");
                    }

                    const refreshed = await axios.get("${process.env.REACT_APP_API_URL}/api/templates", {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setServiceTemplates(Array.isArray(refreshed.data) ? refreshed.data : []);
                  } catch (err) {
                    console.error("❌ Failed to save template", err);
                  }
                }}
              >
                Save Template
              </Button>

              {selectedTemplate.id && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={async () => {
                    const confirmed = window.confirm("Are you sure you want to delete this template?");
                    if (!confirmed) return;

                    try {
                      const token = sessionStorage.getItem("token");
                      await axios.delete(`${process.env.REACT_APP_API_URL}/api/templates/${selectedTemplate.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setSelectedTemplate(null);
                      const refreshed = await axios.get("${process.env.REACT_APP_API_URL}/api/templates", {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setServiceTemplates(Array.isArray(refreshed.data) ? refreshed.data : []);
                    } catch (err) {
                      console.error("❌ Failed to delete template", err);
                    }
                  }}
                >
                  Delete Template
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  </Box>
)}

    </Box>
  );
};

export default AdminSettings;
