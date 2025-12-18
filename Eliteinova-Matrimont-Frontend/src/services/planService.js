// src/services/planService.js
import api from '../api/axios';

export const planService = {
  // Get all active plans
  getActivePlans: async () => {
    try {
      const response = await api.get('/plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch plans' };
    }
  },

  // Get all plans (including inactive - for admin)
  getAllPlans: async () => {
    try {
      const response = await api.get('/plans/admin/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch all plans' };
    }
  },

  // Get plan by ID
  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch plan' };
    }
  }
};