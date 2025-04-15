
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <>
      <Header />
      <main className="content">
        <section className="page-section">
          <h1>Contact Us</h1>
          <p>Get in touch with our team via email or live chat.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
