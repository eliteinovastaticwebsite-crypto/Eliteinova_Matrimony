// src/pages/Contact.jsx - UPDATED (Clickable Cards)
import React, { useState } from "react";
import { contactService } from "../services/contactService";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon
} from "@heroicons/react/24/solid";

export default function Contact() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    subject: "",
    message: "" 
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await contactService.submitContact(form);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Contact form error:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Call Us",
      details: "+91 7845554882",
      subtitle: "Mon–Sun: 8AM - 10PM",
      color: "green",
      link: "tel:+91784554882",
    },
    {
      icon: EnvelopeIcon,
      title: "Email Us",
      details: "eliteinovamatrimony@gmail.com",
      subtitle: "We reply within 2 hours",
      color: "blue",
      link: "mailto:eliteinovamatrimony@gmail.com",
    },
    {
      icon: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.52 3.48A11.89 11.89 0 0012 0C5.37 0 .05 5.32.05 11.95c0 2.1.55 4.15 1.6 5.95L0 24l6.3-1.62c1.7.93 3.6 1.42 5.7 1.42h.02c6.63 0 12-5.32 12-11.95 0-3.19-1.25-6.19-3.5-8.17zM12 21.9c-1.7 0-3.34-.46-4.76-1.32l-.34-.2-3.74.96.97-3.64-.22-.36A8.29 8.29 0 013 11.95c0-4.6 4.07-8.33 9-8.33 2.4 0 4.66.93 6.36 2.62A8.25 8.25 0 0120.25 12c0 4.6-4.07 8.33-8.25 8.33z" />
          <path d="M17.5 14.8c-.3-.15-1.82-.9-2.1-1-.27-.1-.5-.15-.71.15-.21.3-.81 1-.99 1.2-.18.21-.36.24-.67.08-.31-.16-1.32-.49-2.5-1.53-.93-.83-1.56-1.86-1.74-2.17-.18-.3-.02-.46.13-.61.13-.12.31-.31.47-.47.16-.16.21-.27.31-.45.1-.18.04-.33-.02-.47-.06-.14-.7-1.68-.96-2.31-.25-.61-.51-.53-.71-.53-.18 0-.39-.02-.6-.02-.21 0-.54.08-.82.39-.27.31-1.05 1.02-1.05 2.48 0 1.45 1.09 2.86 1.25 3.06.16.21 2.16 3.3 5.23 4.63 3.13 1.36 3.13.91 3.69.85.56-.05 1.82-.74 2.08-1.45.27-.71.27-1.32.19-1.45-.07-.13-.27-.2-.57-.35z" />
        </svg>
      ),
      title: "Chat on WhatsApp",
      details: "+91 7845554882",
      subtitle: "Instant Support Available",
      color: "green",
      link: "https://api.whatsapp.com/send?phone=91784554882",
    },
    {
      icon: MapPinIcon,
      title: "Visit Us",
      details: "78, 1st street, Kumaran Colony, Vadapalani, Chennai-26, India",
      subtitle: "Come say hello!",
      color: "red",
    },
    {
      icon: ClockIcon,
      title: "Working Hours",
      details: "24/7 Support Available",
      subtitle: "For urgent matters",
      color: "purple",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: "bg-red-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
    };
    return colors[color] || "bg-red-500";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-12 px-6"> 
      
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Get In{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're here to help you find your perfect match. Reach out to us with any questions or concerns.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon;
              const CardWrapper = item.link ? "a" : "div";

              return (
                <CardWrapper
                  key={index}
                  href={item.link}
                  target={item.link?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-red-50 border border-gray-100 group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${getColorClasses(item.color)} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 font-medium">{item.details}</p>
                      <p className="text-gray-500 text-sm mt-1">{item.subtitle}</p>
                    </div>
                  </div>
                </CardWrapper>
              );
            })}

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Why Choose Us?</span>
              </h3>
              <div className="space-y-3">
                {[
                  "500+ Successful Matches",
                  "24/7 Customer Support",
                  "Verified Profiles Only",
                  "Secure & Private",
                ].map((stat, i) => (
                  <div key={i} className="flex items-center space-x-2 text-red-100">
                    <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-red-100 p-3 rounded-xl">
                  <PaperAirplaneIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Send us a message
                  </h3>
                  <p className="text-gray-600">
                    We'll get back to you as soon as possible
                  </p>
                </div>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 flex items-center space-x-3 animate-fadeIn">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="text-sm">We'll get back to you within 2 hours.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <div>
                    <p className="font-semibold">Something went wrong</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" disabled={loading} />
                  <Input label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" disabled={loading} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" disabled={loading} />
                  <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} required placeholder="What is this regarding?" disabled={loading} />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="6"
                    required
                    disabled={loading}
                    placeholder="Tell us how we can help you..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 transition-all duration-200 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="xl"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <PaperAirplaneIcon className="w-5 h-5" />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>

            {/* Map Section */}
            <div className="mt-8 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <MapPinIcon className="w-5 h-5 text-red-600" />
                <span>Find Us Here</span>
              </h3>
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <iframe
                  title="Company Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.31349991532!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzU3LjciTiA4MMKwMTYnMTQuNiJF!5e0!3m2!1sen!2sin!4v1688567890000!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </main>
  );
}
