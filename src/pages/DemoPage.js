import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PageStyles.css';

const DemoPage = () => (
  <>
    <Header />
    <main className="page animated fadeIn">
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/laptop.png" alt="Live Demo" />
        <h2>Live Demo Access</h2>
        <p>Experience our platform in action. See how Hi5Tech handles real-world IT challenges.</p>
      </section>
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/presentation.png" alt="Features Preview" />
        <h2>Features Preview</h2>
        <p>Try the ticketing system, explore the knowledge base, and view analytics in a simulated environment.</p>
      </section>
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/view-file.png" alt="Try Hi5Tech" />
        <h2>Get a Feel for Hi5Tech</h2>
        <p>No sign-up required. Dive in and see how we simplify IT.</p>
      </section>
    </main>
    <Footer />
  </>
);

export default DemoPage;
