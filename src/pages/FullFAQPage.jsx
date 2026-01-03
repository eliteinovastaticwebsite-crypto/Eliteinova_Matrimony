import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const FullFAQPage = ({ onOpenRegister }) => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      navigate("/");
    }
  };

  const faqs = [
    { question: "How do I register on the matrimony website?", answer: "You can register by clicking the \"Register\" or \"Create Profile\" button and filling in your details such as name, age, gender, religion, mother tongue, education, profession, and contact information." },
    { question: "What features are available after registration?", answer: "After registration, you can create your profile, browse matches, and access basic features. Premium features (like viewing contact details or sending unlimited messages) are available with paid membership plans." },
    { question: "Can I create a profile for someone else (like my son, daughter, or sibling)?", answer: "Yes, many matrimony sites allow you to create a profile on behalf of a family member or friend." },
    { question: "What information do I need to create a profile?", answer: "Basic details (personal info, education, occupation), family background, lifestyle preferences, and partner preferences." },
    { question: "Can I edit my profile after registration?", answer: "Yes, you can log in anytime to update or modify your information and upload new photos." },
    { question: "How does the matchmaking system work?", answer: "Matches are generated based on your preferences (age, location, religion, caste, profession, etc.) and the information provided by other members." },
    { question: "Can I search for matches manually?", answer: "Yes, most sites allow advanced filters so you can search by education, income, city, community, etc." },
    { question: "What is \"Daily Matches\" or \"Recommended Matches\"?", answer: "These are auto-suggested profiles sent to you daily by the system based on your preferences." },
    { question: "Can I hide my profile from public searches?", answer: "Yes, privacy settings let you limit visibility to specific users or make your profile invisible." },
    { question: "How can I contact another member?", answer: "After expressing interest or purchasing a premium plan, you can message or call verified members directly through the site." },
    { question: "Are my contact details visible to all users?", answer: "No, your contact info is protected. It becomes visible only when you choose to share it or with premium verified users." },
    { question: "Can I block or report a user?", answer: "Yes, if you receive inappropriate messages or requests, you can block or report that user for review." },
    { question: "How do I ensure my privacy is protected?", answer: "Matrimony websites use encryption, verification, and privacy controls to safeguard your data. Avoid sharing personal details publicly." },
    { question: "What are the benefits of a premium membership?", answer: "Premium members can: View contact details, Send unlimited interests/messages, Appear higher in search results, Access verified profiles, and Get a dedicated relationship manager (in premium+ tiers)." },
    { question: "What payment methods are accepted?", answer: "You can usually pay via debit/credit card, UPI, Paytm, net banking, or international payment gateways." },
    { question: "Is my payment information secure?", answer: "Yes, payments are processed through secure, SSL-encrypted gateways." },
    { question: "Can I cancel my paid membership?", answer: "You can stop auto-renewal anytime, but partial refunds are usually not provided once a plan is activated." },
    { question: "How are profiles verified?", answer: "Websites verify mobile number, email, photo, and government ID for authenticity." },
    { question: "How do I avoid fake profiles?", answer: "Check for verified badges, complete profiles, and interact cautiously before sharing personal info or meeting." },
    { question: "What should I do if I suspect a fraud profile?", answer: "Report the profile immediately using the \"Report\" button or contact customer support." },
    { question: "What is Assisted Matrimony or Relationship Manager service?", answer: "A personal manager helps you find matches, screen candidates, and coordinate communication on your behalf." },
    { question: "I forgot my password. How can I recover it?", answer: "Click \"Forgot Password\" on the login page to reset it using your registered email or phone number." },
    { question: "Can I delete or deactivate my profile?", answer: "Yes, you can choose \"Delete/Deactivate Profile\" from account settings if you've found a match or wish to leave." },
    { question: "What if I need help using the site?", answer: "Contact customer care via email, chat, or helpline for assistance." },
    { question: "Can I share my success story?", answer: "Yes, many sites invite couples to submit their marriage success stories and photos for publication." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Navigation buttons in body */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Go back to previous page"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden md:inline">Back to Home</span>
          </button>

          <button
            onClick={handleRegisterClick}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            aria-label="Register"
          >
            Register
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
          Full <span className="text-red-600">FAQ List</span>
        </h1>

      <div className="grid grid-cols-1 gap-6">
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
                className="w-full flex justify-between items-center text-left px-6 py-4 cursor-pointer"
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
      </div>
    </div>
  );
};

export default FullFAQPage;
