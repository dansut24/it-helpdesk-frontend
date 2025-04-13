const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const getNextIncidentRef = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incidents/next-ref`);
    const data = await response.json();
    return data.reference_number;
  } catch (error) {
    console.error("Error fetching next incident reference:", error);
    return null;
  }
};

export const createIncident = async (incidentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incidents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidentData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating incident:", error);
    throw error;
  }
};