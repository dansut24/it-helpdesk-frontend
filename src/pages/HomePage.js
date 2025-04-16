// src/pages/HomePage.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="home-hero">
        <div className="hero-overlay">
          <h1 className="fade-slide-up">Welcome to Hi5Tech</h1>
          <p className="fade-slide-up delay-1">
            The future of smart IT management. Fast. Flexible. Powerful.
          </p>
          <div className="hero-buttons fade-slide-up delay-2">
            <a href="/services/itsm/signup" className="btn btn-primary">Get Started</a>
            <a href="/services/itsm/demo" className="btn btn-secondary">See Demo</a>
          </div>
        </div>
      </div>

      <section className="features-section">
        <h2 className="fade-slide-up">Why Choose Hi5Tech?</h2>
        <div className="features-grid">
          <div className="feature-card fade-slide-up delay-1">
            <img src="/images/feature1.png" alt="Incident Management" />
            <h3>Incident Management</h3>
            <p>Track, assign, and resolve issues faster with smart automation.</p>
          </div>
          <div className="feature-card fade-slide-up delay-2">
            <img src="/images/feature2.png" alt="Self-Service Portal" />
            <h3>Self-Service Portal</h3>
            <p>Empower users with a branded, intuitive portal for support.</p>
          </div>
          <div className="feature-card fade-slide-up delay-3">
            <img src="/images/feature3.png" alt="Team Collaboration" />
            <h3>Team Collaboration</h3>
            <p>Seamlessly collaborate with internal and external teams.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
