import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: "transparent",
      color: "white",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Hi5Tek</Link>
      </div>
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: "pointer" }}>
        <div style={{
          width: "25px",
          height: "3px",
          backgroundColor: "white",
          margin: "4px 0"
        }} />
        <div style={{
          width: "25px",
          height: "3px",
          backgroundColor: "white",
          margin: "4px 0"
        }} />
        <div style={{
          width: "25px",
          height: "3px",
          backgroundColor: "white",
          margin: "4px 0"
        }} />
      </div>
      <nav style={{
        position: "absolute",
        top: "60px",
        right: "20px",
        background: "#2D9CDB",
        borderRadius: "8px",
        padding: "1rem",
        display: menuOpen ? "flex" : "none",
        flexDirection: "column",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
      }}>
        <Link to="/" onClick={() => setMenuOpen(false)} style={linkStyle}>Home</Link>
        <Link to="/services" onClick={() => setMenuOpen(false)} style={linkStyle}>Services</Link>
        <Link to="/signup" onClick={() => setMenuOpen(false)} style={linkStyle}>Sign Up</Link>
        <Link to="/demo" onClick={() => setMenuOpen(false)} style={linkStyle}>Demo</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)} style={linkStyle}>Contact</Link>
      </nav>
    </header>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "0.5rem 0"
};

export default Header;