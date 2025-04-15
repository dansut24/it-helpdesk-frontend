import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ServicesPage = () => (
  <>
    <Header />
    <div style={ paddingTop: "5rem", minHeight: "80vh" }>
      <h2 style={{ textAlign: 'center' }}>Our ITSM and support services are here to help your business run smoothly.</h2>
    </div>
    <Footer />
  </>
);

export default ServicesPage;