import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
      <div className="hamburger" onClick={toggleMenu} style={{ cursor: "pointer" }}>
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

      {menuOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: "#1f2d40",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
          transition: "all 0.3s ease"
        }}>
          <button onClick={toggleMenu} style={{
            position: "absolute",
            top: "20px",
            right: "30px",
            fontSize: "2rem",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}>&times;</button>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2rem", fontSize: "1.5rem" }}>
            <Link to="/" onClick={toggleMenu} style={linkStyle}>Home</Link>
            <Link to="/services" onClick={toggleMenu} style={linkStyle}>Services</Link>
            <Link to="/signup" onClick={toggleMenu} style={linkStyle}>Sign Up</Link>
            <Link to="/demo" onClick={toggleMenu} style={linkStyle}>Demo</Link>
            <Link to="/contact" onClick={toggleMenu} style={linkStyle}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none"
};

export default Header;