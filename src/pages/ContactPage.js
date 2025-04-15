import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add fetch/axios logic here to send the formData
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="contact-container">
        <h1>Contact Us</h1>
        <p>We're happy to hear from you. Send us a message below and we’ll get back to you shortly.</p>
        {!submitted ? (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" rows={5} value={formData.message} onChange={handleChange} required />
            </div>
            <button type="submit">Send Message</button>
          </form>
        ) : (
          <div className="success-message">Thank you! Your message has been sent.</div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
