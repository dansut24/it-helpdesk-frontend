import React, { useState } from "react";
import CompanyStep from "./setup/CompanyStep";
import TeamsStep from "./setup/TeamsStep";
import UsersStep from "./setup/UsersStep";
import PreferencesStep from "./setup/PreferencesStep";
import FinishStep from "./setup/FinishStep";

const SetupWizard = () => {
  const [step, setStep] = useState(1);

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  const steps = {
    1: <CompanyStep next={next} />,
    2: <TeamsStep next={next} prev={prev} />,
    3: <UsersStep next={next} prev={prev} />,
    4: <PreferencesStep next={next} prev={prev} />,
    5: <FinishStep />
  };

  return (
    <div className="setup-wizard">
      <h2>Setup Wizard - Step {step}</h2>
      {steps[step]}
    </div>
  );
};

export default SetupWizard;
