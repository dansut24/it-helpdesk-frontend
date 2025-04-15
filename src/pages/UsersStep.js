import React from "react";

const UsersStep = ({ next, prev }) => (
  <div>
    <h3>Add Users</h3>
    <p>Placeholder for add users form.</p>
    
    next && <button onClick={next}>Next</button>
  </div>
);

export default UsersStep;
