import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header style={{
    backgroundColor: "#222",
    color: "#fff",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}>
    <h2 style={{ margin: 0 }}>Hi5Tech</h2>
    <nav>
      <Link to="/" style={{ color: "#fff", marginRight: "1rem", textDecoration: "none" }}>Home</Link>
      <Link to="/signup" style={{ color: "#fff", textDecoration: "none" }}>Sign Up</Link>
    </nav>
  </header>
);

export default Header;