import React
import Header from '../components/Header';
import Footer from '../components/Footer';
 from 'react';
import '../styles/PageStyles.css';

const AboutPage = () => (
  <div className="page animated fadeIn">
    <h1>About Hi5Tech</h1>
    <p>We build modern ITSM platforms that empower teams to resolve incidents faster and manage services effortlessly.</p>
    <img src="https://via.placeholder.com/600x300" alt="About Hi5Tech" className="image-fade" />
  </div>
);

export default AboutPage;