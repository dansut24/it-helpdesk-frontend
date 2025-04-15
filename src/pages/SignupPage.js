import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => (
  <>
    <Header />
    <div style={ paddingTop: "5rem", minHeight: "80vh" }>
      <h2 style={{ textAlign: 'center' }}>Create your account and start using Hi5Tek today.</h2>
    </div>
    <Footer />
  </>
);

export default SignupPage;