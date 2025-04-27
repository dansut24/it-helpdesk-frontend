import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/865F7924-3016-4B89-8DF4-F881C33D72E6.png";

const Header = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`floating-header ${scrolled ? "scrolled" : ""}`}>
        <div className="logo-container">
          <Link to="/" className="brand">
            <img src={logo} alt="Hi5Tech Logo" />
            <span className="brand-name">Hi5Tech</span>
          </Link>
        </div>

        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>
      </header>

      {menuOpen && (
        <div className="dropdown-overlay">
          <div className="dropdown-content">
            <nav>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <img src="https://img.icons8.com/ios-filled/24/home.png" alt="Home" /> Home
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                <img src="https://img.icons8.com/ios-filled/24/info.png" alt="About" /> About
              </Link>
              <Link to="/services" onClick={() => setMenuOpen(false)}>
                <img src="https://img.icons8.com/ios-filled/24/services.png" alt="Services" /> Services
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <img src="https://img.icons8.com/ios-filled/24/plus-math.png" alt="Sign Up" /> Sign Up
              </Link>
              <Link to="/demo" onClick={() => setMenuOpen(false)}>
                <img src="https://img.icons8.com/ios-filled/24/monitor.png" alt="Demo" /> Demo
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                <img src="https://img.icons8.com/ios-filled/24/phone.png" alt="Contact" /> Contact
              </Link>
            </nav>
          </div>
        </div>
      )}

      <style>{`
        .floating-header {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          padding: 0.8rem 1.2rem;
          background: ${isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)"};
          border-radius: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1001;
          box-shadow: 0 0 20px ${isDark ? "rgba(0, 255, 255, 0.25)" : "rgba(0,0,0,0.1)"};
        }

        .logo-container .brand {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .logo-container img {
          height: 38px;
          margin-right: 0.5rem;
        }

        .brand-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: ${isDark ? "#fff" : "#111"};
        }

        .hamburger {
          width: 25px;
          height: 20px;
          position: relative;
          cursor: pointer;
          z-index: 1002;
        }

        .hamburger span {
          display: block;
          position: absolute;
          height: 3px;
          width: 100%;
          background: ${isDark ? "#fff" : "#111"};
          border-radius: 3px;
          opacity: 1;
          transition: all 0.3s ease-in-out;
        }

        .hamburger span:nth-child(1) {
          top: 0;
        }

        .hamburger span:nth-child(2) {
          top: 50%;
          transform: translateY(-50%);
        }

        .hamburger span:nth-child(3) {
          bottom: 0;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg);
          top: 50%;
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg);
          bottom: 50%;
        }

        .dropdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background: ${isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.95)"};
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 120px;
        }

        .dropdown-content {
          background: ${isDark ? "#101828" : "#ffffff"};
          border-radius: 20px;
          padding: 2rem;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 0 25px ${isDark ? "rgba(0, 255, 255, 0.3)" : "rgba(0,0,0,0.1)"};
        }

        .dropdown-content nav {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dropdown-content a {
          color: ${isDark ? "#fff" : "#111"};
          font-size: 1.25rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
        }

        .dropdown-content a img {
          height: 20px;
          filter: ${isDark ? "invert(1)" : "none"};
        }

        .dropdown-content a:hover {
          color: #38bdf8;
        }

        @media (min-width: 768px) {
          .hamburger {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
