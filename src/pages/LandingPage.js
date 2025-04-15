import React from "react";
import { Routes, Route } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import SignupPage from "./SignupPage";
import DemoPage from "./DemoPage";

const Home = () => (
  <>
    <Hero />
    <Features />
  </>
);

const LandingPage = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default LandingPage;