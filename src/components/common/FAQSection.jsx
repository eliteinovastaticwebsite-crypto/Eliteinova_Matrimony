import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { question: "How do I register on the matrimony website?", answer: "You can register by clicking the \"Register\" or \"Create Profile\" button and filling in your details such as name, age, gender, religion, mother tongue, education, profession, and contact information." },
    { question: "What features are available after registration?", answer: "After registration, you can create your profile, browse matches, and access basic features. Premium features (like viewing contact details or sending unlimited messages) are available with paid membership plans." },
    { question: "Can I create a profile for someone else (like my son, daughter, or sibling)?", answer: "Yes, Eliteinova matrimony sites allow you to create a profile on behalf of a family member or friend." },
    { question: "What information do I need to create a profile?", answer: "Basic details (personal info, education, occupation), family background, and partner preferences." },
    { question: "Can I edit my profile after registration?", answer: "Yes, you can log in anytime to update or modify your information and upload new photos." },
    { question: "How does the matchmaking system work?", answer: "Matches are generated based on your preferences (age, location, religion, caste, profession, etc.) and the information provided by other members." },
    { question: "Can I search for matches manually?", answer: "Yes, Eliteinova Matrimony site allow advanced filters so you can search by education, income, city, community, etc." },
    { question: "What is “Daily Matches” or “Recommended Matches”?", answer: "These are auto-suggested profiles sent Matches by the system based on your preferences." },
    { question: "Can I hide my profile from public searches?", answer: "Yes, privacy settings let limit visibility to specific users or make your profile invisible." },
    { question: "How can I contact another member?", answer: "After expressing interest or purchasing a premium plan, you can message or call verified members directly through the site." },
  ];

  return (
    <div id="faq-section" className="py-20 my-2 relative z-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500"> Eliteinova Matrimony FAQs</span>
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to the most common questions about using Eliteinova Matrimony.
          </p>
        </div>

        {/* FAQ List */}
        <div className="grid grid-cols-1 gap-6 relative z-10">
  {faqs.map((faq, index) => {
    const isOpen = openIndex === index;
    return (
      <div
        key={index}
        className={`border rounded-2xl transition-all duration-300 shadow-sm ${
          isOpen
            ? "border-red-400 bg-gradient-to-r from-red-50 to-yellow-50"
            : "border-gray-200 bg-white hover:border-red-200"
        }`}
      >
        <button
          type="button"
          onClick={() => toggleFAQ(index)}
          className="w-full flex justify-between items-center text-left px-6 py-4 cursor-pointer focus:outline-none"
        >
          <span className="font-semibold text-gray-800 text-lg pr-4">
            Q{index + 1}. {faq.question}
          </span>
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-red-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-red-500" />
          )}
        </button>

        {isOpen && (
          <div className="px-6 pb-5 border-t border-gray-100 pt-3">
            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
          </div>
        )}
      </div>
    );
  })}
</div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            to="/faqs"
            className="inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition"
          >
            View All FAQs →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
