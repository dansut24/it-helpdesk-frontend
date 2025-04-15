import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DemoPage = () => (
  <>
    <Header />
    <div style={ paddingTop: "5rem", minHeight: "80vh" }>
      <h2 style={{ textAlign: 'center' }}>Explore a demo of our ITSM system.</h2>
    </div>
    <Footer />
  </>
);

export default DemoPage;