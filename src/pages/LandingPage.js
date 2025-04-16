import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './LandingStyles.css';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <>
    <Header />
    <main className="landing">
      <section className="hero">
        <h1 className="fade-in">Modern ITSM for Agile Teams</h1>
        <p className="fade-in">Streamline incidents, service requests, and more—all from one place.</p>
        <div className="cta-buttons">
          <Link to="/services/itsm/signup" className="btn primary">Get Started</Link>
          <Link to="/services/itsm/demo" className="btn secondary">View Demo</Link>
        </div>
      </section>
      <section className="features slide-in">
        <div className="feature">
          <h3>Incident Management</h3>
          <p>Quickly capture, assign, and resolve incidents.</p>
        </div>
        <div className="feature">
          <h3>Self-Service Portal</h3>
          <p>Empower users to find answers and raise requests.</p>
        </div>
        <div className="feature">
          <h3>Automation</h3>
          <p>Automate repetitive tasks and accelerate resolution times.</p>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default LandingPage;
