import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage = () => (
  <>
    <Header />
    <div style={ paddingTop: "5rem", minHeight: "80vh" }>
      <h2 style={{ textAlign: 'center' }}>Have questions? Reach out to us.</h2>
    </div>
    <Footer />
  </>
);

export default ContactPage;