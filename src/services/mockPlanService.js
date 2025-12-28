// src/services/mockPlanService.js
export const mockPlanService = {
  async getPlans() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const plans = [
      {
        id: 1,
        name: "Silver",
        description: "Essential features to start your journey",
        price: "299",
        duration: "1 months",
        featured: false,
        popular: false,
        color: "gray",
        features: [
          "Create Complete Profile",
          "Browse Limited Profiles Daily",
          "Send 10 Interests Monthly",
          "Basic Search Filters",
          "Email Support",
          "Profile Verification Available",
          "Mobile App Access"
        ],
        buttonText: "Get Started"
      },
      {
        id: 2,
        name: "Gold",
        description: "Enhanced features for serious seekers",
        price: "599",
        duration: "3 months",
        featured: true,
        popular: true,
        color: "gold",
        features: [
          "Unlimited Profile Views",
          "Priority in Search Results",
          "Send Unlimited Interests",
          "Advanced Search Filters",
          "View Contact Details",
          "Dedicated Support Manager",
          "Profile Highlighting",
          "Compatibility Reports",
          "Message Read Receipts",
          "Extended Profile Visibility"
        ],
        savings: "Save 40%",
        buttonText: "Go Gold"
      },
      {
        id: 3,
        name: "Diamond",
        description: "Ultimate personalized matchmaking experience",
        price: "999",
        duration: "6 months",
        featured: true,
        popular: false,
        color: "purple",
        features: [
          "All Gold Features",
          "Personal Matchmaking Assistant",
          "Video Profile Creation",
          "Premium Background Verification",
          "Astrology Compatibility Reports",
          "Family Mediation Services",
          "24/7 Priority Support",
          "Featured Profile Daily",
          "Verified Trust Badge",
          "Exclusive Events Access",
          "Relationship Counseling Sessions"
        ],
        savings: "Save 50%",
        buttonText: "Go Diamond"
      }
    ];

    return {
      data: plans,
      success: true,
      message: "Plans fetched successfully"
    };
  },

  async selectPlan(planId) {
    // Simulate API call for plan selection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `Plan ${planId} selected successfully`,
      paymentUrl: `/payment/${planId}`,
      orderId: `ORD_${Date.now()}`
    };
  },

  async getPlanDetails(planId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const plans = await this.getPlans();
    const plan = plans.data.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error("Plan not found");
    }
    
    return {
      data: plan,
      success: true
    };
  },

  // ADD THIS METHOD - Required for SubscriptionPage
  async getPlanById(planId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fallbackPlans = [
        {
          id: 1,
          name: "Silver",
          description: "Essential features to start your journey",
          price: "299",
          duration: "1 months",
          features: [
            "Create Complete Profile",
            "Browse Limited Profiles Daily", 
            "Send 10 Interests Monthly",
            "Basic Search Filters",
            "Email Support",
            "Profile Verification Available",
            "Mobile App Access"
          ],
          buttonText: "Get Started"
        },
        {
          id: 2,
          name: "Gold",
          description: "Enhanced features for serious seekers",
          price: "599",
          duration: "3 months",
          features: [
            "Unlimited Profile Views",
            "Priority in Search Results",
            "Send Unlimited Interests",
            "Advanced Search Filters",
            "View Contact Details",
            "Dedicated Support Manager",
            "Profile Highlighting",
            "Compatibility Reports",
            "Message Read Receipts",
            "Extended Profile Visibility"
          ],
          savings: "Save 40%",
          buttonText: "Go Gold"
        },
        {
          id: 3,
          name: "Diamond",
          description: "Ultimate personalized matchmaking experience",
          price: "999",
          duration: "6 months",
          features: [
            "All Gold Features",
            "Personal Matchmaking Assistant",
            "Video Profile Creation",
            "Premium Background Verification",
            "Astrology Compatibility Reports",
            "Family Mediation Services",
            "24/7 Priority Support",
            "Featured Profile Daily",
            "Verified Trust Badge",
            "Exclusive Events Access",
            "Relationship Counseling Sessions"
          ],
          savings: "Save 50%",
          buttonText: "Go Diamond"
        }
      ];
      
      const plan = fallbackPlans.find(p => p.id === planId);
      
      if (plan) {
        return {
          success: true,
          data: plan
        };
      } else {
        return {
          success: false,
          error: "Plan not found"
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ADDITIONAL METHOD - Process payment simulation
  async processPayment(planId, paymentDetails) {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        return {
          success: true,
          message: "Payment processed successfully",
          transactionId: `TXN_${Date.now()}`,
          planId: planId,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: "Payment failed. Please try again or use a different payment method."
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Payment processing error. Please try again."
      };
    }
  }
};