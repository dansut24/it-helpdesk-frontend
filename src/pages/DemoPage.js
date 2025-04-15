import React from "react";

const DemoPage = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Explore the Demo</h2>
      <p>Experience the ITSM platform as your users would. This demo includes a full walk-through of the Hi5Tek system.</p>
      <a href="https://demo.hi5tech.co.uk" target="_blank" rel="noopener noreferrer" style={{
        display: "inline-block",
        marginTop: "1rem",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#27AE60",
        color: "white",
        textDecoration: "none",
        borderRadius: "4px"
      }}>Launch Demo</a>
    </div>
  );
};

export default DemoPage;