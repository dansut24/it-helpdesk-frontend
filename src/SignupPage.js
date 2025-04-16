import React
import Header from '../components/Header';
import Footer from '../components/Footer';
 from 'react';
import '../styles/PageStyles.css';

const SignupPage = () => (
  <div className="page animated fadeIn">
    <h1>Sign Up</h1>
    <p>Create your workspace to get started with Hi5Tech.</p>
    <img src="https://via.placeholder.com/600x300" alt="Signup Preview" className="image-fade" />
  </div>
);

export default SignupPage;