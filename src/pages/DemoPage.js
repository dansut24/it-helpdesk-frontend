import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
 from 'react';
import '../styles/PageStyles.css';

const DemoPage = () => (
  <div className="page animated fadeIn">
    <h1>Experience the Demo</h1>
    <p>Explore our ITSM platform with a live demonstration.</p>
    <img src="https://via.placeholder.com/600x300" alt="Demo Preview" className="image-fade" />
  </div>
);

export default DemoPage;
