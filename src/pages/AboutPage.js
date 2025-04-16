
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PageStyles.css';

const AboutPage = () => (
  <>
    <Header />
    <main className="page animated fadeIn">
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/goal.png" alt="Mission Icon" />
        <h2>Our Mission</h2>
        <p>At Hi5Tech, we believe IT should be simple, powerful, and accessible. Our mission is to streamline operations and empower teams with cutting-edge ITSM tools.</p>
      </section>
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/star.png" alt="Why Choose Us Icon" />
        <h2>Why Choose Us</h2>
        <p>Hi5Tech combines modern design with powerful automation to help businesses reduce downtime and boost productivity.</p>
      </section>
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/team.png" alt="Team Icon" />
        <h2>The Team Behind Hi5Tech</h2>
        <p>We’re a team of developers, designers, and IT professionals passionate about transforming IT operations.</p>
      </section>
    </main>
    <Footer />
  </>
);

export default AboutPage;
