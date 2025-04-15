
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
  return (
    <>
      <Header />
      <main className="content">
        <section className="page-section">
          <h1>Sign Up</h1>
          <p>Create your account to get started with Hi5Tek.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SignupPage;
