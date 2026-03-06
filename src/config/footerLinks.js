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
  // renamed from "quick" — heading: "Eliteinova Matrimonial Services"
  quick: [
    { path: "/services#our-categories",    label: "Our Categories" },
    { path: "/services#portal-access",     label: "Portal Access" },
    { path: "/services#key-services",      label: "Our Key Services" },
    { path: "/services#why-choose",        label: "Why Choose Eliteinova" },
  ],
  // Premium section — "Help & Support" replaced with "Contact Us"
  premium: [
    { path: "/upgrade", label: "Silver" },
    { path: "/upgrade", label: "Gold" },
    { path: "/upgrade", label: "Diamond" },
    { path: "/contact", label: "Contact Us" },
  ],
  company: [
    { path: "/aboutus",           label: "About Us" },
    { path: "/privacypolicy",     label: "Privacy Policy" },
    { path: "/terms&conditions",  label: "Terms & Conditions" },
    { path: "/faqs",              label: "FAQ" },
  ],
  socials: [
    { path: "#", label: "Facebook" },
    { path: "#", label: "Twitter" },
    { path: "#", label: "Instagram" },
    { path: "#", label: "LinkedIn" },
  ],
};