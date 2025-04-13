
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL + "/api";
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

// TEAM APIs
export const fetchTeams = async () => {
  const response = await axios.get(TEAMS_API_BASE_URL, { headers: getAuthHeaders() });
  return response.data;
};

// KNOWLEDGE BASE APIs
export const fetchKbArticles = async () => {
  const response = await axios.get(`${API_BASE_URL}/kb-articles`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// SYSTEM SETTINGS APIs
export const saveSystemSettings = async (settings) => {
  const response = await axios.post(`${API_BASE_URL}/system-settings`, settings, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export { getAuthHeaders };
