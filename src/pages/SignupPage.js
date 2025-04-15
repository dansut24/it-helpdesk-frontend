import React from "react";

const SignupPage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Create Your Hi5Tek Account</h2>
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        <input type="text" placeholder="Company Name" required />
        <input type="email" placeholder="Email Address" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" style={{
          padding: "0.75rem",
          backgroundColor: "#2D9CDB",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;