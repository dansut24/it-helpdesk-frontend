import React from "react";

const CompanyStep = ({ next, prev }) => (
  <div>
    <h3>Company Info</h3>
    <p>Placeholder for company info form.</p>
    
    next && <button onClick={next}>Next</button>
  </div>
);

export default CompanyStep;
