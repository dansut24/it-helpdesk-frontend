// src/data/kbArticles.js

const kbArticles = [
    {
      id: "kb001",
      title: "How to Reset Your Password",
      category: "Security & Access",
      content: `To reset your password, go to the login page and click "Forgot Password". Follow the instructions sent to your company email.`,
    },
    {
      id: "kb002",
      title: "Setting Up Company Email on Mobile",
      category: "Email & Communication",
      content: `To set up your email, go to your phone's settings > Mail > Add Account > Exchange, and enter your company email credentials.`,
    },
    {
      id: "kb003",
      title: "Troubleshooting Wi-Fi Issues",
      category: "Network & Wi-Fi",
      content: `Make sure you're connected to the correct SSID. Restart your device. If the issue persists, contact IT support.`,
    },
    {
      id: "kb004",
      title: "Installing Software via Company Portal",
      category: "Software & Applications",
      content: `Open the Company Portal app, sign in with your company account, browse the list of available apps, and click Install.`,
    },
    {
      id: "kb005",
      title: "Understanding Multi-Factor Authentication",
      category: "Security & Access",
      content: `Multi-Factor Authentication (MFA) requires both your password and a second method (like a phone app) to verify your identity.`,
    },
  ];
  
  // Sample incident, request, and change data for search (normally fetched from API)
  export const sampleIncidents = [
    { id: "INC1001", title: "Email not working" },
    { id: "INC1002", title: "VPN connection failed" },
  ];
  
  export const sampleRequests = [
    { id: "SR2001", title: "Request new laptop" },
    { id: "SR2002", title: "Install Adobe Acrobat" },
  ];
  
  export const sampleChanges = [
    { id: "CH3001", title: "Upgrade server firmware" },
    { id: "CH3002", title: "Deploy updated company app" },
  ];
  
  export default kbArticles;