import React from "react";
import { useThemeMode } from "../context/ThemeContext";

const Footer = () => {
  const { mode, setMode } = useThemeMode();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>Hi5Tech</h3>
          <p style={styles.text}>Modern ITSM platform for agile teams.</p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.subheading}>Quick Links</h4>
          <ul style={styles.links}>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/signup">Sign Up</a></li>
            <li><a href="/demo">Demo</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div style={styles.section}>
          <h4 style={styles.subheading}>Theme</h4>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={styles.select}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div style={styles.bottom}>
        <p style={{ fontSize: "0.8em", color: "#aaa" }}>
          &copy; {new Date().getFullYear()} Hi5Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#101828",
    color: "#fff",
    padding: "40px 20px 20px",
    fontFamily: "sans-serif",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
    gap: "2rem",
  },
  section: {
    flex: "1 1 250px",
    minWidth: "250px",
  },
  heading: {
    color: "#38bdf8",
    fontSize: "1.5em",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "1.1em",
    marginBottom: "10px",
    color: "#f3f4f6",
  },
  text: {
    fontSize: "0.95em",
    color: "#ccc",
  },
  links: {
    listStyle: "none",
    padding: 0,
    lineHeight: "1.8",
    fontSize: "0.95em",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#1f2937",
    color: "#fff",
  },
  bottom: {
    borderTop: "1px solid #1f2d40",
    marginTop: "30px",
    paddingTop: "15px",
    textAlign: "center",
  },
};

export default Footer;
