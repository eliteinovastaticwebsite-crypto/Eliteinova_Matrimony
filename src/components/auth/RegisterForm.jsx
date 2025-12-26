// src/components/auth/RegisterForm.jsx (UPDATED VERSION)
import React, { useState } from "react";
import Stepper from "../ui/Stepper";
import StepperController from "../ui/StepperControl";
import FloatingInput from "../ui/FloatingInput";
import { useAuth } from "../../context/AuthContext";
import Select from "react-select";

export default function RegisterForm({
  isInModal = false,
  onRegisterSuccess,
  onSwitch,
  onClose,
}) {
  const { register } = useAuth(); // MOVED TO TOP LEVEL
  const inModal = isInModal || !!onRegisterSuccess || !!onSwitch || !!onClose;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1: Basic Info
    profileFor: "Myself",
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",

    // Step 2: Personal Details
    gender: "",
    dob: "",
    age: "",
    partnerAgeMin: "",
    partnerAgeMax: "",
    email: "",

    // Step 3: Religion Details
    religion: "Hindu",
    motherTongue: "",
    willingOtherCaste: false,
    caste: "MBC",
    subcaste: "Vanniyar",
    dosham: "No",

    // Step 4: Family Background
    maritalStatus: "Single",
    childrenCount: "0",
    childrenWithYou: false,
    height: "5.6",
    familyStatus: "Middle Class",
    familyType: "Joint",

    // Step 5: Professional Details
    education: "Bachelor's",
    specialization: "",
    employedIn: "Private",
    occupation: "",
    annualIncome: "5-10 L",
    address: "",
    city: "",
    district: "",
    pincode: "",
    state: "",
    country: "India",

    // Step 6: About & Files
    about: "",
    photos: [],
    aadhar: null,
    membershipType: "SILVER", // Default to Silver
  });

  const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

// ------------- Districts Mapping -------------
const districtsByState = {
  "Tamil Nadu": [
    "Chennai","Chengalpattu","Kanchipuram","Tiruvallur","Vellore","Tiruvannamalai",
    "Villupuram","Cuddalore","Pondicherry","Salem","Namakkal","Erode",
    "Coimbatore","Tiruppur","Karur","Dindigul","Madurai","Theni",
    "Sivaganga","Ramanathapuram","Virudhunagar","Tenkasi","Thoothukudi","Kanniyakumari",
    "Nagapattinam","Thanjavur","Tiruchirappalli","Perambalur","Ariyalur","Mayiladuthurai",
    "Krishnagiri","Dharmapuri","Nilgiris","Kallakurichi"
  ],
  Kerala: [
    "Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam",
    "Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode",
    "Wayanad","Kannur","Kasaragod"
  ],
  Karnataka: [
    "Bengaluru Urban","Bengaluru Rural","Mysuru","Mangalore","Tumakuru",
    "Dharwad","Hubli-Dharwad","Belagavi","Ballari","Hassan","Mandya"
  ],
  "Andhra Pradesh": [
    "Visakhapatnam","Vijayawada","Guntur","Tirupati","Anantapur","Kurnool","Nellore"
  ],
  Telangana: [
    "Hyderabad","Rangareddy","Medchal-Malkajgiri","Nizamabad",
    "Karimnagar","Warangal"
  ],
  Maharashtra: [
    "Mumbai","Pune","Thane","Nagpur","Nashik","Aurangabad","Kolhapur"
  ],
};

// ------------ Religion & Caste ------------
const religionCategories = {
  Hindu: ["OBC", "BC", "MBC", "SC", "ST", "Others"],
  Muslim: ["General", "BC", "Others"],
  Christian: ["OC", "BC", "SC", "Others"],
};

const casteData = {
  Hindu: {
    OBC: ["Brahmin - Iyer", "Brahmin - Iyengar", "Chettiar", "Naidu", "Reddy", "Mudaliar", "Pillai", "Vellalar", "Others"],
    MBC: ["Vanniyar", "Kongu Vellalar", "Gounder", "Nadar", "Thevar", "Yadava", "Naicker", "Kallar", "Agamudayar", "Maravar", "Others"],
    BC: ["Isai Vellalar", "Udayar", "Vanniyakula Kshatriya", "Ambalakarar", "Servai", "Vannar", "Kuravar", "Thottia Naicker", "Others"],
    SC: ["Paraiyar", "Pallar (Devendrakula Velalar)", "Arunthathiyar", "Chakkiliyar", "Sambavar", "Others"],
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

// ------------ Profession Options ------------
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

  const steps = [
    "Register",
    "Basic Details",
    "Religion Details",
    "Personal Details",
    "Professional Details",
    "About Yourself",
  ];

  const getStepHeading = () => {
    const stepHeadings = {
      1: "Create Your Account",
      2: "Basic Details",
      3: "Religion & Community",
      4: "Personal Information",
      5: "Professional Details",
      6: "About Yourself & Documents",
    };
    return stepHeadings[step] || `Step ${step}`;
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    )
      age--;
    return age;
  };

  const formatMobileNumber = (value) => value.replace(/\D/g, "").slice(0, 10);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "mobile") processedValue = formatMobileNumber(value);
    setForm((prev) => ({ ...prev, [name]: processedValue }));

    if (name === "dob" && value) {
      const age = calculateAge(value);
      setForm((prev) => ({ ...prev, age: age.toString() }));
    }

    if (validationErrors[name])
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const handleCheckbox = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setError("");

    const validFiles = files.filter((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} too large`);
          return false;
        }
        return true;
      } else if (file.type === "application/pdf") {
        if (file.size > 10 * 1024 * 1024) {
          setError(`File ${file.name} too large`);
          return false;
        }
        return true;
      } else {
        setError(`File ${file.name} not supported`);
        return false;
      }
    });

    if (validFiles.length > 0)
      setForm((prev) => ({ ...prev, photos: [...prev.photos, ...validFiles] }));
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 1:
        if (!form.name?.trim()) errors.name = "Full name is required";
        if (!form.mobile?.trim()) errors.mobile = "Mobile number is required";
        if (!form.password) errors.password = "Password is required";
        if (form.password !== form.confirmPassword)
          errors.confirmPassword = "Passwords do not match";
        break;
      case 2:
        // if (!form.dob) errors.dob = "Date of birth required";
        if (!form.email?.trim()) errors.email = "Email required";
        break;
      case 3:
        if (!form.religion) errors.religion = "Religion required";
        if (!form.caste) errors.caste = "Caste required";
        if (!form.subcaste) errors.subcaste = "Subcaste required";
        break;
      case 4:
        if (!form.maritalStatus)
          errors.maritalStatus = "Marital status required";
        if (!form.height) errors.height = "Height required";
        if (!form.familyStatus) errors.familyStatus = "Family status required";
        if (!form.familyType) errors.familyType = "Family type required";
        break;
      case 5:
        if (!form.education) errors.education = "Education required";
        if (!form.employedIn) errors.employedIn = "Employment required";
        if (!form.annualIncome) errors.annualIncome = "Income required";
        if (!form.district?.trim()) errors.district = "District required";
        if (!form.state?.trim()) errors.state = "State required";
        break;
      case 6:
        if (!form.about?.trim()) errors.about = "About yourself required";
        break;
      default:
        break;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
      setError("");
    } else setError("Please fix errors");
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    setError("");
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 6) {
        nextStep();
        return;
    }

    setLoading(true);
    setError("");

    try {
        console.log("🚀 Starting registration WITH file uploads...");

        // Create FormData for multipart request
        const formData = new FormData();

        // ✅ FIXED: Remove duplicate keys - CORRECT VERSION
        const userData = {
            profileFor: form.profileFor,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            mobile: form.mobile.replace(/\D/g, ""), 
            password: form.password,
            gender: form.gender.toUpperCase(),
            maritalStatus: convertMaritalStatus(form.maritalStatus),
            age: parseInt(form.age) || calculateAge(form.dob),
            dob: form.dob,
            religion: form.religion,
            caste: form.caste,
            subCaste: form.subcaste,
            willingOtherCaste: form.willingOtherCaste,
            dosham: form.dosham,
            education: form.education,
            occupation: form.occupation || "",
            profession: form.occupation || "",
            employedIn: form.employedIn,
            specialization: form.specialization || "",
            annualIncome: parseIncome(form.annualIncome),
            city: form.city || "",
            state: form.state,
            district: form.district,
            country: form.country,
            pincode: form.pincode || "",
            familyStatus: form.familyStatus,
            familyType: form.familyType,
            height: convertHeightToCm(form.height),
            about: form.about,
            childrenCount: form.childrenCount || "0",
            childrenWithYou: form.childrenWithYou || false,
            minAge: parseInt(form.partnerAgeMin) || parseInt(form.minAge),
            maxAge: parseInt(form.partnerAgeMax) || parseInt(form.maxAge),
            membershipType: form.membershipType || "SILVER"
        };

        // ✅ ADD DEBUG LOGS HERE (BEFORE sending)
        console.log("📤 DEBUG - Data being sent to backend:");
        console.log("   Mobile:", userData.mobile);
        console.log("   Specialization:", userData.specialization);
        console.log("   MinAge:", userData.minAge);
        console.log("   MaxAge:", userData.maxAge);
        console.log("   Form specialization value:", form.specialization);
        console.log("   Full userData:", userData);

        // Add user data as JSON blob
        formData.append(
            "user",
            new Blob([JSON.stringify(userData)], {
                type: "application/json",
            })
        );

        // ✅ FIXED: Add photos as separate files
        if (form.photos.length > 0) {
            form.photos.forEach((photo, index) => {
                formData.append("photos", photo);
            });
            console.log(`📸 Added ${form.photos.length} photos`);
        }

        if (form.aadhar) {
    formData.append("aadhar", form.aadhar);
    console.log("📄 Added Aadhar:", form.aadhar.name);
}

        // ✅ FIXED: Send multipart request to registration endpoint
        const api = await import('../../config/api');
        const url = api.buildApiUrl("api/auth/register");
        console.log("🌐 Registration URL:", url);
        console.log("🌐 API Base URL:", api.API_BASE_URL);
        console.log("📦 FormData entries:", formData.entries ? Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? `${v.name} (${v.size} bytes)` : typeof v === 'object' ? 'Blob' : v]) : "N/A");
        
        console.log("📤 Sending registration request to:", url);
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            // Don't set Content-Type header - browser will set it with boundary
            // Add credentials for CORS
            credentials: 'include',
            mode: 'cors',
        });
        
        console.log("📡 Response received!");
        console.log("📡 Response status:", response.status);
        console.log("📡 Response statusText:", response.statusText);
        console.log("📡 Response URL:", response.url);
        console.log("📡 Response headers:", [...response.headers.entries()]);

        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Registration failed:", {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            
            let errorMessage = "Registration failed";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) {
                errorMessage = errorText || `Server returned ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log("📨 Registration response:", result);

        if (result.token) {
            console.log("✅ Registration complete with file uploads:", result);

            // Store token for immediate login
            if (result.token) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));
            }

            // Redirect to payment page with membership type
            const membershipType = form.membershipType || "SILVER";
            window.location.href = `/payment?membershipType=${membershipType}`;
            
            if (onRegisterSuccess) {
                onRegisterSuccess(result);
            }
        } else {
            throw new Error(
                result.error || result.message || "Registration failed"
            );
        }
    } catch (err) {
        console.error("❌ Registration error:", err);
        console.error("❌ Error details:", {
            message: err.message,
            stack: err.stack,
            name: err.name,
            cause: err.cause
        });
        
        // Show more detailed error message
        let errorMessage = err.message || "Registration failed. Please try again.";
        
        // Check for specific error types
        if (err.name === "TypeError" && err.message?.includes("Failed to fetch")) {
            errorMessage = "Cannot connect to backend server. Please check:\n1. Backend is running at http://localhost:8080\n2. No firewall/antivirus blocking\n3. Check browser console (F12) for details";
        } else if (err.message?.includes("403") || err.message?.includes("Forbidden")) {
            errorMessage = "Access denied (403). Check backend logs and CORS configuration.";
        } else if (err.message?.includes("CORS") || err.message?.includes("cors")) {
            errorMessage = "CORS error. Ensure backend at http://localhost:8080 has CORS configured for http://localhost:5173";
        } else if (err.message?.includes("Network") || err.message?.includes("network")) {
            errorMessage = "Network error. Backend server may not be running or unreachable.";
        }
        
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
};

  const uploadFiles = async (userId) => {
  try {
    console.log("📤 Starting file uploads for user:", userId);

    // Upload photos
    if (form.photos.length > 0) {
      console.log(`📸 Uploading ${form.photos.length} photos...`);

      for (const photo of form.photos) {
        try {
          console.log("🔼 Uploading photo:", photo.name);
          const uploadResult = await ProfileService.uploadProfilePhoto(photo);

          if (uploadResult.success) {
            console.log(
              "✅ Photo uploaded successfully:",
              uploadResult.imageUrl
            );
          } else {
            console.warn("⚠️ Photo upload failed:", uploadResult.error);
          }

          // Small delay to prevent overwhelming the server
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (photoError) {
          console.error("❌ Photo upload error:", photoError);
        }
      }
    }

    // Upload Aadhar document
    if (form.aadhar) {
      try {
        console.log("🆔 Uploading Aadhar document:", form.aadhar.name);
        await ProfileService.uploadDocument(form.aadhar, "AADHAR");
        console.log("✅ Aadhar uploaded successfully");
      } catch (aadharError) {
        console.error("❌ Aadhar upload error:", aadharError);
      }
    }

    console.log("✅ All file uploads completed");
  } catch (error) {
    console.error("❌ File upload process error:", error);
    setError(
      (prev) =>
        prev +
        " Note: Aadhar document failed to upload. You can upload it later in your profile."
    );
  }
};

  // ✅ IMPROVED HELPER FUNCTIONS:
  const convertMaritalStatus = (status) => {
    const mapping = {
      Single: "NEVER_MARRIED",
      "Never Married": "NEVER_MARRIED",
      Divorced: "DIVORCED",
      Widowed: "WIDOWED",
      Separated: "SEPARATED",
    };
    return mapping[status] || "NEVER_MARRIED";
  };

  const parseIncome = (incomeString) => {
    if (!incomeString) return 0;

    // Handle different income formats
    if (incomeString.includes("LPA")) {
      // Handle formats like "10-15 LPA" or "15-20 LPA"
      if (incomeString.includes("-")) {
        const range = incomeString.split("-");
        const upperLimit = parseFloat(range[1].trim().split(" ")[0]);
        return Math.round(upperLimit * 100000);
      }
      // Handle single value with LPA
      const lakhs = parseFloat(incomeString.split(" ")[0]);
      return Math.round(lakhs * 100000);
    } else if (incomeString.includes("L")) {
      const lakhs = parseFloat(incomeString.split(" ")[0]);
      return Math.round(lakhs * 100000);
    } else if (incomeString.includes("-")) {
      // Handle range like "5-10 L" - take the upper limit
      const range = incomeString.split("-");
      const upperLimit = parseFloat(range[1].trim().split(" ")[0]);
      return Math.round(upperLimit * 100000);
    } else if (incomeString.includes("+")) {
      // Handle "20+" format - take the minimum value
      const value = parseFloat(incomeString.replace("+", ""));
      return Math.round(value * 100000);
    }

    return 0;
  };

  const convertHeightToCm = (heightString) => {
    if (!heightString) return 0;

    // Handle feet format like "5.6"
    const feet = parseFloat(heightString);

    // Convert feet to cm (1 foot = 30.48 cm)
    const cm = Math.round(feet * 30.48);

    console.log(`📏 Height conversion: ${heightString} feet = ${cm} cm`);
    return cm;
  };

  // const fillTestData = () => {
  //   setForm({...form, name:"Test User", mobile:"9876543210", password:"Test@123", confirmPassword:"Test@123", email:"test@example.com", dob:"1990-01-01", age:"34"});
  //   setError(""); setValidationErrors({});
  // };

  return (
    <div className={`bg-white shadow-2xl rounded-2xl w-full max-w-lg mx-auto ${inModal ? 'h-full flex flex-col' : 'p-6'}`}>
      <div className={`text-center mb-6 ${inModal ? 'shrink-0 px-6 pt-6' : ''}`}>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          {getStepHeading()}
        </h2>
        <p className="text-gray-600 text-sm">
          Step {step} of {steps.length}
        </p>
        {/* {process.env.NODE_ENV==='development' && <button type="button" onClick={fillTestData} className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Fill Test Data</button>} */}
      </div>

      {step > 1 && (
        <div className={`mb-6 ${inModal ? 'shrink-0 px-6' : ''}`}>
          <Stepper steps={steps.slice(1)} currentStep={step - 1} />
        </div>
      )}
      {error && (
        <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 animate-pulse ${inModal ? 'shrink-0 mx-6' : ''}`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={`space-y-4 ${inModal ? 'flex-1 overflow-y-auto min-h-0 px-6' : ''}`}>
        {/* Step 1: Registration */}
        {step === 1 && (
          <div className="space-y-4 ">
            <FloatingInput
              label="Creating profile for"
              name="profileFor"
              value={form.profileFor}
              onChange={handleChange}
              required
              select
              error={validationErrors.profileFor}
            >
              <option value="Myself">Myself</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Relative">Relative</option>
              <option value="Friend">Friend</option>
            </FloatingInput>

            <FloatingInput
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              error={validationErrors.name}
              placeholder="Enter your full name"
            />

            <FloatingInput
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              type="tel"
              error={validationErrors.mobile}
              placeholder="10-digit mobile number"
              maxLength="10"
            />

            <FloatingInput
              label="Create Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              error={validationErrors.password}
              placeholder="At least 6 characters with uppercase, lowercase & numbers"
            />

            <FloatingInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              error={validationErrors.confirmPassword}
              placeholder="Re-enter your password"
            />
          </div>
        )}

        {/* Step 2: Basic Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <div className="flex items-center space-x-6">
                {["Male", "Female"].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={form.gender === gender}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
              {validationErrors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.gender}
                </p>
              )}
            </div>

            <FloatingInput
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              error={validationErrors.dob}
              className="z-50"
            />

            <FloatingInput
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />

            <div className="grid grid-cols-2 gap-4">
              <FloatingInput
                label="Preferred Min Age"
                name="partnerAgeMin"
                type="number"
                value={form.partnerAgeMin}
                onChange={handleChange}
                min="18"
                max="100"
                error={validationErrors.partnerAgeMin}
              />
              <FloatingInput
                label="Preferred Max Age"
                name="partnerAgeMax"
                type="number"
                value={form.partnerAgeMax}
                onChange={handleChange}
                min="18"
                max="100"
                error={validationErrors.partnerAgeMax}
              />
            </div>

            <FloatingInput
              label="Email ID"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              error={validationErrors.email}
              placeholder="your.email@example.com"
            />
          </div>
        )}

        {/* Step 3: Religion Details */}
{step === 3 && (
  <div className="space-y-4">

    {/* ⭐ Mother Tongue Select */}
    <div>
      <label className="block mb-1 font-medium">Mother Tongue</label>
      <Select
        value={form.motherTongue ? { value: form.motherTongue, label: form.motherTongue } : null}
        onChange={(e) => handleChange({ target: { name: "motherTongue", value: e.value } })}
        options={[
          "Tamil",
          "English",
          "Telugu",
          "Malayalam",
          "Kannada",
          "Hindi",
          "Urdu",
          "Marathi",
          "Bengali",
          "Gujarati"
        ].map((lang) => ({
          value: lang,
          label: lang,
        }))}
        placeholder="Select Mother Tongue"
      />
      {validationErrors.motherTongue && (
        <p className="text-red-500 text-sm">{validationErrors.motherTongue}</p>
      )}
    </div>

    {/* ⭐ Religion Select */}
    <div>
      <label className="block mb-1 font-medium">Religion</label>
      <Select
        value={form.religion ? { value: form.religion, label: form.religion } : null}
        onChange={(e) => {
          handleChange({ target: { name: "religion", value: e.value } });
          handleChange({ target: { name: "caste", value: "" } });
          handleChange({ target: { name: "subcaste", value: "" } });
        }}
        options={Object.keys(religionCategories).map((r) => ({
          value: r,
          label: r,
        }))}
        placeholder="Select Religion"
      />
      {validationErrors.religion && (
        <p className="text-red-500 text-sm">{validationErrors.religion}</p>
      )}
    </div>

    {/* Other Caste Checkbox */}
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
      <input
        type="checkbox"
        name="willingOtherCaste"
        checked={form.willingOtherCaste}
        onChange={handleCheckbox}
        className="text-red-600 focus:ring-red-500"
      />
      <label className="text-gray-700">Willing to marry from other caste?</label>
    </div>

    {/* ⭐ Caste Category Select */}
    <div>
      <label className="block mb-1 font-medium">Caste/Community</label>
      <Select
        value={form.caste ? { value: form.caste, label: form.caste } : null}
        onChange={(e) => {
          handleChange({ target: { name: "caste", value: e.value } });
          handleChange({ target: { name: "subcaste", value: "" } });
        }}
        isDisabled={!form.religion}
        options={
          form.religion
            ? religionCategories[form.religion].map((cat) => ({
                value: cat,
                label: cat,
              }))
            : []
        }
        placeholder="Select Caste Category"
      />
      {validationErrors.caste && (
        <p className="text-red-500 text-sm">{validationErrors.caste}</p>
      )}
    </div>

    {/* ⭐ Subcaste Select */}
    <div>
      <label className="block mb-1 font-medium">Subcaste</label>
      <Select
        value={form.subcaste ? { value: form.subcaste, label: form.subcaste } : null}
        onChange={(e) =>
          handleChange({ target: { name: "subcaste", value: e.value } })
        }
        isDisabled={!form.caste}
        options={
          form.religion && form.caste
            ? casteData[form.religion][form.caste].map((sub) => ({
                value: sub,
                label: sub,
              }))
            : []
        }
        placeholder="Select Subcaste"
      />
      {validationErrors.subcaste && (
        <p className="text-red-500 text-sm">{validationErrors.subcaste}</p>
      )}
    </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosham:
              </label>
              <div className="flex items-center space-x-4">
                {["Yes", "No", "Don't Know"].map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="dosham"
                      value={val}
                      checked={form.dosham === val}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{val}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Personal Details */}
        {step === 4 && (
          <div className="space-y-4">
            <FloatingInput
              label="Marital Status"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              required
              select
              error={validationErrors.maritalStatus}
            >
              <option value="Never Married">Never Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </FloatingInput>

            {(form.maritalStatus === "Divorced" ||
              form.maritalStatus === "Widowed") && (
              <FloatingInput
                label="No. of Children"
                name="childrenCount"
                value={form.childrenCount}
                onChange={handleChange}
                select
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3+">3+</option>
              </FloatingInput>
            )}

            {form.childrenCount && parseInt(form.childrenCount) > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  name="childrenWithYou"
                  checked={form.childrenWithYou}
                  onChange={handleCheckbox}
                  className="text-red-600 focus:ring-red-500"
                />
                <label className="text-gray-700">
                  Are children living with you?
                </label>
              </div>
            )}

            <FloatingInput
              label="Height (ft)"
              name="height"
              value={form.height}
              onChange={handleChange}
              required
              error={validationErrors.height}
              list="heights"
              placeholder="Select or enter height"
            />
            <datalist id="heights">
              {Array.from({ length: 31 }, (_, i) => 4 + i * 0.1).map((h) => (
                <option key={h.toFixed(1)} value={h.toFixed(1)} />
              ))}
            </datalist>

            <FloatingInput
              label="Family Status"
              name="familyStatus"
              value={form.familyStatus}
              onChange={handleChange}
              required
              select
              error={validationErrors.familyStatus}
            >
              <option value="Middle Class">Middle Class</option>
              <option value="Upper Middle Class">Upper Middle Class</option>
              <option value="Rich">Rich</option>
            </FloatingInput>

            <FloatingInput
              label="Family Type"
              name="familyType"
              value={form.familyType}
              onChange={handleChange}
              required
              select
              error={validationErrors.familyType}
            >
              <option value="Joint">Joint Family</option>
              <option value="Nuclear">Nuclear Family</option>
            </FloatingInput>
          </div>
        )}

        {step === 5 && (
  <div className="space-y-4">
    
    {/* ⭐ Highest Education */}
    <div>
      <label className="block mb-1 font-medium">Highest Education</label>
      <Select
        value={form.education ? { value: form.education, label: form.education } : null}
        onChange={(e) =>
          handleChange({ target: { name: "education", value: e.value } })
        }
        options={[
          { value: "High School", label: "High School" },
          { value: "Bachelor's", label: "Bachelor's Degree" },
          { value: "Master's", label: "Master's Degree" },
          { value: "PhD", label: "PhD" },
        ]}
        placeholder="Select Education"
      />
      {validationErrors.education && (
        <p className="text-red-500 text-sm">{validationErrors.education}</p>
      )}
    </div>

    {/* Specialization (normal input) */}
    <FloatingInput
      label="Specialization"
      name="specialization"
      value={form.specialization}
      onChange={handleChange}
      placeholder="e.g., Computer Science, Business Administration"
    />

    {/* ⭐ Employed In */}
    <div>
      <label className="block mb-1 font-medium">Employed In</label>
      <Select
        value={form.employedIn ? { value: form.employedIn, label: form.employedIn } : null}
        onChange={(e) =>
          handleChange({ target: { name: "employedIn", value: e.value } })
        }
        options={[
          { value: "Private", label: "Private Sector" },
          { value: "Government", label: "Government Sector" },
          { value: "Self-Employed", label: "Self-Employed" },
          { value: "Business", label: "Business" },
          { value: "Not Employed", label: "Not Employed" },
        ]}
        placeholder="Select Employment"
      />
      {validationErrors.employedIn && (
        <p className="text-red-500 text-sm">{validationErrors.employedIn}</p>
      )}
    </div>

    {/* ⭐ Occupation (react-select full list) */}
    <div>
      <label className="block mb-1 font-medium">Occupation</label>
      <Select
        value={
          form.occupation
            ? { value: form.occupation, label: form.occupation }
            : null
        }
        onChange={(e) =>
          handleChange({ target: { name: "occupation", value: e.value } })
        }
        options={professionOptions} // ← from your earlier list
        placeholder="Select Occupation"
      />
    </div>

    {/* ⭐ Annual Income */}
    <div>
      <label className="block mb-1 font-medium">Annual Income (Rs)</label>
      <Select
        value={form.annualIncome ? { value: form.annualIncome, label: form.annualIncome } : null}
        onChange={(e) =>
          handleChange({ target: { name: "annualIncome", value: e.value } })
        }
        options={[
          { value: "0-2 L", label: "0–2 Lakhs" },
          { value: "2-5 L", label: "2–5 Lakhs" },
          { value: "5-10 L", label: "5–10 Lakhs" },
          { value: "10-15 LPA", label: "10 to 15 LPA" },
          { value: "15-20 LPA", label: "15 to 20 LPA" },
          { value: "20+", label: "20+" },
        ]}
        placeholder="Select Income"
      />
      {validationErrors.annualIncome && (
        <p className="text-red-500 text-sm">{validationErrors.annualIncome}</p>
      )}
    </div>

    {/* ⭐ COUNTRY SELECT - MOVED ABOVE STATE */}
    <div>
      <label className="block mb-1 font-medium">Country</label>
      <Select
        value={form.country ? { value: form.country, label: form.country } : null}
        onChange={(e) => {
          handleChange({ target: { name: "country", value: e.value } });
          // Reset state and district when country changes
          if (e.value !== "India") {
            handleChange({ target: { name: "state", value: "" } });
            handleChange({ target: { name: "district", value: "" } });
          }
        }}
        options={[
          { value: "India", label: "India" },
          { value: "United States", label: "United States" },
          { value: "United Kingdom", label: "United Kingdom" },
          { value: "Canada", label: "Canada" },
          { value: "Australia", label: "Australia" },
          { value: "Singapore", label: "Singapore" },
          { value: "UAE", label: "UAE" },
          { value: "Other", label: "Other" },
        ]}
        placeholder="Select Country"
      />
      {validationErrors.country && (
        <p className="text-red-500 text-sm">{validationErrors.country}</p>
      )}
    </div>

    {/* ⭐ STATE SELECT - Only show for India */}
    {(form.country === "India" || !form.country) && (
      <>
        <div>
          <label className="block mb-1 font-medium">State</label>
          <Select
            value={form.state ? { value: form.state, label: form.state } : null}
            onChange={(e) => {
              handleChange({ target: { name: "state", value: e.value } });
              handleChange({ target: { name: "district", value: "" } });
            }}
            options={indianStates.map((s) => ({ value: s, label: s }))}
            placeholder="Select State"
          />
          {validationErrors.state && (
            <p className="text-red-500 text-sm">{validationErrors.state}</p>
          )}
        </div>

        {/* ⭐ DISTRICT SELECT → dynamic for all states */}
        <div>
          <label className="block mb-1 font-medium">District</label>
          <Select
            value={
              form.district ? { value: form.district, label: form.district } : null
            }
            onChange={(e) =>
              handleChange({ target: { name: "district", value: e.value } })
            }
            isDisabled={!form.state}
            options={
              form.state && districtsByState[form.state]
                ? districtsByState[form.state].map((d) => ({
                    value: d,
                    label: d,
                  }))
                : []
            }
            placeholder={
              form.state ? "Select District" : "Select State First"
            }
          />
          {validationErrors.district && (
            <p className="text-red-500 text-sm">{validationErrors.district}</p>
          )}
        </div>
      </>
    )}
    
    {/* ⭐ ADD CITY INPUT FIELD HERE */}
    <FloatingInput
      label="City/Town"
      name="city"
      value={form.city}
      onChange={handleChange}
      placeholder="Enter your city or town"
      error={validationErrors.city}
    />

    {/* Pincode */}
    <FloatingInput
      label="Pincode"
      name="pincode"
      value={form.pincode}
      onChange={handleChange}
      placeholder="6-digit pincode"
      maxLength="6"
    />
  </div>
        )}

        {/* Step 6: About Yourself & Documents */}
        {step === 6 && (
          <div className="space-y-6">
            {/* About Yourself */}
            <div>
              <FloatingInput
                label="About Yourself"
                name="about"
                value={form.about}
                onChange={handleChange}
                required
                textarea
                error={validationErrors.about}
                placeholder="Tell us about yourself, your interests, family background, and what you're looking for in a partner (50-1000 characters)"
                rows="5"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Share your personality, hobbies, and expectations</span>
                <span>{form.about?.length || 0}/1000</span>
              </div>
            </div>

            {/* Photos Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📸 Profile Photos (Optional)
                <span className="text-xs text-gray-500 ml-2">
                  Upload clear, recent photos for better matches
                </span>
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-red-500 transition-colors duration-300 bg-gray-50 hover:bg-gray-100">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    <span className="text-red-600">Click to upload photos</span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB each (Max 6 photos)
                  </p>
                </div>
              </div>

              {/* Uploaded Photos Preview */}
              {form.photos.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Uploaded Photos ({form.photos.length}/6)
                    </p>
                    {form.photos.length >= 6 && (
                      <p className="text-xs text-red-600">
                        Maximum 6 photos allowed
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {form.photos.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-red-500 transition-colors shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                          title="Remove photo"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {idx === 0 ? "Main" : idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Aadhar Document Upload */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    🆔 Aadhar Card (Optional for Verification)
    <span className="text-xs text-gray-500 ml-2">
      Upload for identity verification (kept confidential)
    </span>
  </label>
  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors duration-300 bg-green-50 hover:bg-green-100">
    <input
      type="file"
      accept=".pdf,.PDF,.jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const validTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
          ];
          if (validTypes.includes(file.type)) {
            if (file.size > 10 * 1024 * 1024) {
              setError("Aadhar file too large (max 10MB)");
              return;
            }
            setForm((prev) => ({ ...prev, aadhar: file }));
            setError("");
          } else {
            setError("Please upload PDF, JPG, or PNG for Aadhar");
          }
        }
      }}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div className="flex flex-col items-center justify-center">
      <svg
        className="w-12 h-12 text-green-400 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
      <p className="text-sm text-gray-600 font-medium">
        <span className="text-green-600">
          Click to upload Aadhar
        </span>{" "}
        or drag and drop
      </p>
      <p className="text-xs text-gray-500 mt-1">
        PDF, JPG, PNG (Max 10MB) • Front and Back in one file
      </p>
    </div>
  </div>

  {/* Uploaded Aadhar Preview */}
  {form.aadhar && (
    <div className="mt-4">
      <div className="flex items-center justify-between p-4 border border-green-200 rounded-xl bg-green-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">
              {form.aadhar.name}
            </p>
            <p className="text-xs text-gray-500">
              Aadhar Document • {(form.aadhar.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const url = URL.createObjectURL(form.aadhar);
              window.open(url, "_blank");
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Preview Aadhar"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview
          </button>

          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, aadhar: null }))
            }
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Remove Aadhar"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Remove
          </button>
        </div>
      </div>

      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Your Aadhar is kept confidential and used only for identity verification
      </p>
    </div>
  )}
</div>

            {/* Upload Summary */}
            {(form.photos.length > 0 || form.aadhar) && (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Upload Summary
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <div className="text-center p-2 bg-white rounded-lg border border-blue-100">
        <div className="font-semibold text-blue-600">
          {form.photos.length}
        </div>
        <div className="text-gray-600">Photos</div>
      </div>
      <div className="text-center p-2 bg-white rounded-lg border border-blue-100">
        <div className="font-semibold text-blue-600">
          {form.aadhar ? "✓" : "None"}
        </div>
        <div className="text-gray-600">Aadhar</div>
      </div>
    </div>
  </div>
)}

            {/* Membership Type - Last field in Step 6 */}
            <div>
              <label className="block mb-1 font-medium">Membership Type</label>
              <Select
                value={form.membershipType ? { value: form.membershipType, label: form.membershipType } : null}
                onChange={(e) =>
                  handleChange({ target: { name: "membershipType", value: e.value } })
                }
                options={[
                  { value: "SILVER", label: "Silver" },
                  { value: "GOLD", label: "Gold" },
                  { value: "DIAMOND", label: "Diamond" },
                ]}
                placeholder="Select Membership Type"
              />
              {validationErrors.membershipType && (
                <p className="text-red-500 text-sm">{validationErrors.membershipType}</p>
              )}
            </div>
          </div>
        )}

        <div className={inModal ? 'shrink-0 mt-4 px-6 pb-6' : ''}>
          <StepperController
            currentStep={step}
            totalSteps={steps.length}
            onNext={nextStep}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            loading={loading}
            validationErrors={validationErrors}
          />
        </div>

        {step === 1 && onSwitch && (
          <div className={`text-center pt-4 border-t border-gray-200 ${inModal ? 'px-6 pb-6 shrink-0' : ''}`}>
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitch}
                className="text-red-600 hover:text-red-700 font-medium underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
