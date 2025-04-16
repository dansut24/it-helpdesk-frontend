import React, { useState } from "react";
import { createTenant } from "../../api";

const CompanyStep = ({ onNext }) => {
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  const handleNext = async () => {
    try {
      const response = await createTenant({ companyName, subdomain });
      if (!response || response.error) {
        throw new Error(response?.error || "Unknown error");
      }
      console.log("✅ Company created:", response);
      onNext();
    } catch (err) {
      console.error("❌ Exception during company submission:", err);
      alert(`Error submitting company: ${err.message}`);
    }
  };

  return (
    <div className="setup-step">
      <h2>Company Details</h2>
      <p>Let's start by setting up your company's workspace.</p>

      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Acme Inc."
          required
        />
      </div>

      <div className="form-group">
        <label>Choose Subdomain</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            placeholder="your-company"
            required
            style={{ flex: 1 }}
          />
          <span style={{ marginLeft: 8 }}>.hi5tech.co.uk</span>
        </div>
      </div>

      <button onClick={handleNext} className="primary-button">
        Continue
      </button>
    </div>
  );
};

export default CompanyStep;