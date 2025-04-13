import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL + "/api";
const INCIDENT_API_BASE_URL = `${API_BASE_URL}/incidents`;
const SERVICE_REQUEST_API_BASE_URL = `${API_BASE_URL}/service-requests`;
const CHANGE_API_BASE_URL = `${API_BASE_URL}/changes`;
const USERS_API_BASE_URL = `${API_BASE_URL}/users`;

const getAuthHeaders = () => {
  let token = sessionStorage.getItem("token") || localStorage.getItem("token");

  if (!token || !token.startsWith("eyJ")) {
    console.error("❌ Malformed or missing token.");
    return { "Content-Type": "application/json" };
  }

  console.log("🔑 Using Token:", token);

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

//
// INCIDENT APIs
export const fetchIncidents = async () => {
  const token = sessionStorage.getItem("token");
  const selectedRole = sessionStorage.getItem("selectedRole");

  try {
    const response = await fetch("${process.env.REACT_APP_API_URL}/api/incidents", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-selected-role": selectedRole || "", // ✅ Send selected role
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch incidents");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ fetchIncidents error:", err);
    throw err;
  }
};





export const fetchNextIncidentRef = async () => {
  try {
    const response = await fetch(`${INCIDENT_API_BASE_URL}/next-ref`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error fetching next ref: ${response.statusText}`);
    const data = await response.json();

    if (!data.nextReferenceNumber) throw new Error("API did not return a valid reference.");
    return data.nextReferenceNumber;
  } catch (error) {
    console.error("❌ Error fetching next reference:", error);
    throw error;
  }
};

export const addIncident = async (formData) => {
  try {
    const response = await fetch(INCIDENT_API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error adding incident: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error adding incident:", error);
    throw error;
  }
};

export const fetchIncidentByReference = async (referenceNumber) => {
  if (!referenceNumber || referenceNumber === "next-ref") {
    throw new Error("Invalid incident reference number.");
  }

  try {
    const response = await fetch(`${INCIDENT_API_BASE_URL}/${referenceNumber}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error fetching incident: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching incident details:", error);
    throw error;
  }
};

export const addNote = async (referenceNumber, noteData) => {
  const response = await fetch(`${INCIDENT_API_BASE_URL}/${referenceNumber}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(noteData),
  });

  if (!response.ok) throw new Error(`Error adding note: ${response.statusText}`);
  return await response.json();
};

//
// SERVICE REQUEST APIs
//

export const fetchServiceRequests = async () => {
  try {
    const response = await fetch(SERVICE_REQUEST_API_BASE_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch service requests");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching service requests:", error);
    throw error;
  }
};

export const fetchServiceRequestById = async (id) => {
  try {
    const response = await fetch(`${SERVICE_REQUEST_API_BASE_URL}/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch service request");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching service request:", error);
    throw error;
  }
};

export const createServiceRequest = async (data) => {
  try {
    const response = await fetch(SERVICE_REQUEST_API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to create service request");
    return await response.json();
  } catch (error) {
    console.error("❌ Error creating service request:", error);
    throw error;
  }
};

//
// CHANGE MANAGEMENT APIs
//

export const fetchChanges = async () => {
  try {
    const response = await fetch(CHANGE_API_BASE_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch changes");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching changes:", error);
    throw error;
  }
};

export const submitChange = async (data) => {
  try {
    const response = await fetch(CHANGE_API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to submit change");
    return await response.json();
  } catch (error) {
    console.error("❌ Error submitting change:", error);
    throw error;
  }
};

export const updateChangeStatus = async (id, status) => {
  try {
    const response = await fetch(`${CHANGE_API_BASE_URL}/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Failed to update change status");
    return await response.json();
  } catch (error) {
    console.error("❌ Error updating change status:", error);
    throw error;
  }
};

export const fetchChangeById = async (id) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/changes/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch change details");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching change details:", error);
    throw error;
  }
};
// USER MANAGEMENT APIs
//

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error("Failed to update role");
    return await response.json();
  } catch (error) {
    console.error("❌ Error updating role:", error);
    throw error;
  }
};

export const updateUserStatus = async (id, active) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ active }),
    });
    if (!response.ok) throw new Error("Failed to update user status");
    return await response.json();
  } catch (error) {
    console.error("❌ Error updating user status:", error);
    throw error;
  }
};

export const resetUserPassword = async (userId, newPassword) => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/reset-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  return response.json();
};


//
// KNOWLEDGE BASE ARTICLE APIs
//

export const fetchKbArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/kb-articles`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch KB articles");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching KB articles:", error);
    throw error;
  }
};

export const saveKbArticle = async (article) => {
  try {
    const response = await fetch(`${API_BASE_URL}/kb-articles`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error("Failed to save article");
    return await response.json();
  } catch (error) {
    console.error("❌ Error saving KB article:", error);
    throw error;
  }
};

export const deleteKbArticle = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/kb-articles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete article");
    return await response.json();
  } catch (error) {
    console.error("❌ Error deleting KB article:", error);
    throw error;
  }
};


//
// EMAIL SETTINGS APIs
//

export const fetchEmailSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/email-settings`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to load email settings");
    return await response.json();
  } catch (error) {
    console.error("❌ Error loading email settings:", error);
    throw error;
  }
};

export const saveEmailSettings = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/email-settings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save email settings");
    return await response.json();
  } catch (error) {
    console.error("❌ Error saving email settings:", error);
    throw error;
  }
};


//
// SLA SETTINGS APIs
//

export const fetchSlaSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sla-settings`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch SLA settings");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching SLA settings:", error);
    throw error;
  }
};

export const saveSlaSettings = async (settings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sla-settings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error("Failed to save SLA settings");
    return await response.json();
  } catch (error) {
    console.error("❌ Error saving SLA settings:", error);
    throw error;
  }
};

//Fetch Audit logs

export const fetchAuditLogs = async () => {
  try {
    const response = await fetch("${process.env.REACT_APP_API_URL}/api/audit-logs", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch audit logs");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching audit logs:", error);
    throw error;
  }
};

// ✅ SYSTEM SETTINGS APIs

export const fetchSystemSettings = async () => {
  try {
    const response = await fetch("${process.env.REACT_APP_API_URL}/api/system-settings", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch system settings");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching system settings:", error);
    throw error;
  }
};

export const saveSystemSettings = async (settings) => {
  try {
    const response = await fetch("${process.env.REACT_APP_API_URL}/api/system-settings", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });

    if (!response.ok) throw new Error("Failed to save system settings");
    return await response.json();
  } catch (error) {
    console.error("❌ Error saving system settings:", error);
    throw error;
  }
};

//
// ROLES & PERMISSIONS APIs
//

export const fetchRoles = async () => {
  const response = await fetch("${process.env.REACT_APP_API_URL}/api/roles", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch roles");
  return await response.json();
};

export const fetchPermissions = async () => {
  const response = await fetch("${process.env.REACT_APP_API_URL}/api/permissions", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch permissions");
  return await response.json();
};

export const fetchRolePermissions = async (roleId) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roles/${roleId}/permissions`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch role permissions");
  return await response.json();
};

export const updateRolePermissions = async (roleId, permissionIds) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roles/${roleId}/permissions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ permissionIds }),
  });
  if (!response.ok) throw new Error("Failed to update role permissions");
  return await response.json();
};

export const fetchEmailTemplates = async () => {
  const response = await fetch("${process.env.REACT_APP_API_URL}/api/email-templates", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch templates");
  return await response.json();
};

export const saveEmailTemplate = async (template) => {
  const response = await fetch("${process.env.REACT_APP_API_URL}/api/email-templates", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(template),
  });
  if (!response.ok) throw new Error("Failed to save template");
  return await response.json();
};

export const deleteEmailTemplate = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/email-templates/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete template");
  return await response.json();
};

export const fetchTeams = async () => {
  try {
    const response = await fetch("${process.env.REACT_APP_API_URL}/api/teams", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch teams");
    return await response.json();
  } catch (err) {
    console.error("❌ Error fetching teams", err);
    throw err;
  }
};

export const createTeam = async (name) => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  const response = await fetch("${process.env.REACT_APP_API_URL}/api/teams", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });

  if (!response.ok) {
    throw new Error("Failed to create team");
  }

  return await response.json();
};


export const assignUserToTeam = async (userId, teamId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/team`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ team_id: teamId }),
    });

    if (!response.ok) throw new Error("Failed to assign user to team");
    return await response.json();
  } catch (error) {
    console.error("❌ Error assigning user to team:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await fetch("${process.env.REACT_APP_API_URL}/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Failed to create user");
    return await response.json();
  } catch (err) {
    console.error("❌ Error creating user", err);
    throw err;
  }
};

export const checkUserExists = async (username, email) => {
  const token = sessionStorage.getItem("token");

  const url = new URL("${process.env.REACT_APP_API_URL}/api/users/check");
  if (username) url.searchParams.append("username", username);
  if (email) url.searchParams.append("email", email);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to check user");
  }

  const data = await response.json();
  return data.exists;
};

// ✅ Fetch users from a specific team
export const fetchUsersByTeam = async (teamId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users?team_id=${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch team users");
  return res.json();
};

// ✅ Update assigned user for an incident
export const updateIncidentAssignee = async (incidentId, userId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents/${incidentId}/assign`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assigned_user_id: userId }),
  });
  if (!res.ok) throw new Error("Failed to reassign incident");
  return res.json();
};

export const updateIncidentTeam = async (incidentId, teamId) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents/${incidentId}/team`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamId }),
  });

  if (!res.ok) {
    throw new Error("Failed to update incident team");
  }

  return await res.json();
};

// Inside api.js
export const assignIncidentToMe = async (incidentId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/incidents/${incidentId}/assign-to-me`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to assign incident to me:", error);
    throw error;
  }
};




export { getAuthHeaders };
