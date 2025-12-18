// src/services/ProfileService.js - FIXED
import api from '../api/axios';

class profileService {
  // ✅ Enhanced searchProfiles with real backend integration
  async searchProfiles(filters = {}) {
    try {
      console.log("🔍 Searching profiles with filters:", filters);
      
      const backendFilters = this.mapFiltersToBackend(filters);
      
      // ✅ FIX: Add pagination and ensure all required fields
      const searchRequest = {
        ...backendFilters,
        page: filters.page || 0,
        size: filters.size || 12
      };
      
      const response = await api.post('/api/profiles/search', searchRequest, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Search response received:", response.data);
      return response.data;
      
    } catch (error) {
      console.error("❌ Search error:", error);
      
      // More detailed error information
      console.error("🔍 Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Search failed. Please try again.');
    }
  }

 mapFiltersToBackend(filters) {
  const fieldMapping = {
    gender: 'gender',
    minAge: 'minAge',
    maxAge: 'maxAge',
    religion: 'religion',
    caste: 'caste',
    subCaste: 'subCaste',
    maritalStatus: 'maritalStatus',
    education: 'education',
    occupation: 'occupation',
    employedIn: 'employedIn',
    annualIncome: 'annualIncome',
    country: 'country',
    state: 'state',
    district: 'district',
    category: 'category',
    dosham: 'dosham'
  };

  const backendFilters = {};

  Object.keys(filters || {}).forEach(key => {
    if (!fieldMapping[key]) return; // not a mapped field

    let val = filters[key];

    // normalize react-select value objects: { value, label }
    if (val && typeof val === 'object') {
      // handle array of selected objects
      if (Array.isArray(val)) {
        val = val.map(v => (v && v.value !== undefined ? v.value : v)).filter(Boolean);
        if (val.length === 0) return;
      } else {
        // single object
        if (val.value !== undefined) val = val.value;
        else if (val.label !== undefined && typeof val.label === 'string') val = val.label;
        else val = JSON.stringify(val); // fallback
      }
    }

    // convert numbers and booleans to strings only if you want; keep numbers as-is
    if (typeof val === 'string') val = val.trim();

    // Only skip null/undefined/empty-string
    if (val === null || val === undefined) return;
    if (typeof val === 'string' && val === '') return;
    if (Array.isArray(val) && val.length === 0) return;

    backendFilters[fieldMapping[key]] = val;
  });

  console.log("🎯 Mapped backend filters:", backendFilters);
  return backendFilters;
}

  // Get all profiles with pagination
  async getAllProfiles(page = 0, size = 12) {
    try {
      const response = await api.get('/api/profiles', { 
        params: { page, size } 
      });
      return response.data;
    } catch (error) {
      console.error('Get profiles error:', error);
      throw new Error(error.response?.data?.message || 'Failed to load profiles');
    }
  }

  // Get featured profiles (first few profiles)
  async getFeaturedProfiles(limit = 3) {
    try {
      const response = await api.get('/api/profiles', { 
        params: { page: 0, size: limit } 
      });
      return response.data.content || [];
    } catch (error) {
      console.error('Get featured profiles error:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // Get profile by ID
  async getProfileById(id) {
    try {
      console.log("🔄 getProfileById called with ID:", id);
      
      const response = await api.get(`/api/profiles/${id}`);
      console.log("✅ getProfileById RAW response:", response);
      console.log("✅ getProfileById response.data:", response.data);
      
      return response.data;
    } catch (error) {
      console.error("❌ getProfileById error:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      throw new Error(error.response?.data?.message || 'Profile not found');
    }
  }

  // Get user's own profile
  async getMyProfile() {
    try {
      const response = await api.get('/api/profiles/my-profile');
      console.log('My profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get my profile error:', error);
      throw new Error(error.response?.data?.error || 'Failed to load profile');
    }
  }

  // ✅ FIXED: Get user documents from backend
  async getMyDocuments() {
    try {
      const token = localStorage.getItem('token');
      console.log("📄 Fetching user documents...");
      
      const response = await api.get('/api/files/my-documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Documents response:", response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      throw new Error(`Failed to fetch documents: ${error.response?.data?.message || error.message}`);
    }
  }

  // ✅ FIXED: Upload document method
  async uploadDocument(file, documentType) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      console.log(`📤 Uploading ${documentType} document:`, file.name);

      const response = await api.post('/api/files/upload-document', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("✅ Document upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      throw new Error(`Failed to upload document: ${error.response?.data?.message || error.message}`);
    }
  }

  // ✅ FIXED: Enhanced URL formatting for documents
  formatDocumentUrl(documentPath) {
    if (!documentPath) return null;
    
    console.log("🔗 Formatting document URL:", documentPath);
    
    // If it's already a full URL, return as is
    if (documentPath.startsWith('http')) {
      return documentPath;
    }
    
    // If it starts with /api/files/, it's already a complete endpoint
    if (documentPath.startsWith('/api/files/')) {
      return `http://localhost:8080${documentPath}`;
    }
    
    // Handle different path patterns
    let cleanPath = documentPath;
    
    // Remove leading slashes
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    
    // Construct the correct API endpoint
    return `http://localhost:8080/api/files/documents/${cleanPath}`;
  }

  // ✅ FIXED: SINGLE updateProfile method - Using POST to match backend
async updateProfile(profileData) {
    try {
        console.log('💾 Updating profile with data:', profileData);
        
        // ✅ Using POST to match backend endpoint
        const response = await api.post('/api/profiles', profileData);
        console.log('✅ Update profile response:', response.data);
        
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.error || 'Failed to update profile');
        }
    } catch (error) {
        console.error('❌ Update profile error:', error);
        
        // ✅ Better error handling
        if (error.response?.status === 403) {
            throw new Error('Access denied. Please check your authentication.');
        } else if (error.response?.status === 500) {
            // Handle the unique constraint error specifically
            if (error.response?.data?.error?.includes('duplicate key') || 
                error.response?.data?.error?.includes('already exists')) {
                throw new Error('Profile already exists for this user. Please refresh the page and try again.');
            }
        }
        
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update profile');
    }
}

  // Express interest
  async expressInterest(profileId) {
    try {
      const response = await api.post('/api/interests/send', { profileId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to express interest');
    }
  }

  // ✅ Upload profile photo method
  async uploadProfilePhoto(photoFile) {
    try {
      console.log("📤 Starting photo upload:", photoFile.name);
      
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('type', 'PROFILE_PHOTO');
      
      const response = await api.post('/api/files/upload-profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for large files
      });
      
      console.log("✅ Photo upload response:", response.data);
      
      // Handle different response formats
      if (response.data.success) {
        return {
          success: true,
          imageUrl: response.data.imageUrl || response.data.url || response.data.filePath,
          message: response.data.message || 'Photo uploaded successfully'
        };
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error("❌ Photo upload error:", error);
      
      // Detailed error analysis
      if (error.response) {
        console.error("📊 Upload error details:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to upload photo. Please try again.'
      );
    }
  }

  // ✅ Get image with authentication
  async getImageWithAuth(imagePath) {
    try {
      const response = await api.get(`/api/files/images/${imagePath}`, {
        responseType: 'blob', // Important for images
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("❌ Error loading image with auth:", error);
      throw error;
    }
  }

  // ✅ Check if image exists
  async checkImageExists(imageUrl) {
    try {
      const response = await api.head(imageUrl);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // ✅ Delete profile photo
  async deleteProfilePhoto(photoUrl) {
    try {
      // Extract photo ID or path from URL
      const photoPath = this.extractPhotoPath(photoUrl);
      const response = await api.delete(`/api/files/profile-photo`, {
        data: { photoPath }
      });
      return response.data;
    } catch (error) {
      console.error("❌ Delete photo error:", error);
      throw new Error(
        error.response?.data?.message || 'Failed to delete photo'
      );
    }
  }

  // ✅ Extract photo path from URL
  extractPhotoPath(photoUrl) {
    if (!photoUrl) return null;
    
    // Remove base URL to get the path
    const baseUrl = 'http://localhost:8080/api/files/images/';
    if (photoUrl.startsWith(baseUrl)) {
      return photoUrl.replace(baseUrl, '');
    }
    
    // If it's already a relative path, return as is
    return photoUrl;
  }

  // Get community stats (mock for now - can be implemented with real backend later)
  async getCommunityStats() {
    try {
      // This could be a real endpoint like /api/profiles/community-stats
      // For now, return mock data
      return {
        success: true,
        statistics: {
          Vanniyar: 1250,
          Gounder: 980,
          Thevar: 850,
          Nadar: 720,
          Iyer: 650,
          Chettiar: 580,
        }
      };
    } catch (error) {
      console.error('Get community stats error:', error);
      return {
        success: true,
        statistics: {
          Vanniyar: 1250,
          Gounder: 980,
          Thevar: 850,
        }
      };
    }
  }

  // ✅ Get profiles by community
  async getProfilesByCommunity(community, page = 0, size = 12) {
    try {
      const response = await api.get(`/api/profiles/community/${community}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load community profiles');
    }
  }

  // ✅ Get profiles by religion
  async getProfilesByReligion(religion, page = 0, size = 12) {
    try {
      const response = await api.get(`/api/profiles/religion/${religion}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load religion profiles');
    }
  }

  // ✅ Get profiles by gender
  async getProfilesByGender(gender, page = 0, size = 12) {
    try {
      const response = await api.get(`/api/profiles/gender/${gender}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load gender profiles');
    }
  }

  // ✅ Get featured profiles from backend
  async getBackendFeaturedProfiles(limit = 6) {
    try {
      const response = await api.get('/api/profiles/featured', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get featured profiles error:', error);
      // Fallback to regular profiles
      return this.getAllProfiles(0, limit);
    }
  }
  
  async getContactRequestStatus(profileId) {
  try {
    const response = await api.get(`/api/profiles/${profileId}/request-status`);
    console.log('🔍 Contact request status:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching contact request status:', error);
    // Return fallback data (matches your getBackendFeaturedProfiles pattern)
    return {
      success: false,
      status: null,
      message: error.response?.data?.message || 'Failed to fetch contact request status'
    };
  }
}

  // ✅ Get premium profiles
  async getPremiumProfiles(limit = 8) {
    try {
      const response = await api.get('/api/profiles/premium', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get premium profiles error:', error);
      return { success: true, profiles: [] };
    }
  }

  // ✅ Get recent profiles
  async getRecentProfiles(limit = 8) {
    try {
      const response = await api.get('/api/profiles/recent', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get recent profiles error:', error);
      return { success: true, profiles: [] };
    }
  }

  async requestContact(profileId, payload = {}) {
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token'); // support either key
    console.log('📨 Sending contact request for profile', profileId, payload);

    // Backend endpoint exposed in ProfileController
    const url = `/api/profiles/${profileId}/request-contact`;
    console.log('➡️ POST', url);

    const response = await api.post(url, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ requestContact response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ requestContact error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to send contact request'
    };
  }
}


// Fetch contact request status & contact for the current user -> profile owner
// This should return status and contact if accepted:
// Example response: { success: true, status: "PENDING"|"ACCEPTED"|"REJECTED", contact: { mobile: "...", name: "..." }, requestId: 123 }
async fetchContact(profileId) {
  try {
    const token = localStorage.getItem('token');

    // GET by profileId: adjust endpoint to match your backend implementation
    const response = await api.get(`/api/contacts/status`, {
      params: { profileId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ fetchContact response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ fetchContact error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch contact status'
    };
  }
}

/*
ALTERNATIVE endpoint examples (if backend expects them):
- POST request: `/api/profiles/${profileId}/request-contact`
- GET status:  `/api/profiles/${profileId}/contact-status` or `/api/profiles/${profileId}/contact`
Replace above URLs accordingly.
*/

  // Accept contact request and share mobile number
async acceptContactRequest(profileId) {
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token'); // support either key
    console.log('✅ Accepting contact request for profile', profileId);

    const response = await api.post(`/api/profiles/${profileId}/accept-contact`, {}, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    });

    console.log('✅ Accept contact response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Accept contact error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to accept contact request'
    };
  }
}

// Reject contact request
async rejectContactRequest(profileId) {
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token'); // support either key
    console.log('❌ Rejecting contact request for profile', profileId);

    const response = await api.post(`/api/profiles/${profileId}/reject-contact`, {}, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    });

    console.log('✅ Reject contact response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Reject contact error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to reject contact request'
    };
  }
}
}

export default new profileService();
