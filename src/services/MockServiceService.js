// src/services/MockServiceService.js
// Mock service data for Services page

import {
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  CakeIcon,
  HeartIcon as HeartOutlineIcon
} from "@heroicons/react/24/solid";

// Mock data - Updated with only the 5 specified categories (no pricing)
const mockServices = [
  // 1. Free & Premium Membership Plans
  {
    id: 1,
    name: "Free Membership",
    description:
      "Start your journey with our free basic membership - create profile, browse matches, and send limited interests.",
    duration: "Lifetime Access",
    category: "membership",
    featured: true,
    popular: true,
    icon: HeartOutlineIcon,
    features: [
      "Basic Profile Creation",
      "Limited Match Browsing",
      "5 Interests per Month",
      "Community Access"
    ],
    badge: "Most Popular"
  },
  {
    id: 2,
    name: "Premium Membership",
    description:
      "Unlock advanced features with premium membership for faster and better matchmaking results.",
    duration: "1 Year Plan",
    category: "membership",
    featured: true,
    icon: StarIcon,
    features: [
      "Unlimited Matches",
      "Priority Visibility",
      "Advanced Search Filters",
      "Dedicated Support"
    ],
  },

  // 2. Profile Verification & Privacy Controls
  {
    id: 3,
    name: "Profile Verification",
    description:
      "Complete background verification and profile authentication for enhanced trust and security.",
    duration: "One-time Process",
    category: "verification",
    featured: true,
    icon: ShieldCheckIcon,
    features: [
      "ID Document Verification",
      "Background Check",
      "Trust Verification Badge",
      "Enhanced Profile Visibility"
    ],
  },
  {
    id: 4,
    name: "Privacy Controls",
    description:
      "Advanced privacy settings to control who sees your profile and personal information.",
    duration: "Lifetime Access",
    category: "verification",
    icon: ShieldCheckIcon,
    features: [
      "Profile Visibility Controls",
      "Photo Privacy Settings",
      "Contact Information Protection",
      "Stealth Browse Mode"
    ],
  },

  // 4. Assisted Matrimony / Relationship Manager Services
  {
    id: 5,
    name: "Assisted Matrimony",
    description:
      "Dedicated relationship manager to guide you through the entire matchmaking process with personalized support.",
    duration: "Custom Duration",
    category: "assisted",
    featured: true,
    icon: UserGroupIcon,
    features: [
      "Personal Relationship Manager",
      "Customized Matchmaking",
      "Family Coordination Support",
      "End-to-End Process Management"
    ],
  },

  // 5. Wedding Planning & Vendor Assistance (optional)
  {
    id: 6,
    name: "Wedding Planning Assistance",
    description:
      "Complete wedding planning support with trusted vendors, venue selection, and coordination services.",
    duration: "As Needed",
    category: "wedding",
    icon: CakeIcon,
    features: [
      "Vendor Recommendations",
      "Budget Planning Assistance",
      "Venue Selection Support",
      "Wedding Day Coordination"
    ],
  }
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class MockServiceService {
  async getServices() {
    await delay(800);
    console.log("🔄 MockServiceService: Fetching services");

    return {
      success: true,
      services: mockServices,
      total: mockServices.length,
    };
  }

  async getServiceById(id) {
    await delay(500);
    const service = mockServices.find((s) => s.id === parseInt(id));
    if (!service) throw new Error("Service not found");

    return { success: true, service };
  }

  async getServicesByCategory(category) {
    await delay(600);
    const categoryServices = mockServices.filter(
      (service) => service.category === category
    );
    return {
      success: true,
      services: categoryServices,
      category,
      total: categoryServices.length,
    };
  }

  // New method to get service categories
  async getServiceCategories() {
    await delay(300);
    const categories = [
      { id: "all", name: "All Services", count: mockServices.length },
      { id: "membership", name: "Membership Plans", count: mockServices.filter(s => s.category === "membership").length },
      { id: "verification", name: "Verification & Privacy", count: mockServices.filter(s => s.category === "verification").length },
      { id: "matching", name: "Match Recommendations", count: mockServices.filter(s => s.category === "matching").length },
      { id: "assisted", name: "Assisted Matrimony", count: mockServices.filter(s => s.category === "assisted").length },
      { id: "wedding", name: "Wedding Assistance", count: mockServices.filter(s => s.category === "wedding").length }
    ];
    
    return {
      success: true,
      categories
    };
  }

  // New method to get featured services
  async getFeaturedServices() {
    await delay(400);
    const featuredServices = mockServices.filter(service => service.featured || service.popular);
    
    return {
      success: true,
      services: featuredServices,
      total: featuredServices.length
    };
  }

  // New method to get free services
  async getFreeServices() {
    await delay(400);
    const freeServices = mockServices.filter(service => service.name.includes("Free"));
    
    return {
      success: true,
      services: freeServices,
      total: freeServices.length
    };
  }
}

export const mockServiceService = new MockServiceService();