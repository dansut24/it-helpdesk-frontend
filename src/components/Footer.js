import React from "react";

const Footer = () => (
  <footer style={{
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#eee",
    fontSize: "0.9em"
  }}>
    <p>
      &copy; {new Date().getFullYear()} Hi5Tek. All rights reserved. |
      <a href="#" style={{ marginLeft: "10px", marginRight: "10px" }}>Privacy</a> |
      <a href="#">Terms</a> |
      Contact: support@hi5tek.io
    </p>
  </footer>
);

export default Footer;