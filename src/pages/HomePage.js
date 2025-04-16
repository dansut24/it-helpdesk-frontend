import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => (
  <>
    <Header />
    <main className="page-content">
      <h1>Welcome to Hi5Tech</h1>
      <p>Your centralized platform for powerful ITSM tools, streamlined workflows, and enhanced team productivity.</p>
    </main>
    <Footer />
  </>
);

export default HomePage;
