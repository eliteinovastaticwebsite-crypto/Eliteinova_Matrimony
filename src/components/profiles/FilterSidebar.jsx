// src/components/profiles/FilterSidebar.jsx
import React from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import Select from "react-select";

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

// 📗 Religion-wise caste categories (unchanged)
const religionCategories = {
  Hindu: ["OBC", "BC", "MBC", "SC", "ST", "Others"],
  Muslim: ["General", "BC", "Others"],
  Christian: ["OC", "BC", "SC", "Others"],
};

// 📙 Caste data (unchanged from your expanded list)
const casteData = {
  Hindu: {
    OBC: [
      "Brahmin - Iyer",
      "Brahmin - Iyengar",
      "Chettiar",
      "Naidu",
      "Reddy",
      "Mudaliar",
      "Pillai",
      "Vellalar",
      "Others",
    ],
    BC: [
      "Isai Vellalar",
      "Udayar",
      "Vanniyakula Kshatriya",
      "Ambalakarar",
      "Servai",
      "Vannar",
      "Kuravar",
      "Thottia Naicker",
      "Others",
    ],
    MBC: [
      "Vanniyar",
      "Kongu Vellalar",
      "Gounder",
      "Nadar",
      "Thevar",
      "Yadava",
      "Naicker",
      "Kallar",
      "Agamudayar",
      "Maravar",
      "Others",
    ],
    SC: [
      "Paraiyar",
      "Pallar (Devendrakula Velalar)",
      "Arunthathiyar",
      "Chakkiliyar",
      "Sambavar",
      "Others",
    ],
    ST: ["Irula", "Kurumba", "Kattunayakan", "Toda", "Malayali", "Others"],
    Others: ["Others"],
  },

  Muslim: {
    General: ["Sunni", "Shia", "Pathan", "Memon", "Dawoodi Bohra", "Others"],
    BC: ["Labbai", "Rowther", "Marakkayar", "Ansari", "Others"],
    Others: ["Others"],
  },

  Christian: {
    OC: ["Roman Catholic", "Syrian Catholic", "CSI", "Marthoma", "Others"],
    BC: ["Pentecostal", "Protestant", "Evangelical", "Others"],
    SC: ["Dalit Christian", "Adi Dravidar Christian", "Others"],
    Others: ["Others"],
  },
};

// 📙 Subcaste data - Common subcastes for each caste
const subCasteData = {
  Hindu: {
    "Brahmin - Iyer": ["Iyer", "Iyer Vadama", "Iyer Brahacharanam", "Iyer Vathima", "Others"],
    "Brahmin - Iyengar": ["Iyengar Thenkalai", "Iyengar Vadakalai", "Others"],
    "Chettiar": ["Nagarathar", "Chettiar", "Others"],
    "Naidu": ["Naidu", "Balija Naidu", "Kapu Naidu", "Telaga Naidu", "Others"],
    "Reddy": ["Reddy", "Kapu Reddy", "Telaga Reddy", "Others"],
    "Mudaliar": ["Mudaliar", "Saiva Vellalar", "Others"],
    "Pillai": ["Pillai", "Saiva Pillai", "Others"],
    "Vellalar": ["Vellalar", "Kongu Vellalar", "Isai Vellalar", "Others"],
    "Vanniyar": ["Vanniyar", "Vanniyakula Kshatriya", "Padayachi", "Others"],
    "Gounder": ["Gounder", "Kongu Vellalar Gounder", "Others"],
    "Nadar": ["Nadar", "Shanar", "Others"],
    "Thevar": ["Thevar", "Mukkulathor", "Others"],
    "Yadava": ["Yadava", "Idaiyar", "Others"],
    "Naicker": ["Naicker", "Naidu Naicker", "Others"],
    "Kallar": ["Kallar", "Devendra Kula Vellalar", "Others"],
    "Agamudayar": ["Agamudayar", "Agamudaiyar", "Others"],
    "Maravar": ["Maravar", "Mukkulathor", "Others"],
    "Isai Vellalar": ["Isai Vellalar", "Others"],
    "Udayar": ["Udayar", "Others"],
    "Vanniyakula Kshatriya": ["Vanniyakula Kshatriya", "Vanniyar", "Others"],
    "Paraiyar": ["Paraiyar", "Adi Dravidar", "Others"],
    "Pallar (Devendrakula Velalar)": ["Pallar", "Devendrakula Vellalar", "Others"],
    "Arunthathiyar": ["Arunthathiyar", "Chakkiliyar", "Others"],
    "Chakkiliyar": ["Chakkiliyar", "Arunthathiyar", "Others"],
    "Sambavar": ["Sambavar", "Others"],
    "Sunni": ["Sunni", "Hanafi", "Shafi", "Others"],
    "Shia": ["Shia", "Twelver", "Ismaili", "Others"],
    "Roman Catholic": ["Roman Catholic", "Latin Catholic", "Syro-Malabar", "Others"],
    "Syrian Catholic": ["Syrian Catholic", "Syro-Malankara", "Others"],
    "CSI": ["CSI", "Church of South India", "Others"],
    "Marthoma": ["Marthoma", "Marthoma Syrian", "Others"],
    "Others": ["Others"],
  },
  Muslim: {
    "Sunni": ["Sunni", "Hanafi", "Shafi", "Maliki", "Hanbali", "Others"],
    "Shia": ["Shia", "Twelver", "Ismaili", "Others"],
    "Pathan": ["Pathan", "Pashtun", "Others"],
    "Memon": ["Memon", "Kutchi Memon", "Others"],
    "Dawoodi Bohra": ["Dawoodi Bohra", "Bohra", "Others"],
    "Labbai": ["Labbai", "Rowther", "Others"],
    "Rowther": ["Rowther", "Labbai", "Others"],
    "Marakkayar": ["Marakkayar", "Others"],
    "Ansari": ["Ansari", "Others"],
    "Others": ["Others"],
  },
  Christian: {
    "Roman Catholic": ["Roman Catholic", "Latin Catholic", "Syro-Malabar", "Syro-Malankara", "Others"],
    "Syrian Catholic": ["Syrian Catholic", "Syro-Malankara", "Others"],
    "CSI": ["CSI", "Church of South India", "Others"],
    "Marthoma": ["Marthoma", "Marthoma Syrian", "Others"],
    "Pentecostal": ["Pentecostal", "Assemblies of God", "Others"],
    "Protestant": ["Protestant", "Lutheran", "Others"],
    "Evangelical": ["Evangelical", "Others"],
    "Dalit Christian": ["Dalit Christian", "Adi Dravidar Christian", "Others"],
    "Adi Dravidar Christian": ["Adi Dravidar Christian", "Dalit Christian", "Others"],
    "Others": ["Others"],
  },
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

// Helper function to get all unique castes across all religions
const getAllCastes = () => {
  const allCastes = new Set();
  Object.values(casteData).forEach(religionData => {
    Object.values(religionData).forEach(casteList => {
      casteList.forEach(caste => {
        if (caste !== "Others") {
          allCastes.add(caste);
        }
      });
    });
  });
  return Array.from(allCastes).sort();
};

// Helper function to get all unique subcastes across all religions
const getAllSubCastes = () => {
  const allSubCastes = new Set();
  Object.values(subCasteData).forEach(religionData => {
    Object.values(religionData).forEach(subCasteList => {
      subCasteList.forEach(subCaste => {
        if (subCaste !== "Others") {
          allSubCastes.add(subCaste);
        }
      });
    });
  });
  return Array.from(allSubCastes).sort();
};

const professionOptions = [
  { value: "", label: "Select Occupation" },
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
}) {
  const currentTheme = filterThemes[theme] || filterThemes.default;

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      // Personal Details
      gender: "",
      minAge: "",
      maxAge: "",
      religion: "",
      category: "",
      caste: "",
      subCaste: "",
      dosham: "",
      maritalStatus: "",

      // Profile Information
      region: "",

      // Professional Details
      education: "",
      profession: "",
      occupation: "",
      employedIn: "",
      annualIncome: "",

      // Location Details
      location: "",
      country: "India",
      state: "",
      district: "",
    });
  };

  // Determine available options based on selected religion/category
  const availableCategories = religionCategories[filters.religion] || [];
  const availableCastes = casteData[filters.religion]?.[filters.category] || [];
  const availableSubCastes = subCasteData[filters.religion]?.[filters.caste] || [];
  const districtOptions = districtsByState[filters.state] || [];
  
  // Filter states by region if region is selected
  const availableStates = filters.region 
    ? indianStates.filter(state => getStatesByRegion(filters.region).includes(state))
    : indianStates;

  return (
    <aside
      className={`${currentTheme.background} rounded-2xl shadow-xl ${currentTheme.border} p-5 w-full md:w-80 sticky top-24 max-h-[85vh] overflow-y-auto`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className={currentTheme.icon} size={20} />
          <h2 className="text-lg font-semibold text-gray-800">
            Search Filters
          </h2>
        </div>
        <button
          onClick={resetFilters}
          className={`flex items-center gap-1 text-sm ${currentTheme.button} transition-all`}
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="space-y-5">
        {/* PERSONAL DETAILS */}
        <FilterBox title="Personal Details" theme={currentTheme}>
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
              theme={currentTheme}
            />
            <Input
              type="number"
              placeholder="Max Age"
              value={filters.maxAge || ""}
              onChange={(e) => handleChange("maxAge", e.target.value)}
              min="18"
              max="80"
              theme={currentTheme}
            />
          </div>

          <CustomSelect
            value={filters.religion || ""}
            onChange={(e) => {
              const newFilters = { ...filters, religion: e.target.value };
              delete newFilters.category;
              delete newFilters.caste;
              delete newFilters.subCaste;
              onFilterChange(newFilters);
            }}
            options={[
              { value: "", label: "Select Religion" },
              { value: "Hindu", label: "Hindu" },
              { value: "Muslim", label: "Muslim" },
              { value: "Christian", label: "Christian" },
            ]}
            theme={currentTheme}
          />

          {/* Category Filter (BC, OBC, MBC, SC, ST, etc.) */}
          {filters.religion && (
            <CustomSelect
              value={filters.category || ""}
              onChange={(e) => {
                const newFilters = { ...filters, category: e.target.value };
                delete newFilters.caste;
                delete newFilters.subCaste;
                onFilterChange(newFilters);
              }}
              options={[
                { value: "", label: "Select Category (BC/OBC/MBC/SC/ST)" },
                ...availableCategories.map((c) => ({ value: c, label: c })),
              ]}
              theme={currentTheme}
            />
          )}

          {/* Caste Filter */}
          {filters.religion && filters.category && (
            <CustomSelect
              value={filters.caste || ""}
              onChange={(e) => {
                const newFilters = { ...filters, caste: e.target.value };
                delete newFilters.subCaste;
                onFilterChange(newFilters);
              }}
              options={[
                { value: "", label: `Select Caste (${filters.category})` },
                ...(
                  casteData[filters.religion]?.[filters.category] || []
                ).map((c) => ({
                  value: c,
                  label: c,
                })),
              ]}
              theme={currentTheme}
            />
          )}

          {/* Subcaste Filter */}
          {filters.religion && filters.category && filters.caste && (
            <CustomSelect
              value={filters.subCaste || ""}
              onChange={(e) => handleChange("subCaste", e.target.value)}
              options={[
                { value: "", label: "Select Subcaste (Optional)" },
                ...availableSubCastes.map((sc) => ({
                  value: sc,
                  label: sc,
                })),
              ]}
              theme={currentTheme}
            />
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
            theme={currentTheme}
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
            theme={currentTheme}
          />
        </FilterBox>

        {/* PROFILE INFORMATION */}
        <FilterBox title="Profile Information" theme={currentTheme}>
          {/* Region Filter */}
          <CustomSelect
            value={filters.region || ""}
            onChange={(e) => {
              const newFilters = { ...filters, region: e.target.value };
              // If region is selected, optionally filter states by region
              // If region is cleared, don't clear state
              onFilterChange(newFilters);
            }}
            options={[
              { value: "", label: "Select Region" },
              { value: "North", label: "North" },
              { value: "South", label: "South" },
              { value: "East", label: "East" },
              { value: "West", label: "West" },
              { value: "Central", label: "Central" },
            ]}
            theme={currentTheme}
          />

          {/* Caste Filter - Standalone */}
          <CustomSelect
            value={filters.caste || ""}
            onChange={(e) => {
              const newFilters = { ...filters, caste: e.target.value };
              // Clear subCaste when caste changes
              if (e.target.value === "") {
                delete newFilters.subCaste;
              } else {
                delete newFilters.subCaste;
              }
              onFilterChange(newFilters);
            }}
            options={[
              { value: "", label: "Select Caste" },
              ...getAllCastes().map((c) => ({
                value: c,
                label: c,
              })),
            ]}
            theme={currentTheme}
          />

          {/* Sub Caste Filter - Standalone */}
          <CustomSelect
            value={filters.subCaste || ""}
            onChange={(e) => handleChange("subCaste", e.target.value)}
            options={[
              { value: "", label: "Select Sub Caste" },
              ...getAllSubCastes().map((sc) => ({
                value: sc,
                label: sc,
              })),
            ]}
            theme={currentTheme}
          />
        </FilterBox>

        {/* PROFESSIONAL DETAILS */}
        <FilterBox title="Professional Details" theme={currentTheme}>
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
            theme={currentTheme}
          />

          <Select
            value={professionOptions.find(
              (p) => p.value === filters.occupation
            )}
            onChange={(selected) =>
              handleChange("occupation", selected?.value || "")
            }
            isSearchable={true}
            options={professionOptions}
            theme={currentTheme}
          />

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
            theme={currentTheme}
          />

          <CustomSelect
            value={filters.annualIncome || ""}
            onChange={(e) => handleChange("annualIncome", e.target.value)}
            options={[
              { value: "", label: "Annual Income (₹ Lakhs)" },
              { value: "0-2", label: "0–2 LPA" },
              { value: "2-5", label: "2–5 LPA" },
              { value: "5-10", label: "5–10 LPA" },
              { value: "10-15", label: "10–15 LPA" },
              { value: "15-20", label: "15–20 LPA" },
              { value: "20+", label: "20+ LPA" },
            ]}
            theme={currentTheme}
          />
        </FilterBox>

        {/* LOCATION DETAILS */}
        <FilterBox title="Location" theme={currentTheme}>
          <CustomSelect
            value={filters.country || "India"}
            onChange={(e) => {
              const newFilters = { ...filters, country: e.target.value };
              if (e.target.value !== "India") {
                delete newFilters.state;
                delete newFilters.district;
              }
              onFilterChange(newFilters);
            }}
            options={[
              { value: "India", label: "India" },
              { value: "Other", label: "Other" },
            ]}
            theme={currentTheme}
          />

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
              theme={currentTheme}
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
              theme={currentTheme}
            />
          ) : filters.state ? (
            <Input
              placeholder="District (type)"
              value={filters.district || ""}
              onChange={(e) => handleChange("district", e.target.value)}
              theme={currentTheme}
            />
          ) : null}
        </FilterBox>
      </div>
    </aside>
  );
}

/* 🔹 Reusable Box Component */
function FilterBox({ title, children, theme }) {
  return (
    <div
      className={`${theme.boxBackground} rounded-xl p-4 hover:shadow-md transition-all duration-200`}
    >
      <h3 className={`text-md font-semibold ${theme.boxTitle} mb-3`}>
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* 🔹 Styled Input Component */
function Input({ placeholder, theme, ...props }) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 ${theme.focus} transition-all placeholder-gray-400`}
      placeholder={placeholder}
    />
  );
}

/* 🔹 Styled Select Component */
function CustomSelect({ value, onChange, options, theme }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 ${theme.focus} transition-all`}
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
