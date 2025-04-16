import React
import Header from '../components/Header';
import Footer from '../components/Footer';
 from 'react';
import '../styles/PageStyles.css';

const ServicesPage = () => (
  <div className="page animated fadeIn">
    <h1>Our Services</h1>
    <ul>
      <li>Incident Management</li>
      <li>Service Request Automation</li>
      <li>Change Management</li>
    </ul>
    <img src="https://via.placeholder.com/600x300" alt="Services Overview" className="image-fade" />
  </div>
);

export default ServicesPage;