import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DemoPage = () => {
  return (
    <>
      <Header />
      <main className="page-content">
        <h1>Live Demo</h1>
        <p>Experience Hi5Tech's ITSM platform in action. Launch the demo environment and explore features.</p>
      </main>
      <Footer />
    </>
  );
};

export default DemoPage;