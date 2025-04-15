import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <>
      <Header />
      <main className="page-content">
        <h1>Contact Us</h1>
        <p>Reach out to us anytime at support@hi5tech.co.uk or use the contact form below.</p>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;