import React from 'react';
import { Link } from 'react-router-dom';

const ItsmLanding = () => (
  <div style={ padding: '2rem' }>
    <h1>ITSM Page</h1>
    <p>Welcome to the itsm section of Hi5Tek.</p>
    <Link to='/services/itsm/signup'>Get Started Free</Link>
    <br /><Link to='/services/itsm/demo'>View Demo</Link>
  </div>
);

export default ItsmLanding;