import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import { TabProvider } from './context/TabContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const isTenant = window.location.hostname.includes('-itsm.');

if (isTenant) {
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <TabProvider>
          <App />
        </TabProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <LandingPage />
    </React.StrictMode>
  );
}