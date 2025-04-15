
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DemoPage = () => {
  return (
    <>
      <Header />
      <main className="content">
        <section className="page-section">
          <h1>Live Demo</h1>
          <p>Experience the Hi5Tek ITSM system in real time.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DemoPage;
