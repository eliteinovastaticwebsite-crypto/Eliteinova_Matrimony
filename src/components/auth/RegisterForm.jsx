// src/components/auth/RegisterForm.jsx (UPDATED VERSION)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { register, syncAuthFromStorage } = useAuth(); // MOVED TO TOP LEVEL
  const navigate = useNavigate();
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
    physicallyChallenged: "No",
    physicallyChallengedDescription: "",

    // Step 3: Religion Details
    religion: "",
    motherTongue: "",
    motherTongueOther: "",
    religionOther: "",
    willingOtherCaste: false,
    community: "",
    communityOther: "",
    caste: "",
    subCaste: "",
    subCasteOther: "",
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
    educationalQualification: "",
    certificateCourses: "",
    specialization: "",
    employedIn: "Private",
    occupation: "",
    occupationOther: "",      // <-- ADD THIS LINE
    employedInOther: "",       // <-- ADD THIS LINE
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

// ------------ Tamil Nadu Government Community Categories ------------
// Community categories as per Tamil Nadu Government official classification
const communityCategories = [
  { value: "Other", label: "Other" },
  { value: "SC", label: "SC - Scheduled Castes" },
  { value: "ST", label: "ST - Scheduled Tribes" },
  { value: "BC", label: "BC - Backward Classes" },
  { value: "MBC", label: "MBC - Most Backward Classes" },
  { value: "BCM", label: "BCM - Backward Class Muslims" },
  { value: "DNC", label: "DNC - Denotified Communities" },
  { value: "GENERAL", label: "General / Others" },
  
];

// Caste/Subcaste data for each community category (Official Tamil Nadu Government Lists)
const communityCasteData = {
  SC: [
    "Others",
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
  ],
  ST: [
    "Others",
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
  ],
  BC: [
    "Others",
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
  ],
  MBC: [
    "Others",
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
  ],
  BCM: [
    "Others",
    "Ansar",
    "Dekkani Muslims",
    "Labbai (including Rowthar, Marakayar)",
    "Labbai",
    "Rowther",
    "Marakayar",
    "Mapilla",
    "Sheik",
    "Syed",
  ],
  DNC: [
    "Others",
    "Attur Kilnad Koravars",
    "Appanad Koravars",
    "Dommars",
    "Donga Boya",
    "Narikuravar",
  ],
  GENERAL: [
    "Others",
    "Brahmin (Iyer, Iyengar)",
    "Jain",
    "Sikh",
    "Christian (Forward communities not in BC list)", 
  ],
};

// ------------ Profession Options ------------
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

  const formatMobileNumber = (value) => value.replace(/\D/g, "").slice(0, 14);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "mobile") processedValue = formatMobileNumber(value);
    setForm((prev) => ({ ...prev, [name]: processedValue }));

    if (name === "dob" && value) {
      const age = calculateAge(value);
      setForm((prev) => ({ ...prev, age: age.toString() }));
      
      // Add validation for minimum age (18) and maximum age (born after 1975)
      const birthYear = new Date(value).getFullYear();
      if (birthYear < 1975) {
        setValidationErrors(prev => ({ 
          ...prev, 
          dob: "Sorry, registration is only available for individuals born after 1975" 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, dob: "" }));
      }
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

    // Check if adding new files would exceed the 3 photo limit
    const totalAfterAdd = form.photos.length + files.length;
    if (totalAfterAdd > 3) {
      setError(`You can only upload up to 3 photos. You already have ${form.photos.length} photo(s).`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} too large (max 5MB)`);
          return false;
        }
        return true;
      } else {
        setError(`File ${file.name} not supported. Please upload only images.`);
        return false;
      }
    });

    if (validFiles.length > 0) {
      setForm((prev) => ({ 
        ...prev, 
        photos: [...prev.photos, ...validFiles] 
      }));
    }
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
        if (!form.password || form.password.trim() === "") errors.password = "Password is required";
        if (form.password && form.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (form.password && form.password.length >= 6) {
          const hasUpperCase = /[A-Z]/.test(form.password);
          const hasLowerCase = /[a-z]/.test(form.password);
          const hasNumber = /[0-9]/.test(form.password);
          if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
          }
        }
        if (form.password !== form.confirmPassword)
          errors.confirmPassword = "Passwords do not match";
        break;
      case 2:
        if (!form.email?.trim()) errors.email = "Email required";
        
        // Age validation: must be 18 or above AND born after 1975
        if (form.dob) {
          const calculatedAge = calculateAge(form.dob);
          const birthYear = new Date(form.dob).getFullYear();
          
          if (calculatedAge < 18) {
            errors.dob = "You must be at least 18 years old to register";
            errors.age = "Age must be 18 or above";
          }
          
          if (birthYear < 1975) {
            errors.dob = "Sorry, registration is only available for individuals born after 1975";
          }
        } else if (form.age) {
          const ageNum = parseInt(form.age);
          if (isNaN(ageNum) || ageNum < 18) {
            errors.age = "Age must be 18 or above";
          }
        }
        
        // Preferred min age validation: must be 18 or above
        if (form.partnerAgeMin) {
          const minAgeNum = parseInt(form.partnerAgeMin);
          if (isNaN(minAgeNum) || minAgeNum < 18) {
            errors.partnerAgeMin = "Preferred minimum age must be 18 or above";
          }
        }
        
        // Preferred max age validation: must be greater than or equal to min age (if both provided)
        if (form.partnerAgeMax && form.partnerAgeMin) {
          const maxAgeNum = parseInt(form.partnerAgeMax);
          const minAgeNum = parseInt(form.partnerAgeMin);
          if (!isNaN(maxAgeNum) && !isNaN(minAgeNum) && maxAgeNum < minAgeNum) {
            errors.partnerAgeMax = "Maximum age must be greater than or equal to minimum age";
          }
        }
        break;

        case 3:
        if (!form.religion) errors.religion = "Religion required";
        // Remove required validation for community and caste
        // if (!form.community) errors.community = "Community category required";
        if (form.community === "Other" && !form.communityOther) {
          errors.communityOther = "Please specify community category";
        }
        // if (!form.caste && form.community !== "Other") errors.caste = "Caste required";
        if (form.community === "Other" && !form.subCasteOther) {
          errors.subCasteOther = "Please specify caste/subcaste";
        }
        if (form.caste === "Others" && !form.subCasteOther) {
          errors.subCasteOther = "Please specify caste/subcaste";
        }
        break;
        
      case 4:
        if (!form.maritalStatus)
          errors.maritalStatus = "Marital status required";
        if (!form.height) errors.height = "Height required";
        if (!form.familyStatus) errors.familyStatus = "Family status required";
        if (!form.familyType) errors.familyType = "Family type required";
        if (!form.physicallyChallenged) errors.physicallyChallenged = "Please specify if physically challenged";
        if (form.physicallyChallenged === "Yes" && !form.physicallyChallengedDescription?.trim()) {
          errors.physicallyChallengedDescription = "Description required when physically challenged is Yes";
        }
        break;
      case 5:
        if (!form.education) errors.education = "Education required";
        if (!form.employedIn) errors.employedIn = "Employment required";
        if (!form.membershipType) errors.membershipType = "Membership type required";
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

    // Final validation - ensure password is present before submission
    if (!form.password || form.password.trim() === "") {
        setError("Password is required. Please go back to step 1 and enter your password.");
        setValidationErrors({ password: "Password is required" });
        setStep(1);
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
            password: (form.password || "").trim(),
            gender: form.gender.toUpperCase(),
            maritalStatus: convertMaritalStatus(form.maritalStatus),
            age: parseInt(form.age) || calculateAge(form.dob),
            dob: form.dob,
            // For mother tongue - use the "Other" text if selected
            motherTongue: form.motherTongue === "Other" 
              ? (form.motherTongueOther || "Other") 
              : form.motherTongue,
            // For religion - use the "Other" text if selected
            religion: form.religion === "Other" 
              ? (form.religionOther || "Other") 
              : form.religion,
            community: form.community === "Other" ? form.communityOther : form.community,
            caste: form.caste === "Others" ? form.subCasteOther : form.caste,
            subCaste: form.caste === "Others" ? form.subCasteOther : (form.community === "Other" ? form.subCasteOther : form.caste), // Keep subCaste for backward compatibility
            willingOtherCaste: form.willingOtherCaste,
            dosham: form.dosham,
            education: form.education,
            occupation: form.occupation || "",
            profession: form.occupation || "",
            employedIn: form.employedIn,
            specialization: form.specialization || "",
            educationalQualification: form.educationalQualification || "",
            certificateCourses: form.certificateCourses || "",
            annualIncome: parseIncome(form.annualIncome),
            address: form.address || "",
            city: form.city || "",
            state: form.state,
            district: form.district,
            country: form.country,
            pincode: form.pincode || "",
            familyStatus: form.familyStatus,
            familyType: form.familyType,
            height: convertHeightToCm(form.height),
            physicallyChallenged: form.physicallyChallenged === "Yes",
            physicallyChallengedDescription: form.physicallyChallenged === "Yes" ? (form.physicallyChallengedDescription || "") : "",
            about: form.about,
            childrenCount: form.childrenCount || "0",
            childrenWithYou: form.childrenWithYou || false,
            minAge: parseInt(form.partnerAgeMin) || parseInt(form.minAge),
            maxAge: parseInt(form.partnerAgeMax) || parseInt(form.maxAge),
            membershipType: form.membershipType || "SILVER"
        };

        // ✅ ADD DEBUG LOGS HERE (BEFORE sending)
        console.log("📤 DEBUG - Data being sent to backend:");
        console.log("   Password:", userData.password ? "***" + userData.password.substring(userData.password.length - 2) : "MISSING!");
        console.log("   Password length:", userData.password?.length || 0);
        console.log("   Mobile:", userData.mobile);
        console.log("   Specialization:", userData.specialization);
        console.log("   MinAge:", userData.minAge);
        console.log("   MaxAge:", userData.maxAge);
        console.log("   Form specialization value:", form.specialization);
        
        // Validate password before sending
        if (!userData.password || userData.password.trim() === "") {
            throw new Error("Password is required");
        }

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

            // Store token for immediate login (use same key as AuthContext expects)
            if (result.token) {
                localStorage.setItem("authToken", result.token); // Changed from "token" to "authToken" to match AuthContext
                localStorage.setItem("user", JSON.stringify(result.user));
                
                // Set API authorization header
                const api = await import('../../config/api');
                const axiosInstance = (await import('../../api/axiosUser')).default;
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
            }

            // ✅ CRITICAL FIX: Sync AuthContext state from localStorage
            // This ensures isAuthenticated is set to true before navigation
            syncAuthFromStorage();

            // Get membership type and redirect to registration completion page
            const membershipType = form.membershipType || "SILVER";
            
            console.log("✅ Registration successful! Redirecting to registration completion page...");
            console.log("   Membership Type:", membershipType);
            console.log("   Token stored:", !!result.token);
            
            // Close modal if opened from modal (but don't wait for it)
            if (onClose) {
                onClose();
            }
            
            // Call onRegisterSuccess callback if provided (for any cleanup)
            if (onRegisterSuccess) {
                onRegisterSuccess(result);
            }
            
            // ✅ CHANGED: Navigate directly to profiles page (skip dashboard/registration completion)
            // ❌ OLD: Was navigating to registration completion page, then dashboard
            // setTimeout(() => {
            //     const completionUrl = `/registration-completion?membershipType=${membershipType}`;
            //     console.log("🚀 Navigating to:", completionUrl);
            //     navigate(completionUrl, { replace: true });
            // }, 100);
            
            // ✅ NEW: Navigate directly to profiles page (same as login)
            setTimeout(() => {
                console.log("🚀 Navigating directly to profiles page...");
                navigate("/profiles", { replace: true });
            }, 100);
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
        
        // Check for specific error types from backend
        const errorMsg = err.message?.toLowerCase() || "";
        
        if (errorMsg.includes("duplicate") || errorMsg.includes("already exists")) {
            if (errorMsg.includes("email")) {
                errorMessage = "An account with this email already exists. Please use a different email or try logging in.";
            } else if (errorMsg.includes("mobile") || errorMsg.includes("phone")) {
                errorMessage = "An account with this mobile number already exists. Please use a different mobile number or try logging in.";
            } else {
                errorMessage = "This information is already registered. Please check your details or try logging in.";
            }
        } else if (errorMsg.includes("invalid email") || errorMsg.includes("email")) {
            errorMessage = "Invalid email address. Please enter a valid email.";
        } else if (errorMsg.includes("password") && (errorMsg.includes("short") || errorMsg.includes("length"))) {
            errorMessage = "Password must be at least 6 characters long.";
        } else if (errorMsg.includes("mobile") || errorMsg.includes("phone")) {
            errorMessage = "Invalid mobile number. Please enter a valid mobile number.";
        } else if (err.name === "TypeError" && err.message?.includes("Failed to fetch")) {
            errorMessage = "Cannot connect to server. Please check your internet connection and try again.";
        } else if (errorMsg.includes("403") || errorMsg.includes("forbidden")) {
            errorMessage = "Access denied. Please try again later.";
        } else if (errorMsg.includes("cors")) {
            errorMessage = "Server configuration error. Please contact support.";
        } else if (errorMsg.includes("network") || errorMsg.includes("connection")) {
            errorMessage = "Network error. Please check your internet connection and try again.";
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
    if (incomeString.includes("Cr")) {
      // Handle crores format like "1Cr-3Cr", "3Cr-5Cr", "5Cr+"
      if (incomeString.includes("-")) {
        const range = incomeString.split("-");
        const upperLimit = parseFloat(range[1].trim().replace("Cr", "").replace("+", ""));
        return Math.round(upperLimit * 10000000); // Convert crores to rupees
      } else if (incomeString.includes("+")) {
        const value = parseFloat(incomeString.replace("Cr+", "").replace("Cr", ""));
        return Math.round(value * 10000000);
      } else {
        const crores = parseFloat(incomeString.replace("Cr", ""));
        return Math.round(crores * 10000000);
      }
    } else if (incomeString.includes("LPA")) {
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
      // Handle formats like "20L-50L", "50L-75L", "75L-1Cr", "0-2L", "2L-5L", etc.
      if (incomeString.includes("-")) {
        const range = incomeString.split("-");
        // Check if second part has Cr
        if (range[1].includes("Cr")) {
          const crores = parseFloat(range[1].trim().replace("Cr", ""));
          return Math.round(crores * 10000000);
        }
        // Extract number from second part (could be "50L" or "50")
        const upperLimitStr = range[1].trim().replace("L", "");
        const upperLimit = parseFloat(upperLimitStr);
        return Math.round(upperLimit * 100000);
      }
      const lakhs = parseFloat(incomeString.replace("L", ""));
      return Math.round(lakhs * 100000);
    } else if (incomeString.includes("+")) {
      // Handle "1Cr+" format - take the minimum value
      if (incomeString.includes("Cr")) {
        const value = parseFloat(incomeString.replace("Cr+", "").replace("+", ""));
        return Math.round(value * 10000000);
      }
      const value = parseFloat(incomeString.replace("+", ""));
      return Math.round(value * 100000);
    } else if (incomeString.includes("-")) {
      // Handle range like "0-2L" or "1Cr-3Cr" - take the upper limit
      const range = incomeString.split("-");
      const upperLimitStr = range[1].trim();
      if (upperLimitStr.includes("Cr")) {
        const crores = parseFloat(upperLimitStr.replace("Cr", ""));
        return Math.round(crores * 10000000);
      } else if (upperLimitStr.includes("L")) {
        const lakhs = parseFloat(upperLimitStr.replace("L", ""));
        return Math.round(lakhs * 100000);
      } else {
        // Assume lakhs if no unit
        const lakhs = parseFloat(upperLimitStr);
        return Math.round(lakhs * 100000);
      }
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

      {/* Scrollable form content wrapper - enables scrolling for all steps */}
      <div 
        className={`register-form-scrollable ${inModal ? 'flex-1 overflow-y-auto min-h-0 px-6' : 'max-h-[70vh] overflow-y-auto pr-2'} scroll-smooth`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
        onWheel={(e) => {
          // Prevent scroll from propagating to background when scrolling inside form
          const element = e.currentTarget;
          const { scrollTop, scrollHeight, clientHeight } = element;
          const isAtTop = scrollTop === 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
          
          // Only prevent propagation if we're not at the boundaries
          // This allows natural scroll behavior at the edges
          if (!isAtTop && !isAtBottom) {
            e.stopPropagation();
          } else if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            // At boundary and trying to scroll further - prevent background scroll
            e.stopPropagation();
          }
        }}
        onTouchMove={(e) => {
          // Prevent touch scroll from propagating to background
          const element = e.currentTarget;
          const { scrollTop, scrollHeight, clientHeight } = element;
          const isAtTop = scrollTop === 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
          
          // Only prevent if not at boundaries
          if (!isAtTop && !isAtBottom) {
            e.stopPropagation();
          }
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="mobile number"
              maxLength="14"
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

        {/* ⭐ Mother Tongue Select with Other option */}
    <div>
      <label className="block mb-1 font-medium">Mother Tongue</label>
      <Select
        value={form.motherTongue ? { value: form.motherTongue, label: form.motherTongue } : null}
        onChange={(e) => {
          handleChange({ target: { name: "motherTongue", value: e.value } });
          // If not "Other", clear the other text field
          if (e.value !== "Other") {
            handleChange({ target: { name: "motherTongueOther", value: "" } });
          }
        }}
        options={[
          "Other",
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
      
      {/* Show text input when "Other" is selected */}
      {form.motherTongue === "Other" && (
        <div className="mt-3">
          <FloatingInput
            label="Please specify your mother tongue"
            name="motherTongueOther"
            value={form.motherTongueOther || ""}
            onChange={handleChange}
            required
            placeholder="Enter your mother tongue"
            error={validationErrors.motherTongueOther}
          />
          {validationErrors.motherTongueOther && (
            <p className="text-red-500 text-sm">{validationErrors.motherTongueOther}</p>
          )}
        </div>
      )}
    </div>

        {/* ⭐ Religion Select with Other option */}
    <div>
      <label className="block mb-1 font-medium">Religion</label>
      <Select
        value={form.religion ? { value: form.religion, label: form.religion } : null}
        onChange={(e) => {
          handleChange({ target: { name: "religion", value: e.value } });
          handleChange({ target: { name: "community", value: "" } });
          handleChange({ target: { name: "caste", value: "" } });
          // If not "Other", clear the other text field
          if (e.value !== "Other") {
            handleChange({ target: { name: "religionOther", value: "" } });
          }
        }}
        options={[
          { value: "Other", label: "Other" },
          { value: "Hindu", label: "Hindu" },
          { value: "Muslim", label: "Muslim" },
          { value: "Christian", label: "Christian" },
          { value: "Sikh", label: "Sikh" },
          { value: "Jain", label: "Jain" },
          { value: "Buddhist", label: "Buddhist" },
          { value: "Jewish", label: "Jewish" },
          { value: "Parsi", label: "Parsi" },
          
        ]}
        placeholder="Select Religion"
      />
      {validationErrors.religion && (
        <p className="text-red-500 text-sm">{validationErrors.religion}</p>
      )}
      
      {/* Show text input when "Other" is selected */}
      {form.religion === "Other" && (
        <div className="mt-3">
          <FloatingInput
            label="Please specify your religion"
            name="religionOther"
            value={form.religionOther || ""}
            onChange={handleChange}
            required
            placeholder="Enter your religion"
            error={validationErrors.religionOther}
          />
          {validationErrors.religionOther && (
            <p className="text-red-500 text-sm">{validationErrors.religionOther}</p>
          )}
        </div>
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
      <label className="text-gray-700">Willing to marry from other community/caste?</label>
    </div>

    {/* ⭐ Community Category Select (Tamil Nadu Government Categories) */}
    <div>
      <label className="block mb-1 font-medium">Community Category</label>
      <Select
        value={form.community ? { value: form.community, label: communityCategories.find(c => c.value === form.community)?.label || form.community } : null}
        onChange={(e) => {
          console.log("🏷️ Community selected:", e?.value);
          if (e && e.value) {
            handleChange({ target: { name: "community", value: e.value } });
            handleChange({ target: { name: "caste", value: "" } });
            handleChange({ target: { name: "subCaste", value: "" } });
            if (e.value !== "Other") {
              handleChange({ target: { name: "communityOther", value: "" } });
            }
          }
        }}
        options={communityCategories}
        placeholder="Select Community Category"
        isSearchable={true}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
      />
      {form.community === "Other" && (
        <div className="mt-2">
          <FloatingInput
            label="Please specify community category"
            name="communityOther"
            value={form.communityOther}
            onChange={handleChange}
            required
          />
          {validationErrors.communityOther && (
            <p className="text-red-500 text-sm">{validationErrors.communityOther}</p>
          )}
        </div>
      )}
      {validationErrors.community && (
        <p className="text-red-500 text-sm">{validationErrors.community}</p>
      )}
    </div>

    {/* ⭐ Caste/Subcaste Select */}
    <div>
      <label className="block mb-1 font-medium">Caste/Subcaste </label>
      <Select
        value={form.caste ? { value: form.caste, label: form.caste } : null}
        onChange={(e) => {
          console.log("🏷️ Caste selected:", e?.value);
          if (e && e.value) {
            handleChange({ target: { name: "caste", value: e.value } });
            // Set subCaste same as caste for backward compatibility
            handleChange({ target: { name: "subCaste", value: e.value } });
            if (e.value !== "Others") {
              handleChange({ target: { name: "subCasteOther", value: "" } });
            }
          }
        }}
        isDisabled={!form.community || form.community === "Other"}
        options={
          form.community && form.community !== "Other" && communityCasteData[form.community]
            ? communityCasteData[form.community].map((caste) => ({
                value: caste,
                label: caste,
              }))
            : []
        }
        placeholder={form.community === "Other" ? "Select community category first" : form.community ? "Select Caste/Subcaste" : "Select Community Category First"}
        isSearchable={true}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
      />
      {form.caste === "Others" && (
        <div className="mt-2">
          <FloatingInput
            label="Please specify caste/subcaste"
            name="subCasteOther"
            value={form.subCasteOther}
            onChange={handleChange}
            required
          />
          {validationErrors.subCasteOther && (
            <p className="text-red-500 text-sm">{validationErrors.subCasteOther}</p>
          )}
        </div>
      )}
      {form.community === "Other" && (
        <div className="mt-2">
          <FloatingInput
            label="Please specify caste/subcaste"
            name="subCasteOther"
            value={form.subCasteOther}
            onChange={handleChange}
            required
          />
          {validationErrors.subCasteOther && (
            <p className="text-red-500 text-sm">{validationErrors.subCasteOther}</p>
          )}
        </div>
      )}
      {validationErrors.caste && (
        <p className="text-red-500 text-sm">{validationErrors.caste}</p>
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
              {Array.from({ length: 31 }, (_, i) => 4 + i * 0.1).map((h) => {
                return <option key={h.toFixed(1)} value={h.toFixed(1)} />;
              })}
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
              <option value="Lower Middle Class">Lower Middle Class</option>
              <option value="Middle Class">Middle Class</option>
              <option value="Upper Middle Class">Upper Middle Class</option>
              <option value="Rich">Rich</option>
              <option value="Upper Rich">Upper Rich</option>
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

            {/* Physically Challenged Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Physically Challenged *
              </label>
              <div className="flex items-center space-x-6">
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="physicallyChallenged"
                      value={option}
                      checked={form.physicallyChallenged === option}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {validationErrors.physicallyChallenged && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.physicallyChallenged}
                </p>
              )}
            </div>

            {/* Description box if Yes is selected */}
            {form.physicallyChallenged === "Yes" && (
              <FloatingInput
                label="Description"
                name="physicallyChallengedDescription"
                value={form.physicallyChallengedDescription}
                onChange={handleChange}
                textarea
                placeholder="Please describe your physical challenge"
                rows="3"
                error={validationErrors.physicallyChallengedDescription}
              />
            )}
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

    {/* Educational Qualification */}
    <div>
      <label className="block mb-1 font-medium">Educational Qualification</label>
      <Select
        value={form.educationalQualification ? { value: form.educationalQualification, label: form.educationalQualification } : null}
        onChange={(e) =>
          handleChange({ target: { name: "educationalQualification", value: e.value } })
        }
        options={[
          { value: "Other", label: "Other" },
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
        ]}
        placeholder="Select Educational Qualification"
        isClearable
      />
      {validationErrors.educationalQualification && (
        <p className="text-red-500 text-sm">{validationErrors.educationalQualification}</p>
      )}
    </div>

    {/* Certificate Courses */}
    <FloatingInput
      label="Certificate Courses (if any)"
      name="certificateCourses"
      value={form.certificateCourses}
      onChange={handleChange}
      placeholder="e.g., AWS Certified, PMP, Digital Marketing, etc."
    />

    {/* Specialization (normal input) */}
    <FloatingInput
      label="Specialization"
      name="specialization"
      value={form.specialization}
      onChange={handleChange}
      placeholder="e.g., Computer Science, Business Administration"
    />

       {/* ⭐ Employed In with Other option */}
    <div>
      <label className="block mb-1 font-medium">Employed In</label>
      <Select
        value={form.employedIn ? { value: form.employedIn, label: form.employedIn } : null}
        onChange={(e) => {
          handleChange({ target: { name: "employedIn", value: e.value } });
          // If not "Other", clear the other text field
          if (e.value !== "Other") {
            handleChange({ target: { name: "employedInOther", value: "" } });
          }
        }}
        options={[
          { value: "Other", label: "Other" },
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
      
      {/* Show text input when "Other" is selected */}
      {form.employedIn === "Other" && (
        <div className="mt-3">
          <FloatingInput
            label="Please specify your employment type"
            name="employedInOther"
            value={form.employedInOther || ""}
            onChange={handleChange}
            required
            placeholder="Enter your employment type"
            error={validationErrors.employedInOther}
          />
          {validationErrors.employedInOther && (
            <p className="text-red-500 text-sm">{validationErrors.employedInOther}</p>
          )}
        </div>
      )}
    </div>

        {/* ⭐ Occupation with Other option */}
    <div>
      <label className="block mb-1 font-medium">Occupation</label>
      <Select
        value={
          form.occupation
            ? { value: form.occupation, label: form.occupation }
            : null
        }
        onChange={(e) => {
          handleChange({ target: { name: "occupation", value: e.value } });
          // If not "Other", clear the other text field
          if (e.value !== "Other") {
            handleChange({ target: { name: "occupationOther", value: "" } });
          }
        }}
        options={[
          { value: "Other", label: "Other" },
          ...professionOptions,
        ]}
        placeholder="Select Occupation"
      />
      
      {/* Show text input when "Other" is selected */}
      {form.occupation === "Other" && (
        <div className="mt-3">
          <FloatingInput
            label="Please specify your occupation"
            name="occupationOther"
            value={form.occupationOther || ""}
            onChange={handleChange}
            required
            placeholder="Enter your occupation"
            error={validationErrors.occupationOther}
          />
          {validationErrors.occupationOther && (
            <p className="text-red-500 text-sm">{validationErrors.occupationOther}</p>
          )}
        </div>
      )}
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
          { value: "0-2L", label: "0 - 2L" },
          { value: "2L-5L", label: "2L - 5L" },
          { value: "5L-10L", label: "5L - 10L" },
          { value: "10L-15L", label: "10L - 15L" },
          { value: "15L-20L", label: "15L - 20L" },
          { value: "20L-50L", label: "20L - 50L" },
          { value: "50L-75L", label: "50L - 75L" },
          { value: "75L-1Cr", label: "75L to 1Cr" },
          { value: "1Cr-3Cr", label: "1Cr - 3Cr" },
          { value: "3Cr-5Cr", label: "3Cr - 5Cr" },
          { value: "5Cr-10Cr", label: "5Cr - 10Cr" },
          { value: "10Cr-20Cr", label: "10Cr - 20Cr" },
          { value: "20Cr+", label: "20Cr and Above" },
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
          // Reset state and district when country changes (only India has states/districts)
          if (e.value !== "India") {
            handleChange({ target: { name: "state", value: "" } });
            handleChange({ target: { name: "district", value: "" } });
          }
        }}
        options={[
          { value: "Other", label: "Other" },
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
        {/* ⭐ ADD CITY INPUT FIELD HERE with 15 character limit */}
    <FloatingInput
      label="City/Town"
      name="city"
      value={form.city}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 15) {
          handleChange(e);
        }
      }}
      placeholder="Enter your city or town (max 15 characters)"
      error={validationErrors.city}
      maxLength="15"
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

        {/* Address (Optional) - Commented out for now */}
    <FloatingInput
      label="Address (Optional)"
      name="address"
      value={form.address}
      onChange={handleChange}
      textarea
      placeholder="Enter your complete address"
      rows="4"
      error={validationErrors.address}
    />
  </div>
        )}

        {/* Step 6: About Yourself & Documents */}
        {step === 6 && (
          <div className="space-y-6">
                        {/* About Yourself with bold heading */}
            <div>
              <label className="block text-lg font-bold text-red-600 mb-3">
                📝 About Yourself
              </label>
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
                <span className={form.about?.length > 0 ? "text-green-600 font-medium" : "text-gray-500"}>
                  {form.about?.length || 0}/1000
                </span>
              </div>
            </div>

            {/* Photos Upload - Updated with green colors */}
            <div>
              <label className="block text-lg font-bold text-red-600 mb-1">
                📸 Profile Photos
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload clear, recent photos for better matches
              </p>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors duration-300 bg-gray-50 hover:bg-green-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={form.photos.length >= 3}
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    <span className="text-green-600 font-semibold">Click to upload photos</span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    PNG, JPG up to 5MB each (Max 3 photos)
                  </p>
                </div>
              </div>

              {/* Uploaded Photos Preview */}
              {form.photos.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-green-700">
                      Uploaded Photos ({form.photos.length}/3)
                    </p>
                    {form.photos.length >= 3 && (
                      <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                        ✓ Maximum 3 photos reached
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {form.photos.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg border-2 border-green-200 group-hover:border-green-500 transition-colors shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                          title="Remove photo"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                          {idx === 0 ? "Main" : idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
 {/* ID Proof Upload - Changed from Aadhar */}
<div>
  <label className="block text-lg font-bold text-red-600 mb-1">
    🆔 Upload Any ID Proof
  </label>
  <p className="text-sm text-gray-600 mb-3">
    Upload for identity verification
  </p>
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
              setError("ID Proof file too large (max 10MB)");
              return;
            }
            setForm((prev) => ({ ...prev, aadhar: file }));
            setError("");
          } else {
            setError("Please upload PDF, JPG, or PNG for ID Proof");
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
        <span className="text-green-600 font-semibold">
          Click to upload ID Proof
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

   {/* Membership Type - Updated with bold and 3 months */}
            <div>
              <label className="block text-lg font-bold text-red-600 mb-3">
                Membership Type *
              </label>

              <div className="flex flex-col space-y-3">
                {[
                  { value: "SILVER", label: "SILVER", price: "₹299/Per 3 Months" },
                  { value: "GOLD", label: "GOLD", price: "₹499/Per 3 Months" },
                  { value: "DIAMOND", label: "DIAMOND", price: "₹749/Per 3 Months" },
                ].map((membership) => (
                  <label
                    key={membership.value}
                    className="flex items-center gap-3 cursor-pointer p-3 border-2 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="membershipType"
                      value={membership.value}
                      checked={form.membershipType === membership.value}
                      onChange={handleChange}
                      className="text-green-600 focus:ring-green-500 w-4 h-5"
                    />
                    <span className="text-green-700 font-bold text-lg flex-1">{membership.label}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-green-600 font-bold text-base">{membership.price}</span>
                    </div>
                  </label>
                ))}
              </div>
              {validationErrors.membershipType && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.membershipType}
                </p>
              )}
            </div>
          </div>
        )}
        </form>
      </div>

      {/* Form controls - always visible at bottom */}
      <div className={inModal ? 'shrink-0 mt-4 px-6 pb-6' : 'mt-4'}>
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
    </div>
  );
}
