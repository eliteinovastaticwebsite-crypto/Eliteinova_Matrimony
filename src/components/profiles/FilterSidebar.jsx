// src/components/profiles/FilterSidebar.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RotateCcw, SlidersHorizontal, Flag, Heart, ChevronLeft, ChevronRight, X, Send } from "lucide-react";
import Select from "react-select";
import profileService from "../../services/profileService";
import banner1 from "../../assets/banner1.png";

// Load Pacifico and Plus Jakarta Sans from Google Fonts
if (typeof document !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Pacifico&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(link);
}

// Theme configurations for FilterSidebar
const filterThemes = {
  silver: {
    primary: "#6B7280",
    background: "bg-white",
    border: "border border-gray-100",
    icon: "text-gray-500",
    button: "text-gray-600 hover:text-gray-700",
    boxBackground: "bg-gray-50/50 border-gray-100",
    boxTitle: "text-gray-700",
    focus: "focus:ring-gray-400 focus:border-gray-300",
  },
  gold: {
    primary: "#D97706",
    background: "bg-white",
    border: "border border-amber-100",
    icon: "text-amber-500",
    button: "text-amber-600 hover:text-amber-700",
    boxBackground: "bg-amber-50/50 border-amber-100",
    boxTitle: "text-amber-700",
    focus: "focus:ring-amber-400 focus:border-amber-300",
  },
  diamond: {
    primary: "#0EA5E9",
    background: "bg-white",
    border: "border border-blue-100",
    icon: "text-blue-500",
    button: "text-blue-600 hover:text-blue-700",
    boxBackground: "bg-blue-50/50 border-blue-100",
    boxTitle: "text-blue-700",
    focus: "focus:ring-blue-400 focus:border-blue-300",
  },
  default: {
    primary: "#EC4899",
    background: "bg-white",
    border: "border border-gray-100",
    icon: "text-pink-500",
    button: "text-pink-600 hover:text-pink-700",
    boxBackground: "bg-pink-50/50 border-pink-100",
    boxTitle: "text-pink-700",
    focus: "focus:ring-pink-400 focus:border-pink-300",
  },
};

// 📘 Indian States (same as before)
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// 📕 Districts mapping for some states (add more as needed)
const districtsByState = {
  "Tamil Nadu": [
    "Chennai",
    "Chengalpattu",
    "Kanchipuram",
    "Tiruvallur",
    "Vellore",
    "Tiruvannamalai",
    "Villupuram",
    "Cuddalore",
    "Pondicherry",
    "Salem",
    "Namakkal",
    "Erode",
    "Coimbatore",
    "Tiruppur",
    "Karur",
    "Dindigul",
    "Madurai",
    "Theni",
    "Sivaganga",
    "Ramanathapuram",
    "Virudhunagar",
    "Tenkasi",
    "Thoothukudi",
    "Kanniyakumari",
    "Nagapattinam",
    "Thanjavur",
    "Tiruchirappalli",
    "Perambalur",
    "Ariyalur",
    "Mayiladuthurai",
    "Krishnagiri",
    "Dharmapuri",
    "Nilgiris",
    "Kallakurichi",
    "Ariyalur",
  ],
  Kerala: [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
  ],
  Karnataka: [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Mangalore",
    "Tumakuru",
    "Dharwad",
    "Hubli-Dharwad",
    "Belagavi",
    "Ballari",
    "Hassan",
    "Mandya",
  ],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Tirupati",
    "Anantapur",
    "Kurnool",
    "Nellore",
  ],
  Telangana: [
    "Hyderabad",
    "Rangareddy",
    "Medchal-Malkajgiri",
    "Nizamabad",
    "Karimnagar",
    "Warangal",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Thane",
    "Nagpur",
    "Nashik",
    "Aurangabad",
    "Kolhapur",
  ],
  // Add more states/districts as you need
};

// 📗 Tamil Nadu Government Community Categories (Official Classification)
const communityCategories = [
  { value: "SC", label: "SC - Scheduled Castes" },
  { value: "ST", label: "ST - Scheduled Tribes" },
  { value: "BC", label: "BC - Backward Classes" },
  { value: "MBC", label: "MBC - Most Backward Classes" },
  { value: "BCM", label: "BCM - Backward Class Muslims" },
  { value: "DNC", label: "DNC - Denotified Communities" },
  { value: "GENERAL", label: "General / Others" },
];

// 📙 Caste/Subcaste data for each community category (Official Tamil Nadu Government Lists)
const communityCasteData = {
  SC: [
    "Adi Dravida",
    "Adi Andhra",
    "Arunthathiyar",
    "Ayyanavar",
    "Baira",
    "Bandi",
    "Chakkiliyan",
    "Chandala",
    "Cheruman",
    "Devendrakula Velalar",
    "Kadaiyan",
    "Kalladi",
    "Khojhal",
    "Madari",
    "Pallan",
    "Paraiyar",
    "Samban",
    "Thoti",
    "Others",
  ],
  ST: [
    "Adiyan",
    "Aranadan",
    "Eravallan",
    "Irular",
    "Kadar",
    "Kattunayakan",
    "Kurumans",
    "Malai Vedan",
    "Malasar",
    "Muthuvan",
    "Paniyan",
    "Toda",
    "Kota",
    "Others",
  ],
  BC: [
    "Agamudayar (including Thozhu / Thuluva Vellala)",
    "Archakarai Vellala",
    "Aryavathi",
    "Badagar",
    "Billava",
    "Bondil",
    "Boyar",
    "Chettiar (various sub-sects)",
    "Devangar",
    "Mudaliar",
    "Naidu",
    "Nadar",
    "Sengunthar",
    "Vellalar",
    "Viswakarma (Goldsmith, Carpenter, etc.)",
    "Yadava",
    "Arya Vysya",
    "Others",
  ],
  MBC: [
    "Ambalakarar",
    "Bestha / Siviar",
    "Boyar / Oddar",
    "Dasari",
    "Jogi / Jambuvanodai",
    "Kallar",
    "Kurumba / Kurumba Gounder",
    "Maravar",
    "Mutharaiyar",
    "Piramalai Kallar",
    "Vannar",
    "Vanniyar",
    "Andipandaram",
    "Kuravar",
    "Others",
  ],
  BCM: [
    "Ansar",
    "Dekkani Muslims",
    "Labbai (including Rowthar, Marakayar)",
    "Labbai",
    "Rowther",
    "Marakayar",
    "Mapilla",
    "Sheik",
    "Syed",
    "Others",
  ],
  DNC: [
    "Attur Kilnad Koravars",
    "Appanad Koravars",
    "Dommars",
    "Donga Boya",
    "Narikuravar",
    "Others",
  ],
  GENERAL: [
    "Brahmin (Iyer, Iyengar)",
    "Jain",
    "Sikh",
    "Christian (Forward communities not in BC list)",
    "Others",
  ],
};

// 📘 Indian Regions mapping (states grouped by regions)
const regionMapping = {
  "North": [
    "Jammu and Kashmir", "Himachal Pradesh", "Punjab", "Haryana",
    "Uttarakhand", "Delhi", "Chandigarh", "Ladakh"
  ],
  "South": [
    "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh",
    "Telangana", "Puducherry", "Lakshadweep", "Andaman and Nicobar Islands"
  ],
  "East": [
    "West Bengal", "Odisha", "Bihar", "Jharkhand",
    "Sikkim", "Assam", "Tripura", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Arunachal Pradesh"
  ],
  "West": [
    "Maharashtra", "Gujarat", "Goa", "Dadra and Nagar Haveli and Daman and Diu"
  ],
  "Central": [
    "Madhya Pradesh", "Chhattisgarh", "Uttar Pradesh", "Rajasthan"
  ]
};

// Helper function to get states by region
const getStatesByRegion = (region) => {
  return regionMapping[region] || [];
};

// Helper function to get all unique castes across all community categories
const getAllCastes = () => {
  const allCastes = new Set();
  Object.values(communityCasteData).forEach(casteList => {
    casteList.forEach(caste => {
      if (caste !== "Others") {
        allCastes.add(caste);
      }
    });
  });
  return Array.from(allCastes).sort();
};

// Helper function to get annual income options based on membership type
const getAnnualIncomeOptions = (membershipType) => {
  const commonOptions = [
    { value: "", label: "Annual Income (₹)" },
    { value: "0-2L", label: "0 - 2L" },
    { value: "2L-5L", label: "2L - 5L" },
    { value: "5L-10L", label: "5L - 10L" },
    { value: "10L-15L", label: "10L - 15L" },
    { value: "15L-20L", label: "15L - 20L" },
  ];

  const membershipTypeUpper = (membershipType || "SILVER").toUpperCase();

  if (membershipTypeUpper === "SILVER") {
    return [
      ...commonOptions,
      { value: "20L-50L", label: "20L - 50L" },
      { value: "50L-75L", label: "50L - 75L" },
      { value: "75L-1Cr", label: "75L to 1Cr" },
      { value: "1Cr+", label: "1Cr and Above" },
    ];
  } else if (membershipTypeUpper === "GOLD") {
    return [
      ...commonOptions,
      { value: "20L-50L", label: "20L - 50L" },
      { value: "50L-75L", label: "50L - 75L" },
      { value: "75L-1Cr", label: "75L to 1Cr" },
      { value: "1Cr-3Cr", label: "1Cr - 3Cr" },
      { value: "3Cr-5Cr", label: "3Cr - 5Cr" },
      { value: "5Cr+", label: "5Cr and Above" },
    ];
  } else if (membershipTypeUpper === "DIAMOND") {
    return [
      ...commonOptions,
      { value: "20L-50L", label: "20L - 50L" },
      { value: "50L-75L", label: "50L - 75L" },
      { value: "75L-1Cr", label: "75L to 1Cr" },
      { value: "1Cr-3Cr", label: "1Cr - 3Cr" },
      { value: "3Cr-5Cr", label: "3Cr - 5Cr" },
      { value: "5Cr-10Cr", label: "5Cr - 10Cr" },
      { value: "10Cr-20Cr", label: "10Cr - 20Cr" },
      { value: "20Cr+", label: "20Cr and Above" },
    ];
  }

  // Default fallback
  return [
    ...commonOptions,
    { value: "20L-50L", label: "20L - 50L" },
    { value: "50L-75L", label: "50L - 75L" },
    { value: "75L-1Cr", label: "75L to 1Cr" },
    { value: "1Cr+", label: "1Cr and Above" },
  ];
};

const professionOptions = [
  { value: "", label: "Select Occupation" },
  { value: "Occupation with own", label: "Occupation with own" },
  { value: "Software Engineer", label: "Software Engineer" },
  { value: "Doctor", label: "Doctor" },
  { value: "Nurse", label: "Nurse" },
  { value: "Pharmacist", label: "Pharmacist" },
  { value: "Teacher", label: "Teacher" },
  { value: "Professor", label: "Professor" },
  { value: "Business Owner", label: "Business Owner" },
  { value: "Entrepreneur", label: "Entrepreneur" },
  { value: "Government Employee", label: "Government Employee" },
  { value: "Bank Employee", label: "Bank Employee" },
  { value: "CA / Accountant", label: "CA / Accountant" },
  { value: "Marketing Specialist", label: "Marketing Specialist" },
  { value: "Sales Executive", label: "Sales Executive" },
  { value: "Self Employed", label: "Self Employed" },
  { value: "Construction Engineer", label: "Construction Engineer" },
  { value: "Mechanical Engineer", label: "Mechanical Engineer" },
  { value: "Civil Engineer", label: "Civil Engineer" },
  { value: "Electrical Engineer", label: "Electrical Engineer" },
  { value: "Lawyer", label: "Lawyer" },
  { value: "Police Officer", label: "Police Officer" },
  { value: "Army / Defence", label: "Army / Defence" },
  { value: "Fashion Designer", label: "Fashion Designer" },
  { value: "Graphic Designer", label: "Graphic Designer" },
  { value: "Artist", label: "Artist" },
  { value: "Actor / Actress", label: "Actor / Actress" },
  { value: "Chef", label: "Chef" },
  { value: "Hotel Management", label: "Hotel Management" },
  { value: "Driver", label: "Driver" },
  { value: "Farmer", label: "Farmer" },
  { value: "Not Working", label: "Not Working" },
  { value: "Other", label: "Other" },
];

// ─────────────────────────────────────────────
// ModalOverlay — uses ReactDOM.createPortal to render at document.body
// This is the ONLY reliable fix: escape the aside's stacking context entirely
// Same pattern as AuthModal which is why LoginForm has no bleed-through
// ─────────────────────────────────────────────
function ModalOverlay({ onClose, children }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const overlay = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // Portal to document.body — completely outside the aside's stacking context
  return ReactDOM.createPortal(overlay, document.body);
}

// ─────────────────────────────────────────────
// Report Modal
// ─────────────────────────────────────────────
function ReportModal({ onClose }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    "Fake / Duplicate Profile",
    "Inappropriate Content",
    "Harassment / Abuse",
    "Misleading Information",
    "Spam",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;
    setIsSubmitting(true);
    try {
      await profileService.submitReport({ reason, details });
      setSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      {/* Sticky header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f3f4f6", backgroundColor: "#ffffff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Flag size={16} className="text-orange-500" />
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "14px", color: "#1f2937", margin: 0 }}>
            Report a Profile
          </h3>
        </div>
        <button onClick={onClose} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
          <X size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ overflowY: "auto", backgroundColor: "#ffffff", flex: 1 }}>
        {submitted ? (
          <div className="text-center py-10 px-5">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-600 font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Report submitted. Thank you!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <option value="">Select a reason</option>
                {reportReasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Additional Details <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the issue..."
                rows={3}
                className="w-full border border-orange-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white resize-none focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300 placeholder-gray-400"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        )}
      </div>
    </ModalOverlay>
  );
}

// ─────────────────────────────────────────────
// Share Story Modal — same structure as ReportModal
// ─────────────────────────────────────────────
function ShareStoryModal({ onClose, onSubmitted }) {
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [message, setMessage] = useState("");
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo1Preview, setPhoto1Preview] = useState(null);
  const [photo2Preview, setPhoto2Preview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (e, setPhoto, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groomName || !brideName || !photo1) {
      setError("Please fill both names and upload at least 1 couple photo.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("groomName", groomName);
      formData.append("brideName", brideName);
      formData.append("message", message);
      formData.append("photo1", photo1);
      if (photo2) formData.append("photo2", photo2);
      await profileService.submitSuccessStory(formData);
      setSubmitted(true);
      setTimeout(() => onSubmitted(), 2000);
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      {/* Sticky header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f3f4f6", backgroundColor: "#ffffff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Heart size={16} fill="#EC4899" className="text-pink-500" />
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "14px", color: "#1f2937", margin: 0 }}>
            Share Your Success Story
          </h3>
        </div>
        <button onClick={onClose} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
          <X size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ overflowY: "auto", backgroundColor: "#ffffff", flex: 1 }}>
        {submitted ? (
          <div className="text-center py-10 px-5">
            <div className="text-5xl mb-3">💑</div>
            <p className="text-pink-600 font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Story submitted! Thank you for sharing 💍
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Names */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-600 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Groom's Name *
                </label>
                <input
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Groom's name"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300 placeholder-gray-400"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-600 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Bride's Name *
                </label>
                <input
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Bride's name"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300 placeholder-gray-400"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
            </div>

            {/* Couple Photos */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Couple Photos *{" "}
                <span className="font-normal text-gray-400">(up to 2 wedding photos)</span>
              </label>
              <div className="flex gap-3">
                {/* Photo 1 */}
                <label className="flex-1 block cursor-pointer">
                  <div
                    className="border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center bg-white transition-colors"
                    style={{
                      height: "100px",
                      borderColor: photo1Preview ? "#EC4899" : "#FBCFE8",
                    }}
                  >
                    {photo1Preview ? (
                      <div className="relative w-full h-full">
                        <img src={photo1Preview} alt="couple photo 1" className="w-full h-full object-cover" />
                        <span
                          className="absolute bottom-0 left-0 right-0 text-center text-[9px] text-white font-bold py-0.5"
                          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
                        >
                          Photo 1 ✓
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 px-2 py-3">
                        <span className="text-2xl">📷</span>
                        <span className="text-[10px] text-gray-400 text-center leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Couple Photo 1
                        </span>
                        <span className="text-[9px] text-pink-400 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Required
                        </span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => handlePhotoChange(e, setPhoto1, setPhoto1Preview)} />
                </label>

                {/* Photo 2 */}
                <label className="flex-1 block cursor-pointer">
                  <div
                    className="border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center bg-white transition-colors"
                    style={{
                      height: "100px",
                      borderColor: photo2Preview ? "#EC4899" : "#FBCFE8",
                    }}
                  >
                    {photo2Preview ? (
                      <div className="relative w-full h-full">
                        <img src={photo2Preview} alt="couple photo 2" className="w-full h-full object-cover" />
                        <span
                          className="absolute bottom-0 left-0 right-0 text-center text-[9px] text-white font-bold py-0.5"
                          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
                        >
                          Photo 2 ✓
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 px-2 py-3">
                        <span className="text-2xl">📷</span>
                        <span className="text-[10px] text-gray-400 text-center leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Couple Photo 2
                        </span>
                        <span className="text-[9px] text-gray-300 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Optional
                        </span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => handlePhotoChange(e, setPhoto2, setPhoto2Preview)} />
                </label>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a few words about your journey..."
                rows={3}
                className="w-full border border-pink-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white resize-none focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300 placeholder-gray-400"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Send size={14} />
              {isSubmitting ? "Submitting..." : "Submit Story"}
            </button>
          </form>
        )}
      </div>
    </ModalOverlay>
  );
}

// ─────────────────────────────────────────────
// Success Story Section
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Success Story Section
// ─────────────────────────────────────────────
function SuccessStorySection() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showShareForm, setShowShareForm] = useState(false);

  const fetchStories = async () => {
    try {
      const response = await profileService.getSuccessStories();
      if (response.success && response.stories && response.stories.length > 0) {
        setStories(response.stories);
      } else {
        setStories([]);
      }
    } catch (err) {
      console.error("Error fetching success stories:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(); }, []);

  useEffect(() => {
    if (stories.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [stories.length]);

  const prev = () => setActiveIndex((i) => (i - 1 + stories.length) % stories.length);
  const next = () => setActiveIndex((i) => (i + 1) % stories.length);
  const story = stories[activeIndex];

  return (
    <div className="flex-shrink-0 mb-2">
      <div className="bg-white border border-pink-200 rounded-lg shadow-sm px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={13} fill="#EC4899" className="text-pink-500 flex-shrink-0" />
          <div>
           <span className="text-sm font-black text-pink-600 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
  Success Stories
</span>
<p className="text-[11px] text-gray-400 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
  Share Your Success Stories Here!
</p>
{!loading && stories.length > 0 && (
  <p className="text-[11px] text-gray-400 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
    {stories.length} stories shared
  </p>
)}
          </div>
        </div>
        <button
          onClick={() => setShowShareForm(true)}
          className="flex-shrink-0 text-[11px] font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 px-3 py-1.5 rounded-lg transition-all shadow-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Share →
        </button>
      </div>

      {showShareForm && (
        <ShareStoryModal
          onClose={() => setShowShareForm(false)}
          onSubmitted={() => {
            setShowShareForm(false);
            setLoading(true);
            fetchStories();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main FilterSidebar
// ─────────────────────────────────────────────
export default function FilterSidebar({
  filters = {},
  onFilterChange,
  theme = "default",
  membershipType = "SILVER",
}) {
  const currentTheme = filterThemes[theme] || filterThemes.default;
  const [availableCategories, setAvailableCategories] = useState(communityCategories);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await profileService.getAllCategories();
        if (response.success && response.categories && response.categories.length > 0) {
          setAvailableCategories(response.categories);
          console.log("✅ Loaded categories from backend:", response.categories);
        } else {
          console.log("⚠️ Using default categories");
          setAvailableCategories(communityCategories);
        }
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        setAvailableCategories(communityCategories);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    if (value !== "Other" && value !== "Others") {
      const otherField = `${field}Other`;
      if (newFilters[otherField]) delete newFilters[otherField];
    }
    onFilterChange(newFilters);
  };

  const handleOtherChange = (field, value) => {
    onFilterChange({ ...filters, [`${field}Other`]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      gender: "", minAge: "", maxAge: "", religion: "", religionOther: "",
      community: "", caste: "", casteOther: "", subCaste: "", dosham: "",
      maritalStatus: "", region: "", education: "", educationOther: "",
      educationalQualification: "", educationalQualificationOther: "",
      certificateCourses: "", profession: "", occupation: "", occupationOther: "",
      employedIn: "", annualIncome: "", physicallyChallenged: "",
      location: "", country: "India", countryOther: "", state: "", district: "",
    });
  };

  const availableCastes = filters.community && filters.community !== "Other"
    ? (communityCasteData[filters.community] || []) : [];
  const districtOptions = districtsByState[filters.state] || [];
  const availableStates = filters.region
    ? indianStates.filter(state => getStatesByRegion(filters.region).includes(state))
    : indianStates;

  return (
    <>
      {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}

      <aside
  className="filter-sidebar-aside w-full md:w-80 sticky top-24 flex flex-col"
  style={{ minWidth: 0 }}
>
        {/* ── Eliteinova Wedding Services — compact like report box ── */}
<div className="flex-shrink-0 mb-2">
  <div className="bg-white border border-red-200 rounded-lg shadow-sm px-3 py-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
        E
      </div>
      <div>
        <span className="text-sm font-black text-red-600 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
  Eliteinova Wedding Services
</span>
<p className="text-[10px] text-yellow-500 font-semibold leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
  Your Complete Wedding Partner
</p>
      </div>
    </div>
    <a
      href="https://matrimonial-services.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 text-[11px] font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 py-1.5 rounded-lg transition-all shadow-sm"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      Register →
    </a>
  </div>
</div>

        {/* ── Report Profile — full width single row ── */}
        <div className="flex-shrink-0 mb-2">
          <div className="bg-white border border-orange-200 rounded-lg shadow-sm px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag size={13} className="text-orange-500 flex-shrink-0" />
              <div>
               <span className="text-sm font-black text-orange-600 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
  Report a Profile
</span>
<p className="text-[11px] text-gray-400 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
  Fake, suspicious or inappropriate?
</p>
              </div>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex-shrink-0 text-[11px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-3 py-1.5 rounded-lg transition-all shadow-sm"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Report →
            </button>
          </div>
        </div>

        {/* ── Success Stories ── */}
        <SuccessStorySection />

        {/* ── Filter Panel — frozen header + scrollable body ── */}
        <div className="flex flex-col bg-white rounded-lg shadow-lg border border-red-200">

          {/* 🔒 FROZEN header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 md:px-5 md:py-3.5 border-b border-red-100 bg-white">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-red-500" size={20} />
              <h2 className="text-base md:text-lg font-semibold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Search Filters
              </h2>
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* 📜 Scrollable filter content */}
          <div className="p-4 md:p-5">
            <div className="space-y-5">
              {/* PERSONAL DETAILS */}
              <FilterBox title="Personal Details">
                {/* <Select
                  value={filters.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  options={[
                    { value: "", label: "Looking for" },
                    { value: "Male", label: "Groom" },
                    { value: "Female", label: "Bride" },
                  ]}
                  theme={currentTheme}
                /> */}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Age Range
                  </label>
                  <div className="flex gap-2 w-full">
                    <Input type="number" placeholder="Min" value={filters.minAge || ""}
                      onChange={(e) => handleChange("minAge", e.target.value)} min="18" max="80" />
                    <Input type="number" placeholder="Max" value={filters.maxAge || ""}
                      onChange={(e) => handleChange("maxAge", e.target.value)} min="18" max="80" />
                  </div>
                </div>

                <CustomSelect
                  label="Religion"
                  value={filters.religion || ""}
                  onChange={(e) => {
                    const newFilters = { ...filters, religion: e.target.value };
                    if (e.target.value !== "Other") delete newFilters.religionOther;
                    onFilterChange(newFilters);
                  }}
                  options={[
                    { value: "", label: "Select Religion" },
                    { value: "Hindu", label: "Hindu" },
                    { value: "Muslim", label: "Muslim" },
                    { value: "Christian", label: "Christian" },
                    { value: "Sikh", label: "Sikh" },
                    { value: "Jain", label: "Jain" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                {filters.religion === "Other" && (
                  <Input label="Please specify religion" placeholder="Please specify religion"
                    value={filters.religionOther || ""} onChange={(e) => handleOtherChange("religion", e.target.value)} />
                )}

                <CustomSelect
                  label="Community Category"
                  value={filters.community || ""}
                  onChange={(e) => {
                    const newFilters = { ...filters, community: e.target.value };
                    delete newFilters.caste; delete newFilters.subCaste;
                    delete newFilters.casteOther; delete newFilters.communityOther;
                    if (e.target.value !== "Other") delete newFilters.communityOther;
                    onFilterChange(newFilters);
                  }}
                  options={[
                    { value: "", label: categoriesLoading ? "Loading..." : "Select Community Category" },
                    ...availableCategories.map((c) => ({ value: c.value || c, label: c.label || c })),
                    { value: "Other", label: "Other" },
                  ]}
                  disabled={categoriesLoading}
                />
                {filters.community === "Other" && (
                  <Input label="Please specify community category" placeholder="Please specify community category"
                    value={filters.communityOther || ""} onChange={(e) => handleOtherChange("community", e.target.value)} />
                )}

                {filters.community && (
                  <>
                    {filters.community === "Other" ? (
                      <Input label="Please specify caste/subcaste" placeholder="Please specify caste/subcaste"
                        value={filters.casteOther || ""} onChange={(e) => handleOtherChange("caste", e.target.value)} />
                    ) : (
                      <>
                        <CustomSelect
                          label="Caste / Subcaste"
                          value={filters.caste || ""}
                          onChange={(e) => {
                            const newFilters = { ...filters, caste: e.target.value, subCaste: e.target.value };
                            if (e.target.value !== "Others") delete newFilters.casteOther;
                            onFilterChange(newFilters);
                          }}
                          options={[
                            { value: "", label: "Select Caste/Subcaste" },
                            ...availableCastes.map((c) => ({ value: c, label: c })),
                          ]}
                        />
                        {filters.caste === "Others" && (
                          <Input label="Please specify caste/subcaste" placeholder="Please specify caste/subcaste"
                            value={filters.casteOther || ""} onChange={(e) => handleOtherChange("caste", e.target.value)} />
                        )}
                      </>
                    )}
                  </>
                )}

                <CustomSelect label="Dosham" value={filters.dosham || ""}
                  onChange={(e) => handleChange("dosham", e.target.value)}
                  options={[
                    { value: "", label: "Dosham" }, { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" }, { value: "Doesn't Matter", label: "Doesn't Matter" },
                  ]}
                />
                <CustomSelect label="Marital Status" value={filters.maritalStatus || ""}
                  onChange={(e) => handleChange("maritalStatus", e.target.value)}
                  options={[
                    { value: "", label: "Marital Status" }, { value: "Never Married", label: "Never Married" },
                    { value: "Divorced", label: "Divorced" }, { value: "Widowed", label: "Widowed" },
                    { value: "Separated", label: "Separated" },
                  ]}
                />
                <CustomSelect label="Physically Challenged" value={filters.physicallyChallenged || ""}
                  onChange={(e) => handleChange("physicallyChallenged", e.target.value)}
                  options={[
                    { value: "", label: "Physically Challenged" },
                    { value: "Yes", label: "Yes" }, { value: "No", label: "No" },
                  ]}
                />
              </FilterBox>

              {/* PROFESSIONAL DETAILS */}
              <FilterBox title="Professional Details">
                <CustomSelect label="Education" value={filters.education || ""}
                  onChange={(e) => handleChange("education", e.target.value)}
                  options={[
                    { value: "", label: "Select Education" }, { value: "High School", label: "High School" },
                    { value: "Diploma", label: "Diploma" }, { value: "Bachelor's", label: "Bachelor's" },
                    { value: "Master's", label: "Master's" }, { value: "PhD", label: "PhD" },
                    { value: "Vocational / ITI", label: "Vocational / ITI" }, { value: "Other", label: "Other" },
                  ]}
                />
                {filters.education === "Other" && (
                  <Input label="Please specify education" placeholder="Please specify education"
                    value={filters.educationOther || ""} onChange={(e) => handleOtherChange("education", e.target.value)} />
                )}

                <CustomSelect label="Educational Qualification" value={filters.educationalQualification || ""}
                  onChange={(e) => handleChange("educationalQualification", e.target.value)}
                  options={[
                    { value: "", label: "Educational Qualification" }, { value: "10th Pass", label: "10th Pass" },
                    { value: "12th Pass", label: "12th Pass" }, { value: "Diploma", label: "Diploma" },
                    { value: "Bachelor's Degree", label: "Bachelor's Degree" }, { value: "Master's Degree", label: "Master's Degree" },
                    { value: "M.Phil", label: "M.Phil" }, { value: "PhD", label: "PhD" },
                    { value: "Professional Degree (CA, CS, ICWA)", label: "Professional Degree (CA, CS, ICWA)" },
                    { value: "Engineering", label: "Engineering" },
                    { value: "Medical (MBBS, MD, etc.)", label: "Medical (MBBS, MD, etc.)" },
                    { value: "Law (LLB, LLM)", label: "Law (LLB, LLM)" }, { value: "Other", label: "Other" },
                  ]}
                />
                {filters.educationalQualification === "Other" && (
                  <Input label="Please specify educational qualification" placeholder="Please specify educational qualification"
                    value={filters.educationalQualificationOther || ""} onChange={(e) => handleOtherChange("educationalQualification", e.target.value)} />
                )}

                <Input label="Certificate Courses" placeholder="Certificate Courses"
                  value={filters.certificateCourses || ""} onChange={(e) => handleChange("certificateCourses", e.target.value)} />

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Occupation
                  </label>
                  <Select
                    value={professionOptions.find((p) => p.value === filters.occupation)}
                    onChange={(selected) => {
                      const value = selected?.value || "";
                      const newFilters = { ...filters, occupation: value };
                      if (value !== "Other") delete newFilters.occupationOther;
                      onFilterChange(newFilters);
                    }}
                    isSearchable={true}
                    options={professionOptions}
                    styles={{
                      control: (base) => ({ ...base, borderColor: "#FCA5A5", borderRadius: "0.5rem", minHeight: "40px", boxShadow: "none", "&:hover": { borderColor: "#EF4444" } }),
                      option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#EF4444" : state.isFocused ? "#FEE2E2" : "white", color: state.isSelected ? "white" : "#374151" }),
                    }}
                  />
                </div>
                {filters.occupation === "Other" && (
                  <Input label="Please specify occupation" placeholder="Please specify occupation"
                    value={filters.occupationOther || ""} onChange={(e) => handleOtherChange("occupation", e.target.value)} />
                )}

                <CustomSelect label="Employed In" value={filters.employedIn || ""}
                  onChange={(e) => handleChange("employedIn", e.target.value)}
                  options={[
                    { value: "", label: "Employed In" }, { value: "Private", label: "Private" },
                    { value: "Government", label: "Government" }, { value: "Business", label: "Business" },
                    { value: "Self Employed", label: "Self Employed" }, { value: "Not Working", label: "Not Working" },
                  ]}
                />
                <CustomSelect label="Annual Income" value={filters.annualIncome || ""}
                  onChange={(e) => handleChange("annualIncome", e.target.value)}
                  options={getAnnualIncomeOptions(membershipType)}
                />
              </FilterBox>

              {/* LOCATION DETAILS */}
              <FilterBox title="Location">
                <CustomSelect
                  label="Country"
                  value={filters.country || "India"}
                  onChange={(e) => {
                    const newFilters = { ...filters, country: e.target.value };
                    if (e.target.value !== "India") { delete newFilters.state; delete newFilters.district; }
                    if (e.target.value !== "Other") delete newFilters.countryOther;
                    onFilterChange(newFilters);
                  }}
                  options={[
                    { value: "India", label: "India" },
                    { value: "Sri Lanka", label: "Sri Lanka" },
                    { value: "Malaysia", label: "Malaysia" },
                    { value: "Singapore", label: "Singapore" },
                    { value: "Indonesia", label: "Indonesia" },
                    { value: "Myanmar", label: "Myanmar" },
                    { value: "Thailand", label: "Thailand" },
                    { value: "United Arab Emirates", label: "United Arab Emirates (UAE)" },
                    { value: "Saudi Arabia", label: "Saudi Arabia" },
                    { value: "Qatar", label: "Qatar" },
                    { value: "Kuwait", label: "Kuwait" },
                    { value: "Oman", label: "Oman" },
                    { value: "Bahrain", label: "Bahrain" },
                    { value: "South Africa", label: "South Africa" },
                    { value: "Mauritius", label: "Mauritius" },
                    { value: "Réunion", label: "Réunion (France)" },
                    { value: "Kenya", label: "Kenya" },
                    { value: "Tanzania", label: "Tanzania" },
                    { value: "Uganda", label: "Uganda" },
                    { value: "United Kingdom", label: "United Kingdom" },
                    { value: "France", label: "France" },
                    { value: "Germany", label: "Germany" },
                    { value: "Switzerland", label: "Switzerland" },
                    { value: "Netherlands", label: "Netherlands" },
                    { value: "Norway", label: "Norway" },
                    { value: "Sweden", label: "Sweden" },
                    { value: "Denmark", label: "Denmark" },
                    { value: "Canada", label: "Canada" },
                    { value: "United States", label: "United States" },
                    { value: "Australia", label: "Australia" },
                    { value: "New Zealand", label: "New Zealand" },
                    { value: "Guyana", label: "Guyana" },
                    { value: "Suriname", label: "Suriname" },
                    { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
                    { value: "Fiji", label: "Fiji" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                {filters.country === "Other" && (
                  <Input label="Please specify country" placeholder="Please specify country"
                    value={filters.countryOther || ""} onChange={(e) => handleOtherChange("country", e.target.value)} />
                )}

                {(filters.country === "India" || !filters.country) && (
                  <CustomSelect
                    label="State"
                    value={filters.state || ""}
                    onChange={(e) => {
                      const newFilters = { ...filters, state: e.target.value };
                      delete newFilters.district;
                      onFilterChange(newFilters);
                    }}
                    options={[
                      { value: "", label: filters.region ? `Select State (${filters.region})` : "Select State" },
                      ...availableStates.map((s) => ({ value: s, label: s })),
                    ]}
                  />
                )}

                {filters.state && districtOptions.length > 0 ? (
                  <CustomSelect label="District" value={filters.district || ""}
                    onChange={(e) => handleChange("district", e.target.value)}
                    options={[{ value: "", label: "Select District" }, ...districtOptions.map((d) => ({ value: d, label: d }))]}
                  />
                ) : filters.state ? (
                  <Input label="District" placeholder="District (type)"
                    value={filters.district || ""} onChange={(e) => handleChange("district", e.target.value)} />
                ) : null}
              </FilterBox>

              {/* FEEDBACK & SUGGESTIONS */}
              <FilterBox title="Feedback & Suggestions">
                <FeedbackForm />
              </FilterBox>
            </div>
          </div>
        </div>

        {/* Styles: story animation + mobile sidebar */}
        <style>{`
          @keyframes storyFade {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          /* Mobile: half-height filter bar with frozen header that still works */
          @media (max-width: 767px) {
            .filter-sidebar-aside {
              position: relative !important;
              top: 0 !important;
              max-height: none !important;
            }
            /* Give the filter panel a fixed half-viewport height on mobile */
            .filter-sidebar-aside .filter-panel-mobile {
              height: 50vh !important;
              min-height: 300px !important;
            }
          }
        `}</style>
      </aside>
    </>
  );
}

/* 🔹 Reusable Box Component — red/gold theme */
function FilterBox({ title, children }) {
  return (
    <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      <h3 className="text-md font-semibold text-red-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* 🔹 Feedback Form Component */
function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim() && !suggestions.trim()) {
      setSubmitMessage("Please provide at least feedback or suggestions");
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      const result = await profileService.submitFeedback(feedback, suggestions);
      if (result.success) {
        setSubmitMessage("Thank you for your feedback! We appreciate your input.");
        setFeedback("");
        setSuggestions("");
        setTimeout(() => setSubmitMessage(""), 5000);
      } else {
        setSubmitMessage(result.error || "Failed to submit feedback. Please try again.");
        setTimeout(() => setSubmitMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitMessage(error.message || "Failed to submit feedback. Please try again.");
      setTimeout(() => setSubmitMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your feedback..." rows={4}
          className="w-full border border-red-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-red-400 focus:border-red-300 transition-all placeholder-gray-400 resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Suggestions</label>
        <textarea value={suggestions} onChange={(e) => setSuggestions(e.target.value)}
          placeholder="Share your suggestions..." rows={4}
          className="w-full border border-red-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-red-400 focus:border-red-300 transition-all placeholder-gray-400 resize-none"
        />
      </div>
      {submitMessage && (
        <div className={`text-sm p-2 rounded ${submitMessage.includes("Thank you") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {submitMessage}
        </div>
      )}
      <button type="submit" disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed text-white" : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:opacity-90 shadow-md hover:shadow-lg"}`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}

/* 🔹 Styled Input Component */
function Input({ placeholder, label, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full min-w-0 border border-red-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-red-400 focus:border-red-300 transition-all placeholder-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}

/* 🔹 Styled Select Component */
function CustomSelect({ value, onChange, options, disabled, label }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label}
        </label>
      )}
      <select value={value} onChange={onChange} disabled={disabled}
        className="w-full border border-red-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-red-400 focus:border-red-300 transition-all disabled:bg-gray-100 disabled:text-gray-500"
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}