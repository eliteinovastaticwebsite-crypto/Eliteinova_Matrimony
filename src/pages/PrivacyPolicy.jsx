// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 py-[15px]">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-md p-6 md:p-10 leading-relaxed text-gray-800">
        <h1 className="text-5xl font-extrabold text-center text-red-700 mb-8">
          Eliteinova Matrimony – Terms and Conditions
        </h1>

        <p className="text-center mb-10 text-3xl md:text-4xl font-extrabold tracking-wide">
          <span className="text-gray-900">Company Name:</span>{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Eliteinova Matrimony
          </span>
        </p>

        <p className="mb-6 text-base">
          By registering on or using Eliteinova Matrimony, you agree to follow these Terms and Conditions.
          Please read them carefully before creating your profile or using our services.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">1. Eligibility</h2>
        <div className="mb-6">
          <ul className="list-disc ml-6 mb-3">
            <li>21 years or older (for grooms)</li>
            <li>18 years or older (for brides)</li>
          </ul>
          <p>
            You must be legally single — unmarried, divorced, or widowed. Profiles created on behalf of another person (by parents,
            guardians, or relatives) must be done with that person's consent. We reserve the right to reject or
            remove any profile that does not meet eligibility criteria.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">2. Account Registration</h2>
        <p className="mb-6">
          You must provide accurate and complete information during registration. You are responsible for
          maintaining the confidentiality of your login credentials. Each user is allowed only one active
          account, and duplicate or fake profiles will be deleted. You agree to use the platform only for
          matrimonial purposes, not for dating or any commercial use.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">3. Profile Content Rules</h2>
        <p className="mb-6">
          All profile information, photos, and documents must be true and authentic. Photos must be clear and
          should not contain nudity, celebrities, or group images. We may request photo or KYC verification to
          confirm authenticity. Profiles containing false, offensive, or misleading information will be removed
          without notice.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">4. Personal Verification</h2>
        <p className="mb-6">
          To maintain trust and safety, members must complete mobile and email OTP verification. Submission of
          Government-approved ID (Aadhaar, PAN, Passport, etc.) may be required. Verified members will receive
          a "Verified" badge on their profiles. Providing fake information or documents may lead to account
          termination and possible legal action. While we verify member identities, we cannot guarantee 100%
          accuracy of user details.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">5. Membership Plans</h2>
        <p className="mb-6">
          Free membership allows basic profile access. Premium membership provides advanced features such as
          chat access, contact view, and interest requests. All payments for premium plans are non-refundable,
          except in case of technical issues verified by our team. Membership validity and benefits will be
          clearly mentioned in the plan details.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">6. Communication Policy</h2>
        <p className="mb-6">
          You consent to receive notifications, messages, and emails related to your account or matches. Members
          must maintain respectful communication with others. Any abusive, indecent, or harassing behavior may
          lead to suspension or termination of your account.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">7. Privacy and Data Security</h2>
        <p className="mb-6">
          Your personal data is protected under our Privacy Policy. We do not share your personal information
          (such as phone number or address) without your consent. Photos and data may be visible only to
          registered users within the platform. You can delete your profile anytime by contacting our support
          team.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">8. Responsibilities of Members</h2>
        <p className="mb-6">
          You are solely responsible for your interactions with other members. We recommend verifying details
          independently before meeting or making any commitments. Eliteinova Matrimony is not responsible for any
          loss, misunderstanding, or disputes between members.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">9. Termination of Account</h2>
        <p className="mb-6">
          Your account may be suspended or deleted if you post false or offensive content, misuse the platform
          for dating, marketing, or fraudulent activity, or violate these Terms and Conditions in any manner.
          You may also deactivate or permanently delete your profile at any time.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">10. Intellectual Property Rights</h2>
        <p className="mb-6">
          All website/app content, design, and materials are owned by Eliteinova Matrimony. Copying,
          reproducing, or using our content without permission is strictly prohibited.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">11. Limitation of Liability</h2>
        <p className="mb-6">
          Eliteinova Matrimony acts only as a platform to connect potential brides and grooms. We do not guarantee
          the success of any match or marriage. We are not liable for any damages, losses, or issues arising
          from user interactions.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">12. Modifications</h2>
        <p className="mb-6">
          We may update or change these Terms & Conditions anytime. Continued use of our platform implies that
          you accept the revised terms.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">13. Disclaimer</h2>
        <p className="mb-6">
          While Eliteinova Matrimony verifies the identity of its members, we cannot guarantee the accuracy of all
          personal information. Members are advised to exercise personal judgment and verify details
          independently before proceeding with any matrimonial discussions or commitments.
        </p>

        <h2 className="text-2xl font-bold text-red-800 mt-10 mb-3">Contact Information</h2>
        <p className="mb-6">
          📞 Phone:+91 7845554882<br />
          📧 Email: eliteinovamatrimony@gmail.com<br />
          🌐 Website: www.eliteinovamatrimony.com
        </p>

        <div className="mt-12 text-center">
          <Link to="/" className="text-red-700 font-semibold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
