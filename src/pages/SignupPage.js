import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => (
  <>
    <Header />
    <div style={{ paddingTop: "5rem", minHeight: "80vh" }}>
      <h2 style={{ textAlign: 'center' }}>
        {
          "ContactPage": "Have questions? Reach out to us.",
          "DemoPage": "Explore a demo of our ITSM system.",
          "ServicesPage": "Our ITSM and support services are here to help your business run smoothly.",
          "SignupPage": "Create your account and start using Hi5Tek today."
        }["SignupPage"]
      </h2>
    </div>
    <Footer />
  </>
);

export default SignupPage;
