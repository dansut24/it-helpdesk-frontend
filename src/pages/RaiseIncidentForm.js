
import React, { useEffect, useState } from "react";
import { createIncident, reserveIncident } from "../api";

const RaiseIncidentForm = ({ renameTabAfterSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
  });
  const [reference, setReference] = useState("");
  const [incidentId, setIncidentId] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function reserveRef() {
      try {
        const res = await reserveIncident();
        if (res?.referenceNumber && res?.incidentId) {
          setReference(res.referenceNumber);
          setIncidentId(res.incidentId);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("❌ Failed to reserve incident:", err);
        setError("Error reserving incident number");
      }
    }
    reserveRef();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await createIncident({
        id: incidentId,
        reference_number: reference,
        ...formData,
      });

      const refNum = result?.referenceNumber || reference;
      const id = result?.id || incidentId;

      if (refNum && id) {
        alert("✅ Incident submitted successfully.");
        if (renameTabAfterSubmit) {
          renameTabAfterSubmit("New Incident", refNum, id);
        }
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error("❌ Error submitting incident:", err);
      setError("Failed to submit incident. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>{reference ? `New Incident - ${reference}` : "New Incident - Error"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <select name="priority" onChange={handleChange} required>
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Network">Network</option>
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Incident"}
        </button>
      </form>
    </div>
  );
};

export default RaiseIncidentForm;
