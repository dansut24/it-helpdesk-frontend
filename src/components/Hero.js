import React from "react";
import { Link } from "react-router-dom";

const Hero = () => (
  <header style={{
    backgroundColor: "#2D9CDB",
    color: "white",
    padding: "40px 20px",
    textAlign: "center"
  }}>
    <h1 style={{ fontSize: "2.8em", marginBottom: "10px" }}>
      Empowering Teams with Seamless IT Solutions
    </h1>
    <p style={{ fontSize: "1.2em" }}>
      Hi5Tek simplifies IT service management so your teams can collaborate, resolve issues faster, and stay focused on what matters.
    </p>
    <div style={{ marginTop: "20px" }}>
      <Link to="/signup" style={{
        textDecoration: "none",
        padding: "12px 24px",
        margin: "10px",
        borderRadius: "5px",
        color: "white",
        backgroundColor: "#27AE60",
        fontWeight: "bold",
        display: "inline-block"
      }}>
        Get Started Free
      </Link>
      <Link to="/demo" style={{
        textDecoration: "none",
        padding: "12px 24px",
        margin: "10px",
        borderRadius: "5px",
        color: "white",
        backgroundColor: "#27AE60",
        fontWeight: "bold",
        display: "inline-block"
      }}>
        Book a Demo
      </Link>
    </div>
  </header>
);

export default Hero;