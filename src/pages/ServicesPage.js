
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PageStyles.css';

const ServicesPage = () => (
  <>
    <Header />
    <main className="page animated fadeIn">
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/alarm.png" alt="Incident Management" />
        <h2>Incident Management</h2>
        <p>Log, track, and resolve incidents efficiently with customizable workflows.</p>
      </section>
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/online-support.png" alt="Service Requests" />
        <h2>Service Requests</h2>
        <p>Empower end users to request services through a clean, user-friendly portal.</p>
      </section>
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/available-updates.png" alt="Change Management" />
        <h2>Change Management</h2>
        <p>Plan, assess, and track changes to minimize disruption.</p>
      </section>
      <section className="info-section">
        <img src="https://img.icons8.com/clouds/100/book.png" alt="Knowledge Base" />
        <h2>Knowledge Base</h2>
        <p>Publish articles and guides to help teams self-serve and resolve common issues.</p>
      </section>
    </main>
    <Footer />
  </>
);

export default ServicesPage;
