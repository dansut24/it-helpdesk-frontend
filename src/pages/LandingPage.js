import React
import Header from '../components/Header';
import Footer from '../components/Footer';
 from 'react';
import '../styles/PageStyles.css';

const LandingPage = () => (
  <div className="page animated fadeIn">
    <h1>Welcome to Hi5Tech</h1>
    <p>Your one-stop ITSM platform to power your service delivery.</p>
    <img src="https://via.placeholder.com/600x300" alt="Landing Visual" className="image-fade" />
  </div>
);

export default LandingPage;