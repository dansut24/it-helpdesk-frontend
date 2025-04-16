import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    if (menuOpen) {
      setClosing(true);
      setTimeout(() => {
        setMenuOpen(false);
        setClosing(false);
      }, 300);
    } else {
      setMenuOpen(true);
    }
  };

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled ? "#1f2d40" : "transparent",
      color: "white",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "background 0.3s ease"
    }}>
      <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Hi5Tek</Link>
      </div>

      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu} style={{ cursor: "pointer" }}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>

      {(menuOpen || closing) && (
        <div className={`overlay ${closing ? "fade-out" : "fade-in"}`}>
          <button onClick={toggleMenu} className="close-btn">&times;</button>
          <nav className="nav-links">
            <Link to="/" onClick={toggleMenu}>Home</Link>
            <Link to="/about" onClick={toggleMenu}>About</Link>
            <Link to="/services" onClick={toggleMenu}>Services</Link>
            <Link to="/signup" onClick={toggleMenu}>Sign Up</Link>
            <Link to="/demo" onClick={toggleMenu}>Demo</Link>
            <Link to="/contact" onClick={toggleMenu}>Contact</Link>
          </nav>
        </div>
      )}

      <style>{`
        .bar {
          width: 25px;
          height: 3px;
          background-color: white;
          margin: 4px 0;
          transition: 0.4s;
        }

        .hamburger.open .bar:nth-child(1) {
          transform: rotate(-45deg) translate(-5px, 6px);
        }
        .hamburger.open .bar:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open .bar:nth-child(3) {
          transform: rotate(45deg) translate(-5px, -6px);
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          z-index: 999;
        }

        .fade-in {
          animation: fadeIn 0.4s ease-in-out forwards;
        }

        .fade-out {
          animation: fadeOut 0.3s ease-in-out forwards;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          font-size: 2.5rem;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-size: 1.8rem;
          margin-top: -10vh;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          transition: color 0.3s ease;
          text-align: center;
        }
      `}</style>
    </header>
  );
};

export default Header;
