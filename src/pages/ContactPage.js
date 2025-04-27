import React, { useState } from "react";
import Header from "../components/Header";
import { useTheme } from "@mui/material/styles";

const ContactPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main
        style={{
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
          padding: "6rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Contact Us</h1>
        <p style={{ color: theme.palette.text.secondary, marginBottom: "2.5rem" }}>
          We're happy to hear from you. Send us a message below and we’ll get back to you shortly.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              background: theme.palette.background.paper,
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: theme.shadows[3],
            }}
          >
            {["name", "email", "subject"].map((field) => (
              <div key={field} style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Message</label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                border: "none",
                padding: "0.75rem 2rem",
                fontSize: "1rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Send Message
            </button>
          </form>
        ) : (
          <div style={{ fontSize: "1.5rem", color: theme.palette.success.main, marginTop: "2rem" }}>
            Thank you! Your message has been sent.
          </div>
        )}
      </main>
    </>
  );
};

export default ContactPage;
