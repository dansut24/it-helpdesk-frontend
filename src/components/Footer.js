import React from "react";

const Footer = () => (
  <footer style={{
    backgroundColor: "#f5f5f5",
    padding: "1rem 2rem",
    textAlign: "center",
    fontSize: "0.9rem",
    marginTop: "2rem"
  }}>
    <p>© {new Date().getFullYear()} Hi5Tech. All rights reserved.</p>
  </footer>
);

export default Footer;