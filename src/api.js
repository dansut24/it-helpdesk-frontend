import axios from "axios";

// Define fallback base URL for non-fetch API calls
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = `${API_BASE}`;
const INCIDENT_API_BASE_URL = `${API_BASE_URL}/incidents`;
const SERVICE_REQUEST_API_BASE_URL = `${API_BASE_URL}/service-requests`;
const CHANGE_API_BASE_URL = `${API_BASE_URL}/changes`;
const USERS_API_BASE_URL = `${API_BASE_URL}/users`;
const TEAMS_API_BASE_URL = `${API_BASE_URL}/teams`;

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  const selectedRole = sessionStorage.getItem("selectedRole") || "";

  const headers = {
    "Content-Type": "application/json",
    "x-selected-role": selectedRole,
  };

  if (token && token.startsWith("eyJ")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// INCIDENT APIs
export const fetchIncidents = async () => {
  const response = await axios.get(INCIDENT_API_BASE_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const fetchNextIncidentRef = async () => {
  const response = await axios.get(`${INCIDENT_API_BASE_URL}/next-ref`, { headers: getAuthHeaders() });
  return response.data;
};

export const createIncident = async (data) => {
  const response = await axios.post(INCIDENT_API_BASE_URL, data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateIncident = async (id, updates) => {
  const response = await axios.put(`${INCIDENT_API_BASE_URL}/${id}`, updates, { headers: getAuthHeaders() });
  return response.data;
};

// FETCH INCIDENT BY REFERENCE NUMBER
export const fetchIncidentByReference = async (referenceNumber) => {
  const response = await axios.get(`${API_BASE_URL}/incidents/reference/${referenceNumber}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// UPDATE INCIDENT TEAM
export const updateIncidentTeam = async (incidentId, teamId) => {
  const response = await axios.put(`${API_BASE_URL}/incidents/${incidentId}/assign-team`, { teamId }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// UPDATE INCIDENT ASSIGNEE
export const updateIncidentAssignee = async (incidentId, userId) => {
  const response = await axios.put(`${API_BASE_URL}/incidents/${incidentId}/assign-user`, { userId }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ASSIGN INCIDENT TO CURRENT USER
export const assignIncidentToMe = async (incidentId) => {
  const response = await axios.post(`${API_BASE_URL}/incidents/${incidentId}/assign-to-me`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// GET NEXT INCIDENT REFERENCE NUMBER
export const getNextIncidentRef = async () => {
  const response = await axios.get(`${API_BASE_URL}/incidents/next-ref`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// SERVICE REQUEST APIs
export const fetchServiceRequests = async () => {
  const response = await axios.get(SERVICE_REQUEST_API_BASE_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createServiceRequest = async (data) => {
  const response = await axios.post(SERVICE_REQUEST_API_BASE_URL, data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateServiceRequest = async (id, updates) => {
  const response = await axios.put(`${SERVICE_REQUEST_API_BASE_URL}/${id}`, updates, { headers: getAuthHeaders() });
  return response.data;
};

// FETCH SERVICE REQUEST BY ID
export const fetchServiceRequestById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/service-requests/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// CHANGE APIs
export const fetchChanges = async () => {
  const response = await axios.get(CHANGE_API_BASE_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createChange = async (data) => {
  const response = await axios.post(CHANGE_API_BASE_URL, data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateChange = async (id, updates) => {
  const response = await axios.put(`${CHANGE_API_BASE_URL}/${id}`, updates, { headers: getAuthHeaders() });
  return response.data;
};

// FETCH SINGLE CHANGE BY ID
export const fetchChangeById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/changes/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// SUBMIT A NEW CHANGE REQUEST
export const submitChange = async (changeData) => {
  const response = await axios.post(`${API_BASE_URL}/changes`, changeData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// USER APIs
export const fetchUsers = async () => {
  const response = await axios.get(USERS_API_BASE_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(USERS_API_BASE_URL, userData, { headers: getAuthHeaders() });
  return response.data;
};

export const updateUser = async (id, updates) => {
  const response = await axios.put(`${USERS_API_BASE_URL}/${id}`, updates, { headers: getAuthHeaders() });
  return response.data;
};

export const resetUserPassword = async (id, passwordData) => {
  const response = await axios.post(`${USERS_API_BASE_URL}/${id}/reset-password`, passwordData, { headers: getAuthHeaders() });
  return response.data;
};

// USER STATUS API
export const updateUserStatus = async (id, status) => {
  const response = await axios.put(`${USERS_API_BASE_URL}/${id}/status`, status, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// USER ROLE API
export const updateUserRole = async (id, roleData) => {
  const response = await axios.put(`${USERS_API_BASE_URL}/${id}/roles`, roleData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ASSIGN USER TO TEAM
export const assignUserToTeam = async (userId, teamId) => {
  const response = await axios.post(`${API_BASE_URL}/teams/assign-user`, { userId, teamId }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// CHECK IF USER EXISTS
export const checkUserExists = async (username) => {
  const response = await axios.post(`${API_BASE_URL}/users/check`, { username }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// TEAM APIs
export const fetchTeams = async () => {
  const response = await axios.get(TEAMS_API_BASE_URL, { headers: getAuthHeaders() });
  return response.data;
};

// TEAM CREATE
export const createTeam = async (teamData) => {
  const response = await axios.post(`${API_BASE_URL}/teams`, teamData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// KNOWLEDGE BASE APIs
export const fetchKbArticles = async () => {
  const response = await axios.get(`${API_BASE_URL}/kb-articles`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// KNOWLEDGE BASE ARTICLE SAVE
export const saveKbArticle = async (articleData) => {
  const response = await axios.post(`${API_BASE_URL}/kb-articles`, articleData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// KNOWLEDGE BASE ARTICLE DELETE
export const deleteKbArticle = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/kb-articles/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// SYSTEM SETTINGS APIs
// SYSTEM SETTINGS API
export const fetchSystemSettings = async () => {
  const response = await axios.get(`${API_BASE_URL}/system-settings`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const saveSystemSettings = async (settings) => {
  const response = await axios.post(`${API_BASE_URL}/system-settings`, settings, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// EMAIL SETTINGS APIs
export const fetchEmailSettings = async () => {
  const response = await axios.get(`${API_BASE_URL}/email-settings`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// EMAIL SETTINGS SAVE
export const saveEmailSettings = async (settings) => {
  const response = await axios.post(`${API_BASE_URL}/email-settings`, settings, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// EMAIL TEMPLATE SAVE
export const saveEmailTemplate = async (templateData) => {
  const response = await axios.post(`${API_BASE_URL}/email-templates`, templateData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// DELETE EMAIL TEMPLATE
export const deleteEmailTemplate = async (templateId) => {
  const response = await axios.delete(`${API_BASE_URL}/email-templates/${templateId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// SLA SETTINGS APIs
export const fetchSlaSettings = async () => {
  const response = await axios.get(`${API_BASE_URL}/sla-settings`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// SLA SETTINGS SAVE
export const saveSlaSettings = async (settings) => {
  const response = await axios.post(`${API_BASE_URL}/sla-settings`, settings, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// AUDIT LOG APIs
export const fetchAuditLogs = async () => {
  const response = await axios.get(`${API_BASE_URL}/audit-logs`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ROLE APIs
export const fetchRoles = async () => {
  const response = await axios.get(`${API_BASE_URL}/roles`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// PERMISSIONS API
export const fetchPermissions = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// EMAIL TEMPLATES API
export const fetchEmailTemplates = async () => {
  const response = await axios.get(`${API_BASE_URL}/email-templates`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ROLE PERMISSIONS API
export const fetchRolePermissions = async (roleId) => {
  const response = await axios.get(`${API_BASE_URL}/roles/${roleId}/permissions`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// UPDATE ROLE PERMISSIONS
export const updateRolePermissions = async (roleId, permissions) => {
  const response = await axios.post(`${API_BASE_URL}/roles/${roleId}/permissions`, { permissions }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};


// Setup Wizard
export const createTenant = async (companyData) =>
  fetch(`${API_BASE_URL}/setup/company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyData),
  }).then(res => res.json());

export const createTeams = async (teams) =>
  fetch(`${API_BASE_URL}/setup/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teams }),
  }).then(res => res.json());

export const createUsers = async (users) =>
  fetch(`${API_BASE_URL}/setup/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users }),
  }).then(res => res.json());

export const completeSetup = async (tenantId) =>
  fetch(`${API_BASE_URL}/setup/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId }),
  }).then(res => res.json());

// Updated helper using API base URL
export async function reserveIncident() {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents/reserve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Status:", res.status);
  console.log("Headers:", [...res.headers.entries()]);

  const text = await res.text();
  console.log("Raw response:", text);

  if (!res.ok) {
    throw new Error(`Failed to reserve incident. Server responded with ${res.status}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("Failed to parse JSON: " + text);
  }
}



export { getAuthHeaders };
