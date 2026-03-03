// src/services/mockPlanService.js
export const mockPlanService = {
  async getPlans() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const plans = [
      {
        id: 1,
        name: "Silver",
        description: "Your Future Partner is One Premium Step Away",
        price: "1000",
        duration: "3 months + tax",
        featured: false,
        popular: false,
        color: "gray",
        features: [
          "View More Verified Profiles",
          "Send limited Interests",
          "Access Basic Contact Details",
          "Priority Profile Listing",
          "Secure contact with Interested Members",
          "Dedicated Customer Support"

        ],
        buttonText: "Get Started"
      },
      {
        id: 2,
        name: "Gold",
        description: "Verified Matches. Unlimited Access. Premium Advantage",
        price: "2000",
        duration: " 3 months +tax ",
        featured: true,
        popular: true,
        color: "gold",
        features: [
           "Unlimited Profile Views",
           "Direct Contact Details Access",
           "Unlimited Chat & Messaging",
           "Send & Receive Unlimited Interests",
           "Top Priority Profile Visibility",
           "Advanced Match Filters",
           "Dedicated Relationship Manager Support",
           "Profile Highlight in Search Results"

        ],
        savings: "Save 20%",
        buttonText: "Go Gold"
      },
      {
        id: 3,
        name: "Diamond",
        description: "Join Premium Today – Experience Elite Matchmaking",
        price: "3000",
        duration: " 3 months +tax ",
        featured: true,
        popular: false,
        color: "purple",
        features: [
           "Unlimited Profile Views & Direct Contact Access",
           "Top Priority Placement in All Search Results",
           "Featured “Diamond Profile” Badge",
           "Unlimited Chat, Interests & Requests",
           "Advanced Matchmaking Filters",
           "Dedicated Relationship Manager",
           "Personal Match Recommendations",
           "Profile Highlight in Premium Listings",
           "Faster Response & Priority Support"

        ],
        savings: "Save 30%",
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
          description: "Your Future Partner is One Premium Step Away",
          price: "1000",
          duration: "3 months + Tax",
          features: [
            "View More Verified Profiles",
            "Send limited Interests",
            "Access Basic Contact Details",
            "Priority Profile Listing",
            "Secure contact with Interested Members",
            "Dedicated Customer Support",
          ],
          buttonText: "Get Started"
        },
        {
          id: 2,
          name: "Gold",
          description: "Verified Matches. Unlimited Access. Premium Advantage",
          price: "2000",
          duration: "3 months + Tax",
          features: [
             "Unlimited Profile Views",
             "Direct Contact Details Access",
             "Unlimited Chat & Messaging",
             "Send & Receive Unlimited Interests",
             "Top Priority Profile Visibility",
             "Advanced Match Filters",
             "Dedicated Relationship Manager Support",
             "Profile Highlight in Search Results",

          ],
          savings: "Save 40%",
          buttonText: "Go Gold"
        },
        {
          id: 3,
          name: "Diamond",
          description: "Join Premium Today – Experience Elite Matchmaking",
          price: "3000",
          duration: "3 months + Tax",
          features: [
             "Unlimited Profile Views & Direct Contact Access",
             "Top Priority Placement in All Search Results",
             "Featured “Diamond Profile” Badge",
             "Unlimited Chat, Interests & Requests",
             "Advanced Matchmaking Filters",
             "Dedicated Relationship Manager",
             "Personal Match Recommendations",
             "Profile Highlight in Premium Listings",
             "Faster Response & Priority Support",
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