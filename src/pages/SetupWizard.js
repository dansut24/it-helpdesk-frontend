import React, { useState } from "react";
import CompanyStep from "./pages/CompanyStep";
import TeamsStep from "./pages/TeamsStep";
import UsersStep from "./pages/UsersStep";
import PreferencesStep from "./pages/PreferencesStep";
import FinishStep from "./pages/FinishStep";

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
