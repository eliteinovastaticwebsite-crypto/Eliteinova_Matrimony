import { useState, useEffect } from "react";
import profileService from "../services/profileService";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { buildImageUrl } from "../config/api";


const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [saveLoading, setSaveLoading] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [validPhotos, setValidPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
const [documentsLoading, setDocumentsLoading] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

// ✅ IMPROVED: Better URL formatting with path detection
const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    console.log("❌ Invalid URL provided:", url);
    return null;
  }
  
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    console.log("❌ Empty URL after trimming");
    return null;
  }

  console.log("🔗 Original URL:", trimmedUrl);

  // If it's already a full URL, use it directly
  if (trimmedUrl.startsWith('http')) {
    console.log("✅ Already full URL, using directly");
    return trimmedUrl;
  }
  
  // Handle different URL patterns from your backend
  let cleanUrl = trimmedUrl;
  
  // Remove API prefixes if present
  if (cleanUrl.startsWith('/api/')) {
    cleanUrl = cleanUrl.substring(5);
  } else if (cleanUrl.startsWith('api/')) {
    cleanUrl = cleanUrl.substring(4);
  }
  
  // Remove files/images prefix if present
  if (cleanUrl.startsWith('files/images/')) {
    cleanUrl = cleanUrl.substring('files/images/'.length);
  }
  
  console.log("🔄 Cleaned URL:", cleanUrl);
  
  // Use API utilities
  const finalUrl = buildImageUrl(cleanUrl);
  console.log("✅ Final image URL:", finalUrl);
  
  return finalUrl;
};

useEffect(() => {
  const fetchUserDocuments = async () => {
    try {
      setDocumentsLoading(true);
      
      console.log("📄 Starting document fetch...");
      
      // Try to fetch documents from backend
      try {
        const documentsResponse = await profileService.getMyDocuments();
        console.log("📄 Backend documents response:", documentsResponse);
        
        if (documentsResponse && documentsResponse.success && Array.isArray(documentsResponse.documents)) {
          console.log(`✅ Found ${documentsResponse.documents.length} documents from backend`);
          setDocuments(documentsResponse.documents);
          return; // Success - exit early
        } else {
          console.warn("⚠️ Backend returned unexpected response format:", documentsResponse);
        }
      } catch (backendError) {
        console.warn("❌ Backend documents endpoint failed:", backendError.message);
        // Continue to fallback
      }
      
      // ✅ FALLBACK: Use profile data to create document objects
      const fallbackDocuments = createFallbackDocuments(profile);
      console.log("🔄 Using fallback documents:", fallbackDocuments);
      setDocuments(fallbackDocuments);
      
    } catch (error) {
      console.error("❌ Error in document fetching:", error);
      // Even if everything fails, set empty array
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  if (isAuthenticated && profile) {
    fetchUserDocuments();
  }
}, [isAuthenticated, profile]);

// Helper function to try alternative document paths
const tryAlternativeDocumentPaths = async (userId) => {
  const alternativeDocs = [];
  
  // Try common document patterns
  const documentTypes = ['jathagam', 'resume', 'horoscope', 'biodata'];
  
  for (const docType of documentTypes) {
    try {
      // Try the path pattern you mentioned: uploads/users/{userId}/documents
      const { buildApiUrl } = await import('../config/api');
      const testUrl = buildApiUrl(`api/files/documents/uploads/users/${userId}/documents`);
      const response = await fetch(testUrl, { method: 'HEAD' });
      
      if (response.ok) {
        alternativeDocs.push({
          documentType: docType,
          fileName: `${docType}_document`,
          documentUrl: `uploads/users/${userId}/documents`,
          uploadedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      // Skip if this path doesn't work
      continue;
    }
  }
  
  return alternativeDocs;
};

// Helper function to create fallback documents from profile data
const createFallbackDocuments = (profile) => {
  if (!profile) return [];
  
  const fallbackDocuments = [];
  
  // Check for aadhar in profile
  if (profile.aadhar) {
    fallbackDocuments.push({
      id: Date.now(),
      documentType: 'AADHAR',
      fileName: 'Aadhar Document',
      documentUrl: profile.aadhar,
      uploadedAt: new Date().toISOString(),
      fileSize: 0,
      mimeType: 'application/pdf'
    });
  }
  
  return fallbackDocuments;
};

useEffect(() => {
  const checkImageValidity = async () => {
    if (photos.length === 0) return;
    
    console.log("🔍 Checking image validity...");
    const valid = [];
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo || !photo.trim()) continue;
      
      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => {
            console.log(`✅ Image ${i} is valid: ${photo}`);
            valid.push(photo);
            resolve();
          };
          img.onerror = () => {
            console.log(`❌ Image ${i} is invalid, skipping: ${photo}`);
            reject();
          };
          img.src = formatImageUrl(photo);
        });
      } catch (error) {
        // Image failed to load, skip it
        continue;
      }
    }
    
    console.log(`🎯 Found ${valid.length} valid photos out of ${photos.length}`);
    setValidPhotos(valid);
    
    // Update active image if current one is invalid
    if (valid.length > 0 && !valid.includes(photos[activeImage])) {
      const newActiveIndex = photos.indexOf(valid[0]);
      console.log(`🔄 Setting active image to first valid index: ${newActiveIndex}`);
      setActiveImage(newActiveIndex);
    }
  };

  checkImageValidity();
}, [photos]);

// Add this debug function
const debugImages = () => {
  console.log("🐛 DEBUG IMAGES:");
  console.log("All photos:", photos);
  
  photos.forEach((photo, index) => {
    console.log(`Image ${index}:`, {
      original: photo,
      formatted: formatImageUrl(photo),
      isValid: photo && photo.trim()
    });
  });
};

// Call it when profile loads
useEffect(() => {
  if (profile) {
    debugImages();
  }
}, [profile]);


  // ✅ FIXED: Fetch user profile with proper backend mapping
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated) {
          console.log("User not authenticated");
          setLoading(false);
          return;
        }

        const profileResponse = await profileService.getMyProfile();
        console.log("Real backend profile response:", profileResponse);

        if (
          profileResponse &&
          profileResponse.success &&
          profileResponse.profile
        ) {
          // ✅ PROPER DATA MAPPING from backend to frontend
          const mappedProfile = mapBackendProfileToFrontend(
            profileResponse.profile
          );
          console.log("Mapped profile for frontend:", mappedProfile);

          setProfile(mappedProfile);
          setEditedProfile(mappedProfile);

          // Handle photos array from backend
          if (mappedProfile.photos && Array.isArray(mappedProfile.photos)) {
            setPhotos(mappedProfile.photos);
          } else {
            setPhotos([]);
          }
        } else if (profileResponse && profileResponse.success === false) {
          // Profile doesn't exist - normal for new users
          console.log("No profile found, user needs to create one");
          setProfile(null);
          setEditedProfile(null);
          setPhotos([]);
        } else {
          throw new Error(
            profileResponse?.error || "Unexpected response from server"
          );
        }
      } catch (error) {
        console.error("Error fetching profile from backend:", error);
        // Don't show alert for "profile not found" - it's a normal state
        if (
          !error.message.includes("Profile not found") &&
          !error.message.includes("Failed to load profile")
        ) {
          alert("Failed to load profile: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  // Add this useEffect to handle initial image validation
useEffect(() => {
  if (photos.length > 0) {
    // Filter only valid photos
    const validPhotos = photos.filter(photo => photo && photo.trim());
    
    if (validPhotos.length > 0) {
      // If current activeImage points to an invalid photo, find first valid one
      const currentPhoto = photos[activeImage];
      if (!currentPhoto || !currentPhoto.trim()) {
        const firstValidIndex = photos.findIndex(photo => photo && photo.trim());
        if (firstValidIndex !== -1 && firstValidIndex !== activeImage) {
          console.log(`🔄 Initial: Switching from invalid index ${activeImage} to valid index ${firstValidIndex}`);
          setActiveImage(firstValidIndex);
        }
      }
    }
  }
}, [photos, activeImage]);

  // ✅ FIXED: Map backend profile to frontend format
  const mapBackendProfileToFrontend = (backendProfile) => {
    if (!backendProfile) return null;

    console.log("Mapping backend profile fields:", Object.keys(backendProfile));

    return {
      // ✅ Basic Info - Direct mapping from backend entity
      id: backendProfile.id,
      name: backendProfile.name,
      fullName: backendProfile.name, // Use name as fullName
      age: backendProfile.age,
      gender: backendProfile.gender,

      // ✅ Physical Attributes
      height: backendProfile.height,
      maritalStatus: backendProfile.maritalStatus,

      // ✅ Professional Info - Direct mapping
      education: backendProfile.education,
      profession: backendProfile.profession,
      occupation: backendProfile.occupation || backendProfile.profession,
      employedIn: backendProfile.employedIn,
      annualIncome: backendProfile.annualIncome,

      // ✅ Location Info
      city: backendProfile.city,
      district: backendProfile.district,
      state: backendProfile.state,
      country: backendProfile.country,

      // ✅ Religious Info
      religion: backendProfile.religion,
      caste: backendProfile.caste,
      subCaste: backendProfile.subCaste,
      subcaste: backendProfile.subCaste, // Support both spellings
      dosham: backendProfile.dosham,
      willingOtherCaste: backendProfile.willingOtherCaste,
      motherTongue: backendProfile.motherTongue,

      // ✅ Family Info
      familyStatus: backendProfile.familyStatus,
      familyType: backendProfile.familyType,
      profileFor: backendProfile.profileFor,
      category: backendProfile.category,

      // ✅ About & Preferences
      about: backendProfile.about,
      minAge: backendProfile.minAge,
      maxAge: backendProfile.maxAge,

      // ✅ Media & Documents
      photos: backendProfile.photos || [],
      isVerified: backendProfile.isVerified,
      isPremium: backendProfile.isPremium,

      // ✅ Handle missing fields with defaults
      location:
        backendProfile.district ||
        backendProfile.city ||
        "Location not specified",
      nativeDistrict: backendProfile.district,
      preferredLocation: backendProfile.district || backendProfile.state,

      // ✅ Document fields (might be null in your entity)
      jathagamFileId: backendProfile.jathagamFileId,
      resumeFileId: backendProfile.resumeFileId,
      jathagam: backendProfile.jathagam,
      resume: backendProfile.resume,

      // ✅ Fields that might be missing in backend but needed in frontend
      mobile: backendProfile.mobile || "",
      email: backendProfile.email || user?.email || "",
      specialization: backendProfile.specialization || "",
      childrenCount: backendProfile.childrenCount || "0",
      partnerAgeMin: backendProfile.minAge,
      partnerAgeMax: backendProfile.maxAge
    };
  };

  // ✅ FIXED: Create initial profile with backend-compatible data
  const createInitialProfile = async () => {
    try {
      setCreatingProfile(true);

      const initialProfileData = {
        name: user?.name || "New User",
        age: 25,
        gender: "MALE",
        height: 170,
        education: "Bachelor's",
        profession: "Not specified",
        employedIn: "Private",
        annualIncome: 200000, // Use number instead of string range
        religion: "Hindu",
        caste: "Not specified",
        subCaste: "Not specified",
        maritalStatus: "NEVER_MARRIED",
        dosham: "No",
        country: "India",
        state: "Tamil Nadu",
        district: "Chennai",
        city: "Chennai",
        familyStatus: "Middle Class",
        familyType: "Nuclear",
        willingOtherCaste: false,
        about: "New user profile. Please update your information.",
      };

      console.log("Creating profile with data:", initialProfileData);

      const createResponse = await profileService.updateProfile(
        initialProfileData
      );
      console.log("Profile creation response:", createResponse);

      if (createResponse && createResponse.success) {
        // Refresh the profile data
        const profileResponse = await profileService.getMyProfile();
        if (
          profileResponse &&
          profileResponse.success &&
          profileResponse.profile
        ) {
          const mappedProfile = mapBackendProfileToFrontend(
            profileResponse.profile
          );
          setProfile(mappedProfile);
          setEditedProfile(mappedProfile);
          alert(
            "Profile created successfully! Please update your information."
          );
        }
      } else {
        throw new Error(createResponse?.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);

      // More specific error messages
      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        alert(
          "Access denied. Please try logging out and logging in again, or contact support."
        );
      } else if (error.message.includes("401")) {
        alert("Session expired. Please log in again.");
      } else {
        alert("Failed to create profile: " + error.message);
      }
    } finally {
      setCreatingProfile(false);
    }
  };

  // ✅ FIXED: Handle save with backend-compatible structure
const handleSave = async () => {
    if (!editedProfile) return;

    try {
        setSaveLoading(true);

        // ✅ Map frontend fields to backend entity structure
        const profileDataToSave = {
            // Personal details - match backend entity fields
            name: editedProfile.fullName || editedProfile.name,
            age: editedProfile.age,
            gender: editedProfile.gender,
            height: editedProfile.height,

            // Contact details (if your backend supports these)
            mobile: editedProfile.mobile,
            email: editedProfile.email,

            // Religion & Community
            religion: editedProfile.religion,
            caste: editedProfile.caste,
            subCaste: editedProfile.subCaste || editedProfile.subcaste,
            dosham: editedProfile.dosham,
            maritalStatus: editedProfile.maritalStatus,
            motherTongue: editedProfile.motherTongue,

            // Professional details
            education: editedProfile.education,
            profession: editedProfile.profession || editedProfile.occupation,
            employedIn: editedProfile.employedIn,
            annualIncome: editedProfile.annualIncome,
            occupation: editedProfile.occupation,

            // Location details
            country: editedProfile.country,
            state: editedProfile.state,
            district: editedProfile.district,
            city: editedProfile.city,

            // Family details
            familyStatus: editedProfile.familyStatus,
            familyType: editedProfile.familyType,
            willingOtherCaste: editedProfile.willingOtherCaste,
            profileFor: editedProfile.profileFor,
            category: editedProfile.category,

            // About me
            about: editedProfile.about,

            // Preferences
            minAge: editedProfile.partnerAgeMin || editedProfile.minAge,
            maxAge: editedProfile.partnerAgeMax || editedProfile.maxAge,

            // Photos
            photos: photos,
        };

        console.log("💾 Saving profile data:", profileDataToSave);

        const updateResponse = await profileService.updateProfile(profileDataToSave);
        console.log("✅ Profile updated successfully:", updateResponse);

        if (updateResponse && updateResponse.success) {
            // ✅ Update local state with the response data from backend
            if (updateResponse.profile) {
                const mappedProfile = mapBackendProfileToFrontend(updateResponse.profile);
                setProfile(mappedProfile);
                setEditedProfile(mappedProfile);
            } else {
                // Fallback: use edited profile
                setProfile(editedProfile);
            }
            
            setIsEditing(false);
            alert("Profile updated successfully!");
        } else {
            throw new Error(updateResponse?.error || "Failed to update profile");
        }
    } catch (error) {
        console.error("❌ Error saving profile to backend:", error);
        alert(error.message || "Failed to save profile. Please try again.");
    } finally {
        setSaveLoading(false);
    }
};

  // ✅ FIXED: Handle photo upload with proper backend integration
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        return true;
      }
      alert(`File ${file.name} is too large or not supported`);
      return false;
    });

    if (validFiles.length > 0) {
      try {
        // Upload each photo to backend
        for (const file of validFiles) {
          const uploadResponse = await profileService.uploadProfilePhoto(file);
          console.log("Photo uploaded:", uploadResponse);

          // ✅ FIXED: Use the CORRECT imageUrl from backend response
          if (uploadResponse.imageUrl) {
            const newPhotoUrl = uploadResponse.imageUrl;
            console.log("🖼️ New photo URL from backend:", newPhotoUrl);

            setPhotos((prev) => [...prev, newPhotoUrl].slice(0, 6));

            // Update edited profile with new photos
            setEditedProfile((prev) => ({
              ...prev,
              photos: [...(prev?.photos || []), newPhotoUrl].slice(0, 6),
            }));
          } else {
            console.error("❌ No imageUrl in upload response:", uploadResponse);
          }
        }
      } catch (error) {
        console.error("Error uploading photos:", error);
        alert("Failed to upload photos. Please try again.");
      }
    }
  };

  const refreshProfile = async () => {
  try {
    console.log("🔁 Refreshing profile from backend...");
    const profileResponse = await profileService.getMyProfile();
    console.log("🔁 Profile refresh response:", profileResponse);
    if (profileResponse && profileResponse.success && profileResponse.profile) {
      const mappedProfile = mapBackendProfileToFrontend(profileResponse.profile);
      setProfile(mappedProfile);
      setEditedProfile(mappedProfile);
      // update photos array if backend returned photos
      if (mappedProfile.photos && Array.isArray(mappedProfile.photos)) {
        setPhotos(mappedProfile.photos);
      } else {
        setPhotos([]);
      }

      // Try refetching documents from backend as well (if endpoint exists)
      try {
        const docsResp = await profileService.getMyDocuments();
        if (docsResp && docsResp.success && Array.isArray(docsResp.documents)) {
          setDocuments(docsResp.documents);
        }
      } catch (docErr) {
        console.warn("Could not refresh documents list after profile refresh:", docErr);
      }
    } else {
      console.warn("Profile refresh: no profile returned");
    }
  } catch (err) {
    console.error("Error refreshing profile:", err);
  }
};

// Replace your existing handleDocumentUpload with this implementation
const handleDocumentUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    console.log(`📤 Uploading Aadhar document:`, file.name);

    // ALWAYS use "AADHAR" as document type
    const uploadResponse = await profileService.uploadDocument(file, "AADHAR");
    console.log(`✅ Aadhar upload response:`, uploadResponse);

    if (uploadResponse && uploadResponse.success) {
      alert(`Aadhar uploaded successfully!`);

      // Refresh documents list
      try {
        const documentsResponse = await profileService.getMyDocuments();
        if (documentsResponse && documentsResponse.success && Array.isArray(documentsResponse.documents)) {
          setDocuments(documentsResponse.documents);
        }
      } catch (refreshError) {
        console.warn("Could not refresh documents list:", refreshError);
      }

      // Refresh profile
      await refreshProfile();

    } else {
      throw new Error(uploadResponse?.error || `Failed to upload Aadhar`);
    }
  } catch (error) {
    console.error(`❌ Error uploading Aadhar:`, error);
    alert(`Failed to upload Aadhar: ${error.message || error}`);
  }
};

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

// Updated removePhoto function
const removePhoto = async (index) => {
  try {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setEditedProfile((prev) => ({
      ...prev,
      photos: newPhotos,
    }));

    // Handle active image after removal
    const validPhotos = newPhotos.filter(photo => photo && photo.trim());
    
    if (validPhotos.length === 0) {
      setActiveImage(0);
    } else if (activeImage >= validPhotos.length) {
      setActiveImage(validPhotos.length - 1);
    } else {
      // Check if current active image is still valid
      const currentPhoto = newPhotos[activeImage];
      if (!currentPhoto || !currentPhoto.trim()) {
        const firstValidIndex = newPhotos.findIndex(photo => photo && photo.trim());
        setActiveImage(firstValidIndex !== -1 ? firstValidIndex : 0);
      }
    }
  } catch (error) {
    console.error("Error removing photo:", error);
    alert("Failed to remove photo. Please try again.");
  }
};

  const previewFile = async (fileOrDocument) => {
  if (!fileOrDocument) {
    alert("File not available for preview");
    return;
  }

  try {
    if (fileOrDocument instanceof File) {
      // Handle newly uploaded files
      const url = URL.createObjectURL(fileOrDocument);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else if (typeof fileOrDocument === 'string') {
      // Handle string URLs - format them properly
      const formattedUrl = profileService.formatDocumentUrl(fileOrDocument);
      if (formattedUrl) {
        window.open(formattedUrl, "_blank");
      } else {
        alert("Could not generate document URL");
      }
    } else if (fileOrDocument.documentUrl) {
      // Handle document objects from backend
      const formattedUrl = profileService.formatDocumentUrl(fileOrDocument.documentUrl);
      if (formattedUrl) {
        window.open(formattedUrl, "_blank");
      } else {
        alert("Could not generate document URL");
      }
    } else {
      alert("Unsupported document format for preview");
    }
  } catch (error) {
    console.error("Error previewing file:", error);
    alert("Failed to preview file. Please try again.");
  }
};

  const getFileTypeIcon = (fileOrDocument) => {
  if (!fileOrDocument) return "📄";

  let fileName = '';
  let fileType = '';

  if (typeof fileOrDocument === 'string') {
    fileName = fileOrDocument;
  } else if (fileOrDocument instanceof File) {
    fileName = fileOrDocument.name;
    fileType = fileOrDocument.type;
  } else if (fileOrDocument.fileName) {
    fileName = fileOrDocument.fileName;
    fileType = fileOrDocument.fileType;
  } else if (fileOrDocument.documentUrl) {
    fileName = fileOrDocument.documentUrl;
  }

  if (fileName.match(/\.pdf$/i) || fileType === 'application/pdf') {
    return "📊";
  } else if (fileName.match(/\.docx?$/i) || fileType.includes('word')) {
    return "📝";
  } else if (fileType && fileType.startsWith("image/")) {
    return "🖼️";
  } else if (fileName.toLowerCase().includes('jathagam')) {
    return "📜";
  } else if (fileName.toLowerCase().includes('resume')) {
    return "📄";
  }
  
  return "📄";
};

  const formatFileSize = (fileOrDocument) => {
  let bytes = 0;

  if (fileOrDocument instanceof File) {
    bytes = fileOrDocument.size;
  } else if (fileOrDocument.fileSize) {
    bytes = fileOrDocument.fileSize;
  }

  if (!bytes || bytes === 0) return "Unknown size";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};



  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        if (photo && photo.startsWith("blob:")) {
          URL.revokeObjectURL(photo);
        }
      });
    };
  }, [photos]);

  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "professional", label: "Professional", icon: "💼" },
    { id: "family", label: "Family", icon: "🏠" },
    { id: "preferences", label: "Preferences", icon: "❤️" },
    { id: "documents", label: "Documents", icon: "📁" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ✅ FIXED: Show profile creation screen when no profile exists
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name || "User"}!
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't created your profile yet. Let's set up your matrimony
            profile to start finding matches.
          </p>
          <div className="space-y-4">
            <button
              onClick={createInitialProfile}
              disabled={creatingProfile}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center disabled:cursor-not-allowed"
            >
              {creatingProfile ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Profile...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Create My Profile
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Go to Home
            </button>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              Why create a profile?
            </h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Get personalized match suggestions</li>
              <li>• Showcase your personality and preferences</li>
              <li>• Connect with compatible partners</li>
              <li>• Increase your chances of finding the right match</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-red-800 to-red-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-yellow-300 transition font-medium"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/matches"
                    className="hover:text-yellow-300 transition font-medium"
                  >
                    Matches
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-profile"
                    className="text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/messages"
                    className="hover:text-yellow-300 transition font-medium"
                  >
                    Messages
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Enhanced Profile Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0">
            {/* ✅ FIXED: Profile Image Section */}
<div className="relative">
  {/* Main Profile Image */}
  <div className="w-52 h-52 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center border-8 border-white shadow-2xl overflow-hidden">
  {validPhotos.length > 0 && activeImage < photos.length && photos[activeImage] && validPhotos.includes(photos[activeImage]) ? (
    <img
      src={formatImageUrl(photos[activeImage])}
      alt={profile.fullName || profile.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        console.error(`❌ Main image failed: ${photos[activeImage]}`);
        // Find next valid image
        const currentIndex = validPhotos.indexOf(photos[activeImage]);
        const nextIndex = (currentIndex + 1) % validPhotos.length;
        const nextPhoto = validPhotos[nextIndex];
        const originalIndex = photos.indexOf(nextPhoto);
        setActiveImage(originalIndex);
      }}
      onLoad={() => console.log(`✅ Main image loaded: ${photos[activeImage]}`)}
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
      <span className="text-white text-4xl font-bold">
        {(profile.fullName || profile.name || "U").charAt(0).toUpperCase()}
      </span>
    </div>
  )}
</div>

{/* Thumbnails - Only show valid photos */}
{validPhotos.length > 1 && (
  <div className="flex gap-2 mt-4 overflow-x-auto max-w-52">
    {validPhotos.map((photo, validIndex) => {
      const originalIndex = photos.indexOf(photo);
      return (
        <button
          key={`thumb-${originalIndex}`}
          onClick={() => setActiveImage(originalIndex)}
          className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
            activeImage === originalIndex
              ? "border-red-500 shadow-md scale-105"
              : "border-gray-300 hover:border-gray-400 hover:scale-102"
          }`}
        >
          <img
            src={formatImageUrl(photo)}
            alt={`Thumbnail ${validIndex + 1}`}
            className="w-full h-full object-cover"
            onLoad={() => console.log(`✅ Thumbnail ${originalIndex} loaded`)}
          />
        </button>
      );
    })}
  </div>
)}

  {/* Upload Button */}
  {isEditing && (
    <label className="absolute -bottom-3 -right-3 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition cursor-pointer z-10">
      <span className="text-sm">📷</span>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </label>
  )}

  {/* Remove Photo Button */}
  {isEditing && photos.length > 0 && photos[activeImage] && (
    <button
      onClick={() => removePhoto(activeImage)}
      className="absolute -bottom-3 -left-3 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition z-10"
    >
      <span className="text-sm">🗑️</span>
    </button>
  )}
</div>

            {/* Profile Info */}
            <div className="flex-1 lg:ml-10 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={
                          editedProfile?.fullName || editedProfile?.name || ""
                        }
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        className="text-4xl font-bold border-b-2 border-yellow-400 focus:outline-none focus:border-red-500 bg-transparent w-full lg:w-auto"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      profile.fullName || profile.name || "User"
                    )}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start space-x-4 text-gray-600 flex-wrap gap-2">
                    <span className="flex items-center">
                      <span className="mr-2">📍</span>
                      {profile.district && profile.state
                        ? `${profile.district}, ${profile.state}`
                        : profile.location || "Not specified"}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-2">💼</span>
                      {profile.occupation ||
                        profile.profession ||
                        "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 flex space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saveLoading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg flex items-center disabled:cursor-not-allowed"
                      >
                        {saveLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">✓</span>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg flex items-center"
                    >
                      <span className="mr-2">✏️</span>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Profile Badges */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {/* Membership Type Badge */}
                {user?.membership && (
                  <span className={`px-4 py-2 rounded-full font-semibold shadow-sm ${
                    user.membership === 'DIAMOND' 
                      ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800'
                      : user.membership === 'GOLD'
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                      : user.membership === 'SILVER'
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <span className="mr-2">
                      {user.membership === 'DIAMOND' ? '💎' : user.membership === 'GOLD' ? '🥇' : '🥈'}
                    </span>
                    {user.membership} Member
                  </span>
                )}
                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold shadow-sm">
                  <span className="mr-2">👤</span>
                  {profile.gender || "Not specified"},{" "}
                  {profile.age || "Not specified"}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold shadow-sm">
                  <span className="mr-2">💍</span>
                  {profile.maritalStatus || "Not specified"}
                </span>
                <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-semibold shadow-sm">
                  <span className="mr-2">🎓</span>
                  {profile.education || "Not specified"}
                </span>
                <span className="bg-red-50 text-red-700 px-4 py-2 rounded-full font-semibold shadow-sm">
                  <span className="mr-2">💰</span>
                  {profile.annualIncome
                    ? `₹${profile.annualIncome.toLocaleString()}`
                    : "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-200">
          <div className="flex overflow-x-auto space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {activeTab === "personal" && (
            <PersonalInfoTab
              profile={profile}
              isEditing={isEditing}
              editedProfile={editedProfile}
              handleChange={handleChange}
            />
          )}

          {activeTab === "professional" && (
            <ProfessionalInfoTab
              profile={profile}
              isEditing={isEditing}
              editedProfile={editedProfile}
              handleChange={handleChange}
            />
          )}

          {activeTab === "family" && (
            <FamilyInfoTab
              profile={profile}
              isEditing={isEditing}
              editedProfile={editedProfile}
              handleChange={handleChange}
            />
          )}

          {activeTab === "preferences" && (
            <PreferencesTab
              profile={profile}
              isEditing={isEditing}
              editedProfile={editedProfile}
              handleChange={handleChange}
            />
          )}

{activeTab === "documents" && (
  <DocumentsTab
  isEditing={isEditing}
  onPreviewFile={previewFile}
  getFileTypeIcon={getFileTypeIcon}
  formatFileSize={formatFileSize}
  handleDocumentUpload={handleDocumentUpload}
  documents={documents}
  documentsLoading={documentsLoading}
/>
)}
        </div>

        {/* Profile Stats */}
        <ProfileStats 
  photosCount={photos.length}
  hasAadhar={documents.some(doc => 
    doc.documentType && doc.documentType.toLowerCase().includes('aadhar')
  )}
/>
      </div>
    </div>
  );
};

// Component for Personal Information Tab - UPDATED for backend fields
const PersonalInfoTab = ({
  profile,
  isEditing,
  editedProfile,
  handleChange,
}) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div className="w-2 h-8 bg-red-600 mr-3 rounded-full"></div>
      Personal Information
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <InfoField
          label="Full Name"
          value={profile.fullName || profile.name}
          editing={isEditing}
          editedValue={editedProfile?.fullName || editedProfile?.name}
          onChange={(value) => handleChange("fullName", value)}
          icon="👤"
        />
        <InfoField
          label="Age"
          value={profile.age}
          editing={isEditing}
          editedValue={editedProfile?.age}
          onChange={(value) => handleChange("age", parseInt(value) || 0)}
          type="number"
          icon="🎂"
        />
        <InfoField
          label="Gender"
          value={profile.gender}
          editing={isEditing}
          editedValue={editedProfile?.gender}
          onChange={(value) => handleChange("gender", value)}
          type="select"
          options={["MALE", "FEMALE"]}
          icon="⚧️"
        />
        <InfoField
          label="Height (cm)"
          value={profile.height}
          editing={isEditing}
          editedValue={editedProfile?.height}
          onChange={(value) => handleChange("height", parseInt(value) || 0)}
          type="number"
          step="1"
          icon="📏"
        />
        <InfoField
          label="Mobile"
          value={profile.mobile}
          editing={isEditing}
          editedValue={editedProfile?.mobile}
          onChange={(value) => handleChange("mobile", value)}
          icon="📱"
        />
        <InfoField
          label="Email"
          value={profile.email}
          editing={isEditing}
          editedValue={editedProfile?.email}
          onChange={(value) => handleChange("email", value)}
          type="email"
          icon="📧"
        />
      </div>
      <div className="space-y-6">
        <InfoField
          label="Religion"
          value={profile.religion}
          editing={isEditing}
          editedValue={editedProfile?.religion}
          onChange={(value) => handleChange("religion", value)}
          type="select"
          options={["Hindu", "Muslim", "Christian", "Other"]}
          icon="🕉️"
        />
        <InfoField
          label="Caste"
          value={profile.caste}
          editing={isEditing}
          editedValue={editedProfile?.caste}
          onChange={(value) => handleChange("caste", value)}
          type="select"
          options={["OBC", "BC", "MBC", "SC/ST", "Other"]}
          icon="👥"
        />
        <InfoField
          label="Subcaste"
          value={profile.subCaste || profile.subcaste}
          editing={isEditing}
          editedValue={editedProfile?.subCaste || editedProfile?.subcaste}
          onChange={(value) => handleChange("subCaste", value)}
          type="select"
          options={[
            "Vanniyar",
            "Thevar",
            "Mudaliar",
            "Iyer",
            "Iyengar",
            "Gounder",
            "Nadar",
            "Chettiar",
            "Other",
          ]}
          icon="👨‍👩‍👧‍👦"
        />
        <InfoField
          label="Dosham"
          value={profile.dosham}
          editing={isEditing}
          editedValue={editedProfile?.dosham}
          onChange={(value) => handleChange("dosham", value)}
          type="select"
          options={["No", "Yes", "Don't Know"]}
          icon="⭐"
        />
        <InfoField
          label="Marital Status"
          value={profile.maritalStatus}
          editing={isEditing}
          editedValue={editedProfile?.maritalStatus}
          onChange={(value) => handleChange("maritalStatus", value)}
          type="select"
          options={["NEVER_MARRIED", "DIVORCED", "WIDOWED"]}
          icon="💍"
        />
        <InfoField
          label="Mother Tongue"
          value={profile.motherTongue}
          editing={isEditing}
          editedValue={editedProfile?.motherTongue}
          onChange={(value) => handleChange("motherTongue", value)}
          icon="🗣️"
        />
      </div>
    </div>
  </div>
);

// Component for Professional Information Tab - UPDATED for backend fields
const ProfessionalInfoTab = ({
  profile,
  isEditing,
  editedProfile,
  handleChange,
}) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div className="w-2 h-8 bg-yellow-500 mr-3 rounded-full"></div>
      Professional Information
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <InfoField
          label="Highest Education"
          value={profile.education}
          editing={isEditing}
          editedValue={editedProfile?.education}
          onChange={(value) => handleChange("education", value)}
          type="select"
          options={["High School", "Bachelor's", "Master's", "PhD"]}
          icon="🎓"
        />
        <InfoField
          label="Specialization"
          value={profile.specialization}
          editing={isEditing}
          editedValue={editedProfile?.specialization}
          onChange={(value) => handleChange("specialization", value)}
          icon="📚"
        />
        <InfoField
          label="Profession"
          value={profile.profession || profile.occupation}
          editing={isEditing}
          editedValue={editedProfile?.profession || editedProfile?.occupation}
          onChange={(value) => handleChange("profession", value)}
          icon="💼"
        />
      </div>
      <div className="space-y-6">
        <InfoField
          label="Employment Type"
          value={profile.employedIn}
          editing={isEditing}
          editedValue={editedProfile?.employedIn}
          onChange={(value) => handleChange("employedIn", value)}
          type="select"
          options={[
            "Private",
            "Government",
            "Self-Employed",
            "Business",
            "Not Employed",
          ]}
          icon="🏢"
        />
        <InfoField
          label="Annual Income (₹)"
          value={profile.annualIncome}
          editing={isEditing}
          editedValue={editedProfile?.annualIncome}
          onChange={(value) =>
            handleChange("annualIncome", parseInt(value) || 0)
          }
          type="number"
          icon="💰"
        />
      </div>
    </div>
  </div>
);

// Component for Family Information Tab - UPDATED for backend fields
const FamilyInfoTab = ({ profile, isEditing, editedProfile, handleChange }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div className="w-2 h-8 bg-red-500 mr-3 rounded-full"></div>
      Family Background
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <InfoField
          label="Family Status"
          value={profile.familyStatus}
          editing={isEditing}
          editedValue={editedProfile?.familyStatus}
          onChange={(value) => handleChange("familyStatus", value)}
          type="select"
          options={["Middle Class", "Upper Middle Class", "Rich"]}
          icon="📊"
        />
        <InfoField
          label="Family Type"
          value={profile.familyType}
          editing={isEditing}
          editedValue={editedProfile?.familyType}
          onChange={(value) => handleChange("familyType", value)}
          type="select"
          options={["Joint", "Nuclear"]}
          icon="🏠"
        />
        <InfoField
          label="Willing to consider other castes"
          value={profile.willingOtherCaste ? "Yes" : "No"}
          editing={isEditing}
          editedValue={editedProfile?.willingOtherCaste}
          onChange={(value) =>
            handleChange("willingOtherCaste", value === "Yes")
          }
          type="select"
          options={["Yes", "No"]}
          icon="❤️"
        />
      </div>
      <div className="space-y-6">
        <InfoField
          label="State"
          value={profile.state}
          editing={isEditing}
          editedValue={editedProfile?.state}
          onChange={(value) => handleChange("state", value)}
          icon="📍"
        />
        <InfoField
          label="District"
          value={profile.district}
          editing={isEditing}
          editedValue={editedProfile?.district}
          onChange={(value) => handleChange("district", value)}
          icon="🗺️"
        />
        <InfoField
          label="City"
          value={profile.city}
          editing={isEditing}
          editedValue={editedProfile?.city}
          onChange={(value) => handleChange("city", value)}
          icon="🏙️"
        />
        <InfoField
          label="Country"
          value={profile.country}
          editing={isEditing}
          editedValue={editedProfile?.country}
          onChange={(value) => handleChange("country", value)}
          icon="🌎"
        />
      </div>
    </div>
  </div>
);

// Component for Preferences Tab - UPDATED for backend fields
const PreferencesTab = ({
  profile,
  isEditing,
  editedProfile,
  handleChange,
}) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div className="w-2 h-8 bg-yellow-500 mr-3 rounded-full"></div>
      Partner Preferences
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <InfoField
          label="Preferred Min Age"
          value={profile.minAge || profile.partnerAgeMin}
          editing={isEditing}
          editedValue={editedProfile?.minAge || editedProfile?.partnerAgeMin}
          onChange={(value) => handleChange("minAge", parseInt(value) || 25)}
          type="number"
          icon="👤"
        />
        <InfoField
          label="Preferred Max Age"
          value={profile.maxAge || profile.partnerAgeMax}
          editing={isEditing}
          editedValue={editedProfile?.maxAge || editedProfile?.partnerAgeMax}
          onChange={(value) => handleChange("maxAge", parseInt(value) || 35)}
          type="number"
          icon="👤"
        />
      </div>
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-2">About Me</h3>
          {isEditing ? (
            <textarea
              value={editedProfile?.about || ""}
              onChange={(e) => handleChange("about", e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
              placeholder="Tell us about yourself, your interests, and what you're looking for in a partner..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {profile.about || "No information provided yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ✅ Add this helper function to find specific document types
const getDocumentByType = (docType, documents) => {
  if (!documents || !Array.isArray(documents)) return null;
  return documents.find(doc => 
    doc.documentType && doc.documentType.toLowerCase().includes(docType.toLowerCase())
  );
};

// Component for Documents Tab - UPDATED for backend fields
// ✅ FIXED DocumentsTab Component
const DocumentsTab = ({
  isEditing,
  onPreviewFile,
  getFileTypeIcon,
  formatFileSize,
  handleDocumentUpload,
  documents = [],
  documentsLoading = false
}) => {
  // Find Aadhar document
  const aadharDoc = getDocumentByType('aadhar', documents);
  const displayAadhar = aadharDoc;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-2 h-8 bg-blue-500 mr-3 rounded-full"></div>
        Identity Documents
      </h2>

      {documentsLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading documents...</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Aadhar Section */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🆔</span>
            Aadhar Card (Identity Proof)
          </h3>

          {displayAadhar ? (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {getFileTypeIcon(aadharDoc)}
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    {aadharDoc?.fileName || 'Aadhar Document'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {aadharDoc?.uploadedAt ? 
                      `Uploaded ${new Date(aadharDoc.uploadedAt).toLocaleDateString()}` : 
                      'Uploaded'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Used for identity verification (kept confidential)
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onPreviewFile(aadharDoc)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>👁️</span>
                  View
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <span className="text-4xl mb-3">📤</span>
              <p className="text-gray-600 mb-2">No Aadhar uploaded yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Upload your Aadhar for identity verification
              </p>
              {isEditing && (
                <label className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer">
                  <span className="mr-2">📁</span>
                  Upload Aadhar
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload(e, "AADHAR")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {/* All Documents Section */}
        {documents.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📂</span>
              All Documents ({documents.length})
            </h3>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {getFileTypeIcon(doc)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{doc.fileName || doc.documentType}</p>
                      <p className="text-xs text-gray-600">
                        {doc.documentType} • {formatFileSize(doc)} • 
                        {doc.uploadedAt && ` Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onPreviewFile(doc)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <span>👁️</span>
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for Profile Stats
const ProfileStats = ({ photosCount, hasAadhar = false }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div className="w-2 h-8 bg-gray-600 mr-3 rounded-full"></div>
      Profile Statistics
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard
        value={`${photosCount}/6`}
        label="Photos Uploaded"
        color="red"
        icon="🖼️"
      />
      <StatCard
        value={hasAadhar ? "Yes" : "No"}
        label="Aadhar Uploaded"
        color="yellow"
        icon="🆔"
      />
      <StatCard value="95%" label="Profile Complete" color="blue" icon="✅" />
    </div>
  </div>
);

// Reusable Stat Card Component
const StatCard = ({ value, label, color, icon }) => {
  const colorClasses = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
  };

  return (
    <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition">
      <div
        className={`${colorClasses[color]} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}
      >
        <span className="text-white text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

// Reusable Info Field Component
const InfoField = ({
  label,
  value,
  editing,
  editedValue,
  onChange,
  type = "text",
  options,
  icon,
  step,
}) => {
  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <span>{icon}</span>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        {editing ? (
          type === "select" ? (
            <select
              value={editedValue || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 bg-white"
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : type === "date" ? (
            <input
              type="date"
              value={editedValue || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          ) : type === "number" ? (
            <input
              type="number"
              step={step || "1"}
              value={editedValue || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          ) : (
            <input
              type={type}
              value={editedValue || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          )
        ) : (
          <div className="p-3 text-gray-800 bg-white rounded-lg border border-gray-200">
            {value || "Not specified"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
