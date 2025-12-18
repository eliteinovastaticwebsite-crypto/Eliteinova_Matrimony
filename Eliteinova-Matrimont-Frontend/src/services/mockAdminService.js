// src/services/mockAdminService.js
export const mockAdminService = {
  async getUsers() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUsers = [
      {
        id: 1,
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        mobile: "+91 9876543210",
        role: "USER",
        status: "ACTIVE",
        membership: "GOLD",
        createdAt: "2024-01-15T10:30:00Z",
        lastLogin: "2024-03-20T14:25:00Z",
        profileViews: 145,
        messagesSent: 67,
        connections: 23,
        likesGiven: 45,
        city: "Mumbai",
        age: 28,
        profession: "Software Engineer",
        education: "B.Tech Computer Science",
        profileCompletion: 95,
        emailVerified: true,
        phoneVerified: true,
        profileVerified: true,
        lastActive: "2024-03-21T09:15:00Z",
        region: "West",
        country: "India"
      },
      {
        id: 2,
        name: "Priya Sharma",
        email: "priya@example.com",
        mobile: "+91 9876543211",
        role: "USER",
        status: "PENDING",
        membership: "SILVER",
        createdAt: "2024-02-10T11:20:00Z",
        lastLogin: "2024-03-19T16:45:00Z",
        profileViews: 89,
        messagesSent: 34,
        connections: 12,
        likesGiven: 28,
        city: "Delhi",
        age: 26,
        profession: "Doctor",
        education: "MBBS",
        profileCompletion: 78,
        emailVerified: true,
        phoneVerified: false,
        profileVerified: false,
        lastActive: "2024-03-19T16:45:00Z",
        region: "North",
        country: "India"
      },
      {
        id: 3,
        name: "Amit Patel",
        email: "amit@example.com",
        mobile: "+91 9876543212",
        role: "ADMIN",
        status: "ACTIVE",
        membership: "DIAMOND",
        createdAt: "2024-01-05T09:15:00Z",
        lastLogin: "2024-03-21T08:30:00Z",
        profileViews: 234,
        messagesSent: 156,
        connections: 67,
        likesGiven: 89,
        city: "Bangalore",
        age: 30,
        profession: "Business Owner",
        education: "MBA",
        profileCompletion: 100,
        emailVerified: true,
        phoneVerified: true,
        profileVerified: true,
        lastActive: "2024-03-21T08:30:00Z",
        region: "South",
        country: "India"
      },
      {
        id: 4,
        name: "Sneha Reddy",
        email: "sneha@example.com",
        mobile: "+91 9876543213",
        role: "USER",
        status: "INACTIVE",
        membership: "FREE",
        createdAt: "2024-03-01T14:10:00Z",
        lastLogin: "2024-03-15T11:20:00Z",
        profileViews: 45,
        messagesSent: 23,
        connections: 8,
        likesGiven: 15,
        city: "Hyderabad",
        age: 25,
        profession: "Teacher",
        education: "B.Ed",
        profileCompletion: 65,
        emailVerified: true,
        phoneVerified: true,
        profileVerified: false,
        lastActive: "2024-03-15T11:20:00Z",
        region: "South",
        country: "India"
      },
      {
        id: 5,
        name: "Vikram Singh",
        email: "vikram@example.com",
        mobile: "+91 9876543214",
        role: "USER",
        status: "ACTIVE",
        membership: "GOLD",
        createdAt: "2024-02-20T13:45:00Z",
        lastLogin: "2024-03-21T10:15:00Z",
        profileViews: 167,
        messagesSent: 89,
        connections: 34,
        likesGiven: 56,
        city: "Pune",
        age: 32,
        profession: "Engineer",
        education: "M.Tech",
        profileCompletion: 88,
        emailVerified: true,
        phoneVerified: true,
        profileVerified: true,
        lastActive: "2024-03-21T10:15:00Z",
        region: "West",
        country: "India"
      },
      {
        id: 6,
        name: "Anjali Mehta",
        email: "anjali@example.com",
        mobile: "+91 9876543215",
        role: "USER",
        status: "PENDING",
        membership: "SILVER",
        createdAt: "2024-03-10T16:30:00Z",
        lastLogin: "2024-03-21T12:45:00Z",
        profileViews: 67,
        messagesSent: 28,
        connections: 15,
        likesGiven: 22,
        city: "Chennai",
        age: 27,
        profession: "Architect",
        education: "B.Arch",
        profileCompletion: 72,
        emailVerified: true,
        phoneVerified: false,
        profileVerified: false,
        lastActive: "2024-03-21T12:45:00Z",
        region: "South",
        country: "India"
      },
      {
        id: 7,
        name: "Karthik Nair",
        email: "karthik@example.com",
        mobile: "+91 9876543216",
        role: "USER",
        status: "SUSPENDED",
        membership: "FREE",
        createdAt: "2024-01-30T10:15:00Z",
        lastLogin: "2024-02-28T14:20:00Z",
        profileViews: 123,
        messagesSent: 45,
        connections: 23,
        likesGiven: 34,
        city: "Kochi",
        age: 29,
        profession: "Marketing Manager",
        education: "MBA Marketing",
        profileCompletion: 82,
        emailVerified: true,
        phoneVerified: true,
        profileVerified: true,
        lastActive: "2024-02-28T14:20:00Z",
        region: "South",
        country: "India"
      },
      {
        id: 8,
        name: "Divya Iyer",
        email: "divya@example.com",
        mobile: "+91 9876543217",
        role: "USER",
        status: "ACTIVE",
        membership: "DIAMOND",
        createdAt: "2024-03-05T11:45:00Z",
        lastLogin: "2024-03-20T17:30:00Z",
        profileViews: 278,
        messagesSent: 134,
        connections: 56,
        likesGiven: 78,
        city: "Mumbai",
        age: 24,
        profession: "Fashion Designer",
        education: "Fashion Design",
        profileCompletion: 92,
        emailVerified: true,
        phoneVerified: true,
        profileVerified: true,
        lastActive: "2024-03-20T17:30:00Z",
        region: "West",
        country: "India"
      }
    ];

    return {
      users: mockUsers,
      total: mockUsers.length,
      success: true,
      message: "Users fetched successfully"
    };
  },

  async updateUserStatus(userId, newStatus) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const shouldFail = Math.random() < 0.1;
    
    if (shouldFail) {
      throw new Error("Failed to update user status. Please try again.");
    }
    
    return {
      success: true,
      message: `User status updated to ${newStatus} successfully`,
      userId,
      newStatus
    };
  },

  async getDashboardStats() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalUsers: 1247,
      activeUsers: 892,
      newUsersToday: 23,
      totalMatches: 5678,
      successfulMatches: 2345,
      pendingMatches: 123,
      matchRate: 68.7,
      revenue: 1245678,
      monthlyRevenue: 234567,
      premiumUsers: 456,
      conversionRate: 27.6,
      engagementRate: 68.5,
      pendingVerifications: 12,
      dailyActiveUsers: 324,
      weeklyActiveUsers: 1247,
      monthlyActiveUsers: 4567,
      success: true
    };
  },

  async getUserDetails(userId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const users = await this.getUsers();
    const user = users.users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return {
      user: {
        ...user,
        profile: {
          age: user.age,
          education: user.education,
          profession: user.profession,
          location: user.city,
          maritalStatus: "Never Married",
          height: "5'8\"",
          religion: "Hindu",
          caste: "General",
          motherTongue: "Hindi",
          annualIncome: "₹12-15 LPA",
          familyBackground: "Middle Class, Nuclear Family",
          hobbies: ["Reading", "Travel", "Music"],
          dietaryHabits: "Vegetarian"
        },
        subscription: {
          plan: user.membership,
          status: user.status,
          joinedDate: user.createdAt,
          renewalDate: "2024-04-15"
        },
        verified: user.profileVerified,
        photos: [
          { id: 1, url: '', status: 'APPROVED', isPrimary: true, description: 'Profile Photo' },
          { id: 2, url: '', status: 'PENDING', isPrimary: false, description: 'Full Body Shot' },
          { id: 3, url: '', status: 'APPROVED', isPrimary: false, description: 'Hobby Photo' }
        ],
        preferences: {
          ageRange: { min: 25, max: 32 },
          heightRange: { min: "5'2\"", max: "5'8\"" },
          religion: "Hindu",
          profession: "Any",
          education: "Graduate and above",
          location: ["Mumbai", "Pune", "Bangalore"]
        },
        activity: {
          lastLogin: user.lastLogin,
          profileCompleteness: user.profileCompletion,
          responseRate: 78,
          averageResponseTime: "2.3 hours"
        }
      },
      success: true
    };
  },

  async getMembershipPlans() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          plans: [
            {
              id: 1,
              name: "SILVER",
              price: 999,
              duration: "30",
              popular: false,
              status: "ACTIVE",
              features: [
                "Basic Profile Visibility",
                "Limited Swipes per Day",
                "Standard Matching",
                "5 Profile Views per day",
                "Basic Search Filters",
                "Email Support"
              ],
              description: "Perfect for getting started with basic features",
              subscribers: 234,
              color: "gray",
              trialPeriod: 0,
              maxConnections: 50,
              createdAt: "2024-01-01T00:00:00Z"
            },
            {
              id: 2,
              name: "GOLD",
              price: 1999,
              duration: "90",
              popular: true,
              status: "ACTIVE",
              features: [
                "Enhanced Profile Visibility",
                "Unlimited Swipes",
                "Priority Matching",
                "Message Read Receipts",
                "Advanced Search Filters",
                "Profile Analytics",
                "Priority Support"
              ],
              description: "Enhanced features for serious seekers",
              subscribers: 156,
              color: "yellow",
              trialPeriod: 7,
              maxConnections: 200,
              createdAt: "2024-01-01T00:00:00Z"
            },
            {
              id: 3,
              name: "DIAMOND",
              price: 2999,
              duration: "180",
              popular: false,
              status: "ACTIVE",
              features: [
                "Top Profile Visibility",
                "Unlimited Swipes",
                "VIP Priority Matching",
                "Advanced Analytics",
                "Dedicated Support",
                "Profile Highlighting",
                "Verified Profile Badge",
                "Match Guarantee",
                "Personalized Matchmaking"
              ],
              description: "Premium experience with exclusive features",
              subscribers: 67,
              color: "blue",
              trialPeriod: 14,
              maxConnections: -1, // Unlimited
              createdAt: "2024-01-01T00:00:00Z"
            }
          ],
          success: true
        });
      }, 1000);
    });
  },

  async createMembershipPlan(planData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: "Membership plan created successfully",
      plan: {
        id: Date.now(),
        ...planData,
        subscribers: 0,
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      }
    };
  },

  async updateMembershipPlan(planId, planData) {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      success: true,
      message: "Membership plan updated successfully",
      plan: {
        id: planId,
        ...planData
      }
    };
  },

  async deleteMembershipPlan(planId) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: "Membership plan deleted successfully",
      planId
    };
  },

  async toggleMembershipPlanStatus(planId, newStatus) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: `Membership plan ${newStatus.toLowerCase()} successfully`,
      planId,
      newStatus
    };
  },

  async bulkUpdateUsers(userIds, action) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `Successfully ${action}ed ${userIds.length} users`,
          affectedUsers: userIds.length
        });
      }, 1500);
    });
  },

  async getModerationQueue() {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      pendingProfiles: [
        {
          id: 101,
          name: "Rahul Verma",
          email: "rahul@example.com",
          status: "PENDING",
          submittedAt: "2024-03-20T10:30:00Z",
          verificationType: "PROFILE",
          verificationDocuments: ["ID Proof", "Photo Verification"],
          age: 29,
          location: "Delhi"
        },
        {
          id: 102,
          name: "Sonia Kapoor",
          email: "sonia@example.com",
          status: "PENDING",
          submittedAt: "2024-03-19T14:20:00Z",
          verificationType: "PROFILE",
          verificationDocuments: ["ID Proof", "Photo Verification"],
          age: 26,
          location: "Mumbai"
        }
      ],
      reportedContent: [
        {
          id: 1,
          type: "PROFILE",
          user: { id: 201, name: "John Doe", email: "john@example.com" },
          reason: "Inappropriate Photos",
          description: "Profile contains inappropriate images that violate community guidelines",
          reportedBy: { id: 202, name: "Jane Smith", email: "jane@example.com" },
          status: "PENDING",
          severity: "HIGH",
          category: "PROFILE_CONTENT",
          evidence: ["photo1.jpg", "photo2.jpg"],
          createdAt: "2024-03-20T14:30:00Z",
          updatedAt: "2024-03-20T14:30:00Z"
        },
        {
          id: 2,
          type: "MESSAGE",
          user: { id: 203, name: "Mike Johnson", email: "mike@example.com" },
          reason: "Harassment",
          description: "User sent multiple unsolicited messages with inappropriate content",
          reportedBy: { id: 204, name: "Sarah Wilson", email: "sarah@example.com" },
          status: "UNDER_REVIEW",
          severity: "CRITICAL",
          category: "BEHAVIOR",
          evidence: ["message1.png", "message2.png"],
          createdAt: "2024-03-19T16:45:00Z",
          updatedAt: "2024-03-20T09:15:00Z"
        }
      ],
      flaggedComments: [
        {
          id: 1,
          user: { id: 205, name: "Robert Brown", email: "robert@example.com" },
          comment: "This seems suspicious and potentially scammy behavior...",
          context: "In response to profile: Priya Sharma",
          reason: "Spam",
          status: "PENDING",
          severity: "MEDIUM",
          createdAt: "2024-03-21T11:20:00Z"
        },
        {
          id: 2,
          user: { id: 206, name: "Lisa Taylor", email: "lisa@example.com" },
          comment: "Very inappropriate and offensive language used in conversation",
          context: "In chat with: David Miller",
          reason: "Harassment",
          status: "PENDING",
          severity: "HIGH",
          createdAt: "2024-03-20T18:30:00Z"
        }
      ],
      success: true
    };
  },

  async getSuccessStories() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      stories: [
        {
          id: 1,
          couple: {
            bride: { 
              name: "Priya Sharma", 
              age: 28, 
              profession: "Software Engineer",
              joinedDate: "2022-03-15"
            },
            groom: { 
              name: "Rahul Kumar", 
              age: 30, 
              profession: "Doctor",
              joinedDate: "2022-02-20"
            }
          },
          story: "We found each other through this platform and connected instantly. Our values and life goals matched perfectly. After six months of dating, we got married in a beautiful ceremony surrounded by our loved ones. Thank you for helping us find our perfect match!",
          weddingDate: "2023-12-15",
          approved: true,
          featured: true,
          likes: 142,
          comments: 23,
          shares: 45,
          matchScore: 92,
          meetingLocation: "Mumbai",
          relationshipDuration: "8 months"
        },
        {
          id: 2,
          couple: {
            bride: { 
              name: "Anjali Patel", 
              age: 26, 
              profession: "Teacher",
              joinedDate: "2022-05-10"
            },
            groom: { 
              name: "Rohan Mehta", 
              age: 28, 
              profession: "Engineer",
              joinedDate: "2022-04-22"
            }
          },
          story: "It was love at first chat! We connected over our shared interests in travel and music. The compatibility algorithm really worked for us. We're now happily married and expecting our first child!",
          weddingDate: "2023-11-20",
          approved: true,
          featured: false,
          likes: 89,
          comments: 15,
          shares: 22,
          matchScore: 88,
          meetingLocation: "Delhi",
          relationshipDuration: "6 months"
        },
        {
          id: 3,
          couple: {
            bride: { 
              name: "Neha Gupta", 
              age: 27, 
              profession: "Architect",
              joinedDate: "2022-07-15"
            },
            groom: { 
              name: "Amit Singh", 
              age: 29, 
              profession: "Business Analyst",
              joinedDate: "2022-06-20"
            }
          },
          story: "We were both skeptical about online matrimony, but this platform proved us wrong. Our families connected instantly and everything fell into place perfectly!",
          weddingDate: "2023-10-08",
          approved: true,
          featured: true,
          likes: 156,
          comments: 34,
          shares: 67,
          matchScore: 95,
          meetingLocation: "Bangalore",
          relationshipDuration: "9 months"
        }
      ],
      success: true
    };
  },

  async getPaymentTransactions(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const payments = [
      {
        id: 'TXN_001',
        user: { 
          id: 1,
          name: 'Rajesh Kumar', 
          email: 'rajesh@example.com',
          membership: 'GOLD'
        },
        plan: 'GOLD',
        amount: 1999,
        originalAmount: 1999,
        tax: 360,
        discount: 0,
        status: 'COMPLETED',
        paymentMethod: 'Credit Card',
        paymentGateway: 'Razorpay',
        cardLast4: '4242',
        invoiceId: 'INV_2024_001',
        createdAt: '2024-03-15T10:30:00Z',
        completedAt: '2024-03-15T10:32:00Z'
      },
      {
        id: 'TXN_002',
        user: { 
          id: 8,
          name: 'Divya Iyer', 
          email: 'divya@example.com',
          membership: 'DIAMOND'
        },
        plan: 'DIAMOND',
        amount: 2999,
        originalAmount: 2999,
        tax: 540,
        discount: 0,
        status: 'COMPLETED',
        paymentMethod: 'UPI',
        paymentGateway: 'Stripe',
        upiId: 'divya@paytm',
        invoiceId: 'INV_2024_002',
        createdAt: '2024-03-14T14:20:00Z',
        completedAt: '2024-03-14T14:22:00Z'
      },
      {
        id: 'TXN_003',
        user: { 
          id: 5,
          name: 'Vikram Singh', 
          email: 'vikram@example.com',
          membership: 'GOLD'
        },
        plan: 'GOLD',
        amount: 1999,
        originalAmount: 1999,
        tax: 360,
        discount: 0,
        status: 'PENDING',
        paymentMethod: 'Debit Card',
        paymentGateway: 'Razorpay',
        cardLast4: '8888',
        invoiceId: 'INV_2024_003',
        createdAt: '2024-03-16T09:15:00Z'
      },
      {
        id: 'TXN_004',
        user: { 
          id: 3,
          name: 'Amit Patel', 
          email: 'amit@example.com',
          membership: 'DIAMOND'
        },
        plan: 'DIAMOND',
        amount: 2999,
        originalAmount: 2999,
        tax: 540,
        discount: 0,
        status: 'FAILED',
        paymentMethod: 'Net Banking',
        paymentGateway: 'Razorpay',
        bankName: 'HDFC Bank',
        failureReason: 'Insufficient funds',
        invoiceId: 'INV_2024_004',
        createdAt: '2024-03-13T16:45:00Z'
      },
      {
        id: 'TXN_005',
        user: { 
          id: 2,
          name: 'Priya Sharma', 
          email: 'priya@example.com',
          membership: 'SILVER'
        },
        plan: 'SILVER',
        amount: 999,
        originalAmount: 999,
        tax: 180,
        discount: 0,
        status: 'REFUNDED',
        paymentMethod: 'Credit Card',
        paymentGateway: 'Stripe',
        cardLast4: '1234',
        refundAmount: 999,
        refundReason: 'User requested cancellation',
        invoiceId: 'INV_2024_005',
        createdAt: '2024-03-12T11:30:00Z',
        refundedAt: '2024-03-13T10:15:00Z'
      }
    ];

    // Apply filters
    let filteredPayments = payments;
    if (filters.status && filters.status !== 'ALL') {
      filteredPayments = payments.filter(p => p.status === filters.status);
    }

    return {
      payments: filteredPayments,
      success: true,
      total: filteredPayments.length,
      totalRevenue: filteredPayments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0)
    };
  },

  async getAnalyticsData(timeRange = '7d') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const data = {
      '7d': {
        userGrowth: [65, 78, 90, 81, 86, 95, 100],
        matches: [12, 19, 15, 25, 22, 30, 28],
        revenue: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
        engagement: [45, 52, 48, 61, 55, 68, 72]
      },
      '30d': {
        userGrowth: Array.from({length: 30}, (_, i) => 100 + i * 8),
        matches: Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 10),
        revenue: Array.from({length: 30}, () => Math.floor(Math.random() * 5000) + 1000),
        engagement: Array.from({length: 30}, () => Math.floor(Math.random() * 30) + 40)
      },
      '90d': {
        userGrowth: Array.from({length: 90}, (_, i) => 100 + i * 3),
        matches: Array.from({length: 90}, () => Math.floor(Math.random() * 50) + 10),
        revenue: Array.from({length: 90}, () => Math.floor(Math.random() * 5000) + 1000),
        engagement: Array.from({length: 90}, () => Math.floor(Math.random() * 30) + 40)
      }
    };
    
    return {
      data: data[timeRange],
      success: true
    };
  },

  async getCompatibilityAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      topFactors: [
        { factor: 'Education Level', score: 92, importance: 'HIGH' },
        { factor: 'Family Background', score: 88, importance: 'HIGH' },
        { factor: 'Career Goals', score: 85, importance: 'HIGH' },
        { factor: 'Religious Beliefs', score: 82, importance: 'HIGH' },
        { factor: 'Lifestyle Preferences', score: 78, importance: 'MEDIUM' },
        { factor: 'Personality Traits', score: 75, importance: 'MEDIUM' },
        { factor: 'Hobbies & Interests', score: 72, importance: 'MEDIUM' },
        { factor: 'Geographic Preferences', score: 68, importance: 'LOW' }
      ],
      successRate: 78.5,
      totalMatches: 5678,
      avgCompatibilityScore: 76.2,
      success: true
    };
  },

  async getGeographicAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      cityDistribution: {
        'Mumbai': 234,
        'Delhi': 198,
        'Bangalore': 167,
        'Hyderabad': 145,
        'Chennai': 132,
        'Pune': 128,
        'Kolkata': 115,
        'Ahmedabad': 98,
        'Jaipur': 76,
        'Lucknow': 54
      },
      regionDistribution: {
        'North': 456,
        'South': 423,
        'West': 398,
        'East': 287,
        'Central': 234,
        'Northeast': 123
      },
      countryDistribution: {
        'India': 1897,
        'USA': 45,
        'UK': 32,
        'UAE': 28,
        'Canada': 25,
        'Australia': 18
      },
      success: true
    };
  },

  async getUserBehaviorAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalProfileViews: 12457,
      totalMessages: 8923,
      totalConnections: 5678,
      totalLikes: 23456,
      avgSessionDuration: '12m 34s',
      bounceRate: 28.5,
      returningUsers: 1247,
      peakActivityHours: [
        { hour: '7-9 PM', activity: '32%' },
        { hour: '8-10 AM', activity: '28%' },
        { hour: '12-2 PM', activity: '24%' },
        { hour: '10-12 PM', activity: '16%' }
      ],
      userSegments: [
        { segment: 'Highly Active', users: 456, growth: '+12%' },
        { segment: 'Moderately Active', users: 892, growth: '+8%' },
        { segment: 'Occasional', users: 567, growth: '+5%' },
        { segment: 'Inactive', users: 234, growth: '-3%' }
      ],
      success: true
    };
  },

  async getEngagementMetrics() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      dailyActiveUsers: 1247,
      weeklyActiveUsers: 8542,
      monthlyActiveUsers: 32415,
      averageSessionDuration: '12m 34s',
      messagesPerUser: 8.7,
      profileViewsPerUser: 15.2,
      matchRate: 23.4,
      retentionRate: 68.9,
      dailyEngagement: [65, 72, 68, 74, 78, 82, 85],
      weeklyRetention: [72, 70, 68, 71, 73, 75, 74],
      success: true
    };
  },

  async approveContent(contentId, contentType) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: `${contentType} approved successfully`,
      contentId,
      contentType
    };
  },

  async rejectContent(contentId, contentType, reason) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: `${contentType} rejected successfully`,
      contentId,
      contentType,
      reason
    };
  },

  async processRefund(transactionId, reason) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: "Refund processed successfully",
      transactionId,
      refundAmount: 2999,
      reason
    };
  },

  async retryPayment(transactionId) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: "Payment retried successfully",
      transactionId,
      newStatus: "COMPLETED"
    };
  },

  async featureSuccessStory(storyId, featured) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: featured ? "Story featured successfully" : "Story unfeatured successfully",
      storyId,
      featured
    };
  },

  async approveSuccessStory(storyId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: "Success story approved successfully",
      storyId,
      approved: true
    };
  },

  async deleteSuccessStory(storyId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: "Success story deleted successfully",
      storyId
    };
  },

  async getPhotoApprovalQueue() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      pendingPhotos: [
        {
          id: 1,
          user: { 
            id: 101, 
            name: "Neha Sharma", 
            email: "neha@example.com",
            age: 28,
            location: "Mumbai"
          },
          photos: [
            { 
              id: 'p1', 
              url: '', 
              description: 'Main Profile Photo', 
              status: 'PENDING',
              uploadedAt: '2024-03-20T14:30:00Z',
              size: '2.4 MB',
              dimensions: '1080x1350'
            },
            { 
              id: 'p2', 
              url: '', 
              description: 'Full Body Shot', 
              status: 'PENDING',
              uploadedAt: '2024-03-20T14:32:00Z',
              size: '3.1 MB',
              dimensions: '1080x1620'
            }
          ],
          submittedAt: '2024-03-20T14:30:00Z',
          totalPhotos: 5,
          pendingCount: 2
        },
        {
          id: 2,
          user: { 
            id: 102, 
            name: "Raj Kumar", 
            email: "raj@example.com",
            age: 32,
            location: "Delhi"
          },
          photos: [
            { 
              id: 'p3', 
              url: '', 
              description: 'Professional Headshot', 
              status: 'PENDING',
              uploadedAt: '2024-03-19T10:15:00Z',
              size: '1.8 MB',
              dimensions: '800x1000'
            }
          ],
          submittedAt: '2024-03-19T10:15:00Z',
          totalPhotos: 3,
          pendingCount: 1
        }
      ],
      success: true
    };
  },

  async approvePhoto(userId, photoId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: "Photo approved successfully",
      userId,
      photoId,
      status: "APPROVED"
    };
  },

  async rejectPhoto(userId, photoId, reason) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: "Photo rejected successfully",
      userId,
      photoId,
      status: "REJECTED",
      reason
    };
  }
};