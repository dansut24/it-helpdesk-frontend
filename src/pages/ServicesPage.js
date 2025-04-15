
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ServicesPage = () => {
  return (
    <>
      <Header />
      <main className="content">
        <section className="page-section">
          <h1>Our Services</h1>
          <p>Explore our ITSM platform, automation tools, and more.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage;
