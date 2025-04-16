// src/pages/CompanyStep.js
import React, { useState } from "react";
import { createTenant } from "../../api";

const CompanyStep = ({ onNext }) => {
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await createTenant({ companyName, subdomain });

      // Check for fetch failure or missing expected response
      if (!response || response.error || !response.tenantId) {
        console.error("❌ Response error or missing tenantId:", response);
        setError("Failed to create tenant. Check console for details.");
        return;
      }

      console.log("✅ Tenant created:", response);
      onNext(response.tenantId); // Proceed to Step 2
    } catch (err) {
      console.error("❌ Exception during company submission:", err);
      setError(`Unexpected error: ${err.message || "Check console"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Step 1: Company Info</h2>
      <label>
        Company Name:
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Desired Subdomain:
        <input
          type="text"
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          required
        />
      </label>
      <br />
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      <button type="submit">Next</button>
    </form>
  );
};

export default CompanyStep;
