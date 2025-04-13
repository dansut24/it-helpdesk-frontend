import React, { useEffect, useState } from "react";
import { createIncident, getNextIncidentRef } from "../api";

const RaiseIncidentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
  });
  const [reference, setReference] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRef() {
      const ref = await getNextIncidentRef();
      if (ref) {
        setReference(ref);
      } else {
        setError("Error fetching reference number");
      }
    }
    fetchRef();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createIncident({ reference_number: reference, ...formData });
      if (onSubmit) onSubmit(result);
    } catch (err) {
      setError("Error submitting incident");
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RaiseIncidentForm;