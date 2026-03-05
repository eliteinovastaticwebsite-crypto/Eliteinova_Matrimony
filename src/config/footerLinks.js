// src/config/footerLinks.js

// Navbar links
export const navLinks = [
  { path: "/", label: "Home" },
  { path: "/mobileapp", label: "MobileApp" },
  { path: "/aboutus", label: "AboutUs" },
  { path: "/faqs", label: "FAQs" },
  { path: "/services", label: "Services" },
  { path: "/upgrade", label: "Upgrade" },
  { path: "/privacypolicy", label: "Privacy-Policy" },
  { path: "/contact", label: "Contact Us" },
];

// Footer links
export const footerLinks = {
  quick: [
    { path: "/", label: "Home" },
    { action: "register", label: "Register" },  // opens register modal
    { action: "login",    label: "Login" },     // opens login modal
    { path: "/contact", label: "Contact Us" },
  ],
  services: [
    { path: "/search?type=brides", label: "Brides" },
    { path: "/search?type=grooms", label: "Grooms" },
    { path: "/upgrade", label: "Premium Plans" },
    { path: "/support", label: "Help & Support" },
  ],
  company: [
    { path: "/aboutus", label: "About Us" },
    { path: "/privacypolicy", label: "Privacy Policy" },
    { path: "/terms&conditions", label: "Terms & Conditions" },
    { path: "/faqs", label: "FAQ" },
  ],
  socials: [
    { path: "#", label: "Facebook" },
    { path: "#", label: "Twitter" },
    { path: "#", label: "Instagram" },
    { path: "#", label: "LinkedIn" },
  ],
};