import React from "react";

const features = [
  {
    title: "Incident Management",
    description: "Log, track, and resolve incidents fast — with automation, SLAs, and complete visibility.",
  },
  {
    title: "Self-Service Portal",
    description: "Empower end users with knowledge and request tools that are simple and intuitive.",
  },
  {
    title: "Automation & Workflows",
    description: "Eliminate repetitive tasks and boost response times with smart automations.",
  },
  {
    title: "Multi-Tenant Ready",
    description: "Onboard multiple clients or teams — each with isolated data, workflows, and branding.",
  },
];

const Features = () => (
  <section style={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "40px 20px",
    backgroundColor: "#f9f9f9"
  }}>
    {features.map((feature, index) => (
      <div key={index} style={{
        maxWidth: "300px",
        margin: "20px",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    ))}
  </section>
);

export default Features;