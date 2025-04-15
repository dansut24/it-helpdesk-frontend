// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Improved tenant subdomain check (e.g., demo-itsm.hi5tech.co.uk or acme-itsm.hi5tech.co.uk)
const hostname = window.location.hostname;
const isTenant = hostname.includes('-itsm.') || hostname.startsWith('demo-itsm') || hostname.endsWith('.vercel.app'); // for preview testing

if (isTenant) {
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    </React.StrictMode>
  );
}
