import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./Signup";

const Home = () => (
  <div style={{ padding: "2rem" }}>
    <h1>Welcome to Hi5Tech</h1>
    <p>Modern tools for growing teams.</p>
    <Link to="/signup">
      <button style={{ marginTop: "1rem" }}>Get Started Free</button>
    </Link>
  </div>
);

const LandingPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default LandingPage;