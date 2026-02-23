// src/components/profiles/FilterSidebar.jsx
import React, { useState, useEffect } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import Select from "react-select";
import profileService from "../../services/profileService";
import banner1 from "../../assets/banner1.png";

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

export default function FilterSidebar({
  filters = {},
  onFilterChange,
  theme = "default",
  membershipType = "SILVER", // Add membershipType prop
}) {
  const currentTheme = filterThemes[theme] || filterThemes.default;
  const [availableCategories, setAvailableCategories] = useState(communityCategories); // Default to hardcoded list
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from backend on component mount
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
        setAvailableCategories(communityCategories); // Fallback to default
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    // Clear custom "Other" value when field changes away from "Other"
    if (value !== "Other" && value !== "Others") {
      const otherField = `${field}Other`;
      if (newFilters[otherField]) {
        delete newFilters[otherField];
      }
    }
    onFilterChange(newFilters);
  };

  const handleOtherChange = (field, value) => {
    onFilterChange({ ...filters, [`${field}Other`]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      // Personal Details
      gender: "",
      minAge: "",
      maxAge: "",
      religion: "",
      religionOther: "",
      community: "",
      caste: "",
      casteOther: "",
      subCaste: "",
      dosham: "",
      maritalStatus: "",

      // Profile Information
      region: "",

      // Professional Details
      education: "",
      educationOther: "",
      educationalQualification: "",
      educationalQualificationOther: "",
      certificateCourses: "",
      profession: "",
      occupation: "",
      occupationOther: "",
      employedIn: "",
      annualIncome: "",
      
      // Personal Details - Additional
      physicallyChallenged: "",

      // Location Details
      location: "",
      country: "India",
      countryOther: "",
      state: "",
      district: "",
    });
  };

  // Determine available options based on selected community
  const availableCastes = filters.community && filters.community !== "Other" ? (communityCasteData[filters.community] || []) : [];
  const districtOptions = districtsByState[filters.state] || [];
  
  // Filter states by region if region is selected
  const availableStates = filters.region 
    ? indianStates.filter(state => getStatesByRegion(filters.region).includes(state))
    : indianStates;

  return (
    <aside className="w-full md:w-80 sticky top-24 max-h-[85vh] overflow-y-auto space-y-4">

      {/* ── Matrimony Registration Card ── */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-red-300 overflow-hidden">
        <div className="relative h-44 overflow-hidden">
          <img
            src={banner1}
            alt="Eliteinova Matrimony"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80";
            }}
          />
        </div>
        <div className="p-5">
          <h2
            className="text-2xl font-bold text-red-600 mb-1 text-center"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Eliteinova Matrimonial Services
          </h2>
          <h3
            className="text-lg font text-yellow-500 mb-4 text-center"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Your Complete Wedding Partner
          </h3>
          <a
            href="https://matrimonial-services.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-md font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg text-base flex items-center justify-center"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Register Now
          </a>
          <p
            className="text-gray-500 text-xs text-center mt-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Redirects to eliteinovamatrimonialservices.com
          </p>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <div className="bg-white rounded-lg shadow-lg border border-red-200 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="text-red-500" size={20} />
            <h2
              className="text-lg font-semibold text-gray-800"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
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

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Age"
                value={filters.minAge || ""}
                onChange={(e) => handleChange("minAge", e.target.value)}
                min="18"
                max="80"
              />
              <Input
                type="number"
                placeholder="Max Age"
                value={filters.maxAge || ""}
                onChange={(e) => handleChange("maxAge", e.target.value)}
                min="18"
                max="80"
              />
            </div>

            <CustomSelect
              value={filters.religion || ""}
              onChange={(e) => {
                const newFilters = { ...filters, religion: e.target.value };
                // Don't clear community/caste when religion changes
                if (e.target.value !== "Other") {
                  delete newFilters.religionOther;
                }
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
              <Input
                placeholder="Please specify religion"
                value={filters.religionOther || ""}
                onChange={(e) => handleOtherChange("religion", e.target.value)}
              />
            )}

            {/* Community Category Filter (Tamil Nadu Government Categories) */}
            <CustomSelect
              value={filters.community || ""}
              onChange={(e) => {
                const newFilters = { ...filters, community: e.target.value };
                delete newFilters.caste;
                delete newFilters.subCaste;
                delete newFilters.casteOther;
                delete newFilters.communityOther;
                if (e.target.value !== "Other") {
                  delete newFilters.communityOther;
                }
                onFilterChange(newFilters);
              }}
              options={[
                { value: "", label: categoriesLoading ? "Loading..." : "Select Community Category" },
                ...availableCategories.map((c) => ({
                  value: c.value || c,
                  label: c.label || c,
                })),
                { value: "Other", label: "Other" },
              ]}
              disabled={categoriesLoading}
            />
            {filters.community === "Other" && (
              <Input
                placeholder="Please specify community category"
                value={filters.communityOther || ""}
                onChange={(e) => handleOtherChange("community", e.target.value)}
              />
            )}

            {/* Caste/Subcaste Filter - shown when community is selected */}
            {filters.community && (
              <>
                {filters.community === "Other" ? (
                  <Input
                    placeholder="Please specify caste/subcaste"
                    value={filters.casteOther || ""}
                    onChange={(e) => handleOtherChange("caste", e.target.value)}
                  />
                ) : (
                  <>
                    <CustomSelect
                      value={filters.caste || ""}
                      onChange={(e) => {
                        const newFilters = { ...filters, caste: e.target.value };
                        // Set subCaste same as caste for backward compatibility
                        newFilters.subCaste = e.target.value;
                        if (e.target.value !== "Others") {
                          delete newFilters.casteOther;
                        }
                        onFilterChange(newFilters);
                      }}
                      options={[
                        { value: "", label: "Select Caste/Subcaste" },
                        ...availableCastes.map((c) => ({
                          value: c,
                          label: c,
                        })),
                      ]}
                    />
                    {filters.caste === "Others" && (
                      <Input
                        placeholder="Please specify caste/subcaste"
                        value={filters.casteOther || ""}
                        onChange={(e) => handleOtherChange("caste", e.target.value)}
                      />
                    )}
                  </>
                )}
              </>
            )}
            <CustomSelect
              value={filters.dosham || ""}
              onChange={(e) => handleChange("dosham", e.target.value)}
              options={[
                { value: "", label: "Dosham" },
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Doesn't Matter", label: "Doesn't Matter" },
              ]}
            />

            <CustomSelect
              value={filters.maritalStatus || ""}
              onChange={(e) => handleChange("maritalStatus", e.target.value)}
              options={[
                { value: "", label: "Marital Status" },
                { value: "Never Married", label: "Never Married" },
                { value: "Divorced", label: "Divorced" },
                { value: "Widowed", label: "Widowed" },
                { value: "Separated", label: "Separated" },
              ]}
            />

            <CustomSelect
              value={filters.physicallyChallenged || ""}
              onChange={(e) => handleChange("physicallyChallenged", e.target.value)}
              options={[
                { value: "", label: "Physically Challenged" },
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
          </FilterBox>

          {/* PROFESSIONAL DETAILS */}
          <FilterBox title="Professional Details">
            <CustomSelect
              value={filters.education || ""}
              onChange={(e) => handleChange("education", e.target.value)}
              options={[
                { value: "", label: "Select Education" },
                { value: "High School", label: "High School" },
                { value: "Diploma", label: "Diploma" },
                { value: "Bachelor's", label: "Bachelor's" },
                { value: "Master's", label: "Master's" },
                { value: "PhD", label: "PhD" },
                { value: "Vocational / ITI", label: "Vocational / ITI" },
                { value: "Other", label: "Other" },
              ]}
            />
            {filters.education === "Other" && (
              <Input
                placeholder="Please specify education"
                value={filters.educationOther || ""}
                onChange={(e) => handleOtherChange("education", e.target.value)}
              />
            )}

            <CustomSelect
              value={filters.educationalQualification || ""}
              onChange={(e) => handleChange("educationalQualification", e.target.value)}
              options={[
                { value: "", label: "Educational Qualification" },
                { value: "10th Pass", label: "10th Pass" },
                { value: "12th Pass", label: "12th Pass" },
                { value: "Diploma", label: "Diploma" },
                { value: "Bachelor's Degree", label: "Bachelor's Degree" },
                { value: "Master's Degree", label: "Master's Degree" },
                { value: "M.Phil", label: "M.Phil" },
                { value: "PhD", label: "PhD" },
                { value: "Professional Degree (CA, CS, ICWA)", label: "Professional Degree (CA, CS, ICWA)" },
                { value: "Engineering", label: "Engineering" },
                { value: "Medical (MBBS, MD, etc.)", label: "Medical (MBBS, MD, etc.)" },
                { value: "Law (LLB, LLM)", label: "Law (LLB, LLM)" },
                { value: "Other", label: "Other" },
              ]}
            />
            {filters.educationalQualification === "Other" && (
              <Input
                placeholder="Please specify educational qualification"
                value={filters.educationalQualificationOther || ""}
                onChange={(e) => handleOtherChange("educationalQualification", e.target.value)}
              />
            )}

            <Input
              placeholder="Certificate Courses"
              value={filters.certificateCourses || ""}
              onChange={(e) => handleChange("certificateCourses", e.target.value)}
            />

            <Select
              value={professionOptions.find(
                (p) => p.value === filters.occupation
              )}
              onChange={(selected) => {
                const value = selected?.value || "";
                const newFilters = { ...filters, occupation: value };
                if (value !== "Other") {
                  delete newFilters.occupationOther;
                }
                onFilterChange(newFilters);
              }}
              isSearchable={true}
              options={professionOptions}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#FCA5A5",
                  borderRadius: "0.5rem",
                  minHeight: "40px",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#EF4444" },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? "#EF4444"
                    : state.isFocused
                    ? "#FEE2E2"
                    : "white",
                  color: state.isSelected ? "white" : "#374151",
                }),
              }}
            />
            {filters.occupation === "Other" && (
              <Input
                placeholder="Please specify occupation"
                value={filters.occupationOther || ""}
                onChange={(e) => handleOtherChange("occupation", e.target.value)}
              />
            )}

            <CustomSelect
              value={filters.employedIn || ""}
              onChange={(e) => handleChange("employedIn", e.target.value)}
              options={[
                { value: "", label: "Employed In" },
                { value: "Private", label: "Private" },
                { value: "Government", label: "Government" },
                { value: "Business", label: "Business" },
                { value: "Self Employed", label: "Self Employed" },
                { value: "Not Working", label: "Not Working" },
              ]}
            />

            <CustomSelect
              value={filters.annualIncome || ""}
              onChange={(e) => handleChange("annualIncome", e.target.value)}
              options={getAnnualIncomeOptions(membershipType)}
            />
          </FilterBox>

          {/* LOCATION DETAILS */}
          <FilterBox title="Location">
            <CustomSelect
              value={filters.country || "India"}
              onChange={(e) => {
                const newFilters = { ...filters, country: e.target.value };
                if (e.target.value !== "India") {
                  delete newFilters.state;
                  delete newFilters.district;
                }
                if (e.target.value !== "Other") {
                  delete newFilters.countryOther;
                }
                onFilterChange(newFilters);
              }}
              options={[
                // South Asia
                { value: "India", label: "India" },
                { value: "Sri Lanka", label: "Sri Lanka" },
                
                // Southeast Asia
                { value: "Malaysia", label: "Malaysia" },
                { value: "Singapore", label: "Singapore" },
                { value: "Indonesia", label: "Indonesia" },
                { value: "Myanmar", label: "Myanmar" },
                { value: "Thailand", label: "Thailand" },
                
                // Middle East
                { value: "United Arab Emirates", label: "United Arab Emirates (UAE)" },
                { value: "Saudi Arabia", label: "Saudi Arabia" },
                { value: "Qatar", label: "Qatar" },
                { value: "Kuwait", label: "Kuwait" },
                { value: "Oman", label: "Oman" },
                { value: "Bahrain", label: "Bahrain" },
                
                // Africa
                { value: "South Africa", label: "South Africa" },
                { value: "Mauritius", label: "Mauritius" },
                { value: "Réunion", label: "Réunion (France)" },
                { value: "Kenya", label: "Kenya" },
                { value: "Tanzania", label: "Tanzania" },
                { value: "Uganda", label: "Uganda" },
                
                // Europe
                { value: "United Kingdom", label: "United Kingdom" },
                { value: "France", label: "France" },
                { value: "Germany", label: "Germany" },
                { value: "Switzerland", label: "Switzerland" },
                { value: "Netherlands", label: "Netherlands" },
                { value: "Norway", label: "Norway" },
                { value: "Sweden", label: "Sweden" },
                { value: "Denmark", label: "Denmark" },
                
                // North America
                { value: "Canada", label: "Canada" },
                { value: "United States", label: "United States" },
                
                // Oceania
                { value: "Australia", label: "Australia" },
                { value: "New Zealand", label: "New Zealand" },
                
                // Caribbean & South America
                { value: "Guyana", label: "Guyana" },
                { value: "Suriname", label: "Suriname" },
                { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
                { value: "Fiji", label: "Fiji" },
                
                { value: "Other", label: "Other" },
              ]}
            />
            {filters.country === "Other" && (
              <Input
                placeholder="Please specify country"
                value={filters.countryOther || ""}
                onChange={(e) => handleOtherChange("country", e.target.value)}
              />
            )}

            {(filters.country === "India" || !filters.country) && (
              <CustomSelect
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
              <CustomSelect
                value={filters.district || ""}
                onChange={(e) => handleChange("district", e.target.value)}
                options={[
                  { value: "", label: "Select District" },
                  ...districtOptions.map((d) => ({ value: d, label: d })),
                ]}
              />
            ) : filters.state ? (
              <Input
                placeholder="District (type)"
                value={filters.district || ""}
                onChange={(e) => handleChange("district", e.target.value)}
              />
            ) : null}
          </FilterBox>

          {/* FEEDBACK & SUGGESTIONS */}
          <FilterBox title="Feedback & Suggestions">
            <FeedbackForm />
          </FilterBox>
        </div>
      </div>
    </aside>
  );
}

/* 🔹 Reusable Box Component — red/gold theme */
function FilterBox({ title, children }) {
  return (
    <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      <h3 className="text-md font-semibold text-red-700 mb-3"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
    
    // Validate that at least one field is filled
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your feedback..."
          rows={4}
          className="w-full border border-red-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-red-400 focus:border-red-300 transition-all placeholder-gray-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Suggestions
        </label>
        <textarea
          value={suggestions}
          onChange={(e) => setSuggestions(e.target.value)}
          placeholder="Share your suggestions..."
          rows={4}
          className="w-full border border-red-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-red-400 focus:border-red-300 transition-all placeholder-gray-400 resize-none"
        />
      </div>

      {submitMessage && (
        <div className={`text-sm p-2 rounded ${
          submitMessage.includes("Thank you") 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {submitMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:opacity-90 shadow-md hover:shadow-lg"
        }`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}

/* 🔹 Styled Input Component — red/gold border */
function Input({ placeholder, ...props }) {
  return (
    <input
      {...props}
      className="w-full border border-red-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-red-400 focus:border-red-300 transition-all placeholder-gray-400"
      placeholder={placeholder}
    />
  );
}

/* 🔹 Styled Select Component — red/gold border */
function CustomSelect({ value, onChange, options, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border border-red-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-red-400 focus:border-red-300 transition-all disabled:bg-gray-100 disabled:text-gray-500"
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}