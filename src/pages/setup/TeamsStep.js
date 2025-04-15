import React from "react";

const TeamsStep = ({ next, prev }) => (
  <div>
    <h3>Create Teams</h3>
    <p>Placeholder for create teams form.</p>
    
    next && <button onClick={next}>Next</button>
  </div>
);

export default TeamsStep;
