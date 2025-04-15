import React from "react";

const PreferencesStep = ({ next, prev }) => (
  <div>
    <h3>Set Preferences</h3>
    <p>Placeholder for set preferences form.</p>
    
    next && <button onClick={next}>Next</button>
  </div>
);

export default PreferencesStep;
