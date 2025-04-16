import React
import Header from '../components/Header';
import Footer from '../components/Footer';
 from 'react';
import '../styles/PageStyles.css';

const HomePage = () => (
  <div className="page animated fadeIn">
    <h1>Hi5Tech Platform</h1>
    <p>Modern, scalable, and intuitive ITSM designed for teams who move fast.</p>
    <img src="https://via.placeholder.com/600x300" alt="Home Visual" className="image-fade" />
  </div>
);

export default HomePage;